import {
  NodeTransform,
  NodeTypes,
  ElementTypes,
  createCallExpression,
  resolveComponentType,
  buildProps,
  ComponentNode,
  SlotFnBuilder,
  createFunctionExpression,
  buildSlots,
  FunctionExpression,
  TemplateChildNode,
  TELEPORT,
  createIfStatement,
  createSimpleExpression,
  getBaseTransformPreset,
  DOMNodeTransforms,
  DOMDirectiveTransforms,
  createReturnStatement,
  ReturnStatement,
  Namespaces,
  locStub,
  RootNode,
  TransformContext,
  CompilerOptions,
  TransformOptions,
  createRoot,
  createTransformContext,
  traverseNode,
  ExpressionNode,
  TemplateNode,
  SUSPENSE,
  TRANSITION_GROUP
} from '@vue/compiler-dom'
import { SSR_RENDER_COMPONENT } from '../runtimeHelpers'
import {
  SSRTransformContext,
  processChildren,
  processChildrenAsStatement
} from '../ssrCodegenTransform'
import { ssrProcessTeleport } from './ssrTransformTeleport'
import {
  ssrProcessSuspense,
  ssrTransformSuspense
} from './ssrTransformSuspense'
import { isSymbol, isObject, isArray } from '@vue/shared'

// We need to construct the slot functions in the 1st pass to ensure proper
// scope tracking, but the children of each slot cannot be processed until
// the 2nd pass, so we store the WIP slot functions in a weakmap during the 1st
// pass and complete them in the 2nd pass.
const wipMap = new WeakMap<ComponentNode, WIPSlotEntry[]>()

interface WIPSlotEntry {
  fn: FunctionExpression
  children: TemplateChildNode[]
  vnodeBranch: ReturnStatement
}

const componentTypeMap = new WeakMap<ComponentNode, symbol>()

// ssr component transform is done in two phases:
// In phase 1. we use `buildSlot` to analyze the children of the component into
// WIP slot functions (it must be done in phase 1 because `buildSlot` relies on
// the core transform context).
// In phase 2. we convert the WIP slots from phase 1 into ssr-specific codegen
// nodes.
export const ssrTransformComponent: NodeTransform = (node, context) => {
  if (
    node.type !== NodeTypes.ELEMENT ||
    node.tagType !== ElementTypes.COMPONENT
  ) {
    return
  }

  const component = resolveComponentType(node, context, true /* ssr */)
  if (isSymbol(component)) {
    componentTypeMap.set(node, component)
    if (component === SUSPENSE) {
      return ssrTransformSuspense(node, context)
    }
    return // built-in component: fallthrough
  }

  // Build the fallback vnode-based branch for the component's slots.
  // We need to clone the node into a fresh copy and use the buildSlots' logic
  // to get access to the children of each slot. We then compile them with
  // a child transform pipeline using vnode-based transforms (instead of ssr-
  // based ones), and save the result branch (a ReturnStatement) in an array.
  // The branch is retrieved when processing slots again in ssr mode.
  const vnodeBranches: ReturnStatement[] = []
  const clonedNode = clone(node)

  return function ssrPostTransformComponent() {
    // Using the cloned node, build the normal VNode-based branches (for
    // fallback in case the child is render-fn based). Store them in an array
    // for later use.
    if (clonedNode.children.length) {
      buildSlots(clonedNode, context, (props, children) => {
        vnodeBranches.push(createVNodeSlotBranch(props, children, context))
        return createFunctionExpression(undefined)
      })
    }

    const props =
      node.props.length > 0
        ? // note we are not passing ssr: true here because for components, v-on
          // handlers should still be passed
          buildProps(node, context).props || `null`
        : `null`

    const wipEntries: WIPSlotEntry[] = []
    wipMap.set(node, wipEntries)

    const buildSSRSlotFn: SlotFnBuilder = (props, children, loc) => {
      const fn = createFunctionExpression(
        [props || `_`, `_push`, `_parent`, `_scopeId`],
        undefined, // no return, assign body later
        true, // newline
        true, // isSlot
        loc
      )
      wipEntries.push({
        fn,
        children,
        // also collect the corresponding vnode branch built earlier
        vnodeBranch: vnodeBranches[wipEntries.length]
      })
      return fn
    }

    const slots = node.children.length
      ? buildSlots(node, context, buildSSRSlotFn).slots
      : `null`

    node.ssrCodegenNode = createCallExpression(
      context.helper(SSR_RENDER_COMPONENT),
      [component, props, slots, `_parent`]
    )
  }
}

export function ssrProcessComponent(
  node: ComponentNode,
  context: SSRTransformContext
) {
  if (!node.ssrCodegenNode) {
    // this is a built-in component that fell-through.
    const component = componentTypeMap.get(node)!
    if (component === TELEPORT) {
      return ssrProcessTeleport(node, context)
    } else if (component === SUSPENSE) {
      return ssrProcessSuspense(node, context)
    } else {
      // real fall-through (e.g. KeepAlive): just render its children.
      processChildren(node.children, context, component === TRANSITION_GROUP)
    }
  } else {
    // finish up slot function expressions from the 1st pass.
    const wipEntries = wipMap.get(node) || []
    for (let i = 0; i < wipEntries.length; i++) {
      const { fn, children, vnodeBranch } = wipEntries[i]
      // For each slot, we generate two branches: one SSR-optimized branch and
      // one normal vnode-based branch. The branches are taken based on the
      // presence of the 2nd `_push` argument (which is only present if the slot
      // is called by `_ssrRenderSlot`.
      fn.body = createIfStatement(
        createSimpleExpression(`_push`, false),
        processChildrenAsStatement(
          children,
          context,
          false,
          true /* withSlotScopeId */
        ),
        vnodeBranch
      )
    }
    context.pushStatement(createCallExpression(`_push`, [node.ssrCodegenNode]))
  }
}

export const rawOptionsMap = new WeakMap<RootNode, CompilerOptions>()

const [baseNodeTransforms, baseDirectiveTransforms] = getBaseTransformPreset(
  true
)
const vnodeNodeTransforms = [...baseNodeTransforms, ...DOMNodeTransforms]
const vnodeDirectiveTransforms = {
  ...baseDirectiveTransforms,
  ...DOMDirectiveTransforms
}

function createVNodeSlotBranch(
  props: ExpressionNode | undefined,
  children: TemplateChildNode[],
  parentContext: TransformContext
): ReturnStatement {
  // apply a sub-transform using vnode-based transforms.
  const rawOptions = rawOptionsMap.get(parentContext.root)!
  const subOptions = {
    ...rawOptions,
    // overwrite with vnode-based transforms
    nodeTransforms: [
      ...vnodeNodeTransforms,
      ...(rawOptions.nodeTransforms || [])
    ],
    directiveTransforms: {
      ...vnodeDirectiveTransforms,
      ...(rawOptions.directiveTransforms || {})
    }
  }

  // wrap the children with a wrapper template for proper children treatment.
  const wrapperNode: TemplateNode = {
    type: NodeTypes.ELEMENT,
    ns: Namespaces.HTML,
    tag: 'template',
    tagType: ElementTypes.TEMPLATE,
    isSelfClosing: false,
    // important: provide v-slot="props" on the wrapper for proper
    // scope analysis
    props: [
      {
        type: NodeTypes.DIRECTIVE,
        name: 'slot',
        exp: props,
        arg: undefined,
        modifiers: [],
        loc: locStub
      }
    ],
    children,
    loc: locStub,
    codegenNode: undefined
  }
  subTransform(wrapperNode, subOptions, parentContext)
  return createReturnStatement(children)
}

function subTransform(
  node: TemplateChildNode,
  options: TransformOptions,
  parentContext: TransformContext
) {
  const childRoot = createRoot([node])
  const childContext = createTransformContext(childRoot, options)
  // this sub transform is for vnode fallback branch so it should be handled
  // like normal render functions
  childContext.ssr = false
  // inherit parent scope analysis state
  childContext.scopes = { ...parentContext.scopes }
  childContext.identifiers = { ...parentContext.identifiers }
  // traverse
  traverseNode(childRoot, childContext)
  // merge helpers/components/directives/imports into parent context
  ;(['helpers', 'components', 'directives', 'imports'] as const).forEach(
    key => {
      childContext[key].forEach((value: any) => {
        ;(parentContext[key] as any).add(value)
      })
    }
  )
}

function clone(v: any): any {
  if (isArray(v)) {
    return v.map(clone)
  } else if (isObject(v)) {
    const res: any = {}
    for (const key in v) {
      res[key] = clone(v[key])
    }
    return res
  } else {
    return v
  }
}
