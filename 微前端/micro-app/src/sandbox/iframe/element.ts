import type {
  microAppWindowType,
} from '@micro-app/types'
import type IframeSandbox from './index'
import globalEnv from '../../libs/global_env'
import {
  rawDefineProperty,
  CompletionPath,
  isScriptElement,
  isBaseElement,
  isElement,
  isNode,
  isDocumentFragment,
  isFunction,
  isBrowser,
} from '../../libs/utils'
import {
  updateElementInfo,
  getIframeParentNodeDesc,
} from '../adapter'
import microApp from '../../micro_app'

/**
 * patch Element & Node of child app
 * @param appName app name
 * @param url app url
 * @param microAppWindow microWindow of child app
 * @param sandbox IframeSandbox
 */
export function patchElement (
  appName: string,
  url: string,
  microAppWindow: microAppWindowType,
  sandbox: IframeSandbox,
): void {
  patchIframeNode(appName, microAppWindow, sandbox)
  patchIframeAttribute(url, microAppWindow, appName)
}

/**
 * patch iframe Node/Element
 *
 */
function patchIframeNode (
  appName: string,
  microAppWindow: microAppWindowType,
  sandbox: IframeSandbox,
): void {
  const rawRootElement = globalEnv.rawRootElement // native root Element
  const rawRootNode = globalEnv.rawRootNode
  const rawDocument = globalEnv.rawDocument
  const microDocument = microAppWindow.document
  const microRootNode = microAppWindow.Node
  const microRootElement = microAppWindow.Element
  const microDocumentFragment = microAppWindow.DocumentFragment
  // const rawMicroGetRootNode = microRootNode.prototype.getRootNode
  const rawMicroAppendChild = microRootNode.prototype.appendChild
  const rawMicroInsertBefore = microRootNode.prototype.insertBefore
  const rawMicroReplaceChild = microRootNode.prototype.replaceChild
  const rawMicroRemoveChild = microRootNode.prototype.removeChild
  const rawMicroAppend = microRootElement.prototype.append
  const rawMicroPrepend = microRootElement.prototype.prepend
  const rawMicroFragmentAppend = microDocumentFragment.prototype.append
  const rawMicroFragmentPrepend = microDocumentFragment.prototype.prepend
  const rawMicroInsertAdjacentElement = microRootElement.prototype.insertAdjacentElement
  const rawMicroCloneNode = microRootNode.prototype.cloneNode
  const rawInnerHTMLDesc = Object.getOwnPropertyDescriptor(microRootElement.prototype, 'innerHTML')!
  const rawParentNodeDesc = Object.getOwnPropertyDescriptor(microRootNode.prototype, 'parentNode')!
  const rawOwnerDocumentDesc = Object.getOwnPropertyDescriptor(microRootNode.prototype, 'ownerDocument')!

  const isPureNode = (target: unknown): boolean | void => {
    return (isScriptElement(target) || isBaseElement(target)) && target.__PURE_ELEMENT__
  }

  const getRawTarget = (parent: Node): Node => {
    if (parent === sandbox.microHead) {
      return rawDocument.head
    } else if (parent === sandbox.microBody) {
      return rawDocument.body
    }

    return parent
  }

  microRootNode.prototype.appendChild = function appendChild <T extends Node> (node: T): T {
    updateElementInfo(node, appName)
    if (isPureNode(node)) {
      return rawMicroAppendChild.call(this, node)
    }
    return rawRootNode.prototype.appendChild.call(getRawTarget(this), node)
  }

  microRootNode.prototype.insertBefore = function insertBefore <T extends Node> (node: T, child: Node | null): T {
    updateElementInfo(node, appName)
    if (isPureNode(node)) {
      return rawMicroInsertBefore.call(this, node, child)
    }
    return rawRootNode.prototype.insertBefore.call(getRawTarget(this), node, child)
  }

  microRootNode.prototype.replaceChild = function replaceChild <T extends Node> (node: Node, child: T): T {
    updateElementInfo(node, appName)
    if (isPureNode(node)) {
      return rawMicroReplaceChild.call(this, node, child)
    }
    return rawRootNode.prototype.replaceChild.call(getRawTarget(this), node, child)
  }

  microRootNode.prototype.removeChild = function removeChild<T extends Node> (oldChild: T): T {
    if (isPureNode(oldChild) || this.contains(oldChild)) {
      return rawMicroRemoveChild.call(this, oldChild)
    }
    return rawRootNode.prototype.removeChild.call(getRawTarget(this), oldChild)
  }

  microDocumentFragment.prototype.append = microRootElement.prototype.append = function append (...nodes: (Node | string)[]): void {
    let i = 0; let hasPureNode = false
    while (i < nodes.length) {
      nodes[i] = isNode(nodes[i]) ? nodes[i] : microDocument.createTextNode(nodes[i])
      if (isPureNode(nodes[i])) hasPureNode = true
      i++
    }
    if (hasPureNode) {
      return (isDocumentFragment(this) ? rawMicroFragmentAppend : rawMicroAppend).call(this, ...nodes)
    }
    return rawRootElement.prototype.append.call(getRawTarget(this), ...nodes)
  }

  microDocumentFragment.prototype.prepend = microRootElement.prototype.prepend = function prepend (...nodes: (Node | string)[]): void {
    let i = 0; let hasPureNode = false
    while (i < nodes.length) {
      nodes[i] = isNode(nodes[i]) ? nodes[i] : microDocument.createTextNode(nodes[i])
      if (isPureNode(nodes[i])) hasPureNode = true
      i++
    }
    if (hasPureNode) {
      return (isDocumentFragment(this) ? rawMicroFragmentPrepend : rawMicroPrepend).call(this, ...nodes)
    }
    return rawRootElement.prototype.prepend.call(getRawTarget(this), ...nodes)
  }

  /**
   * The insertAdjacentElement method of the Element interface inserts a given element node at a given position relative to the element it is invoked upon.
   * Scenes:
   *  1. vite4 development env for style
   */
  microRootElement.prototype.insertAdjacentElement = function insertAdjacentElement (where: InsertPosition, element: Element): Element | null {
    updateElementInfo(element, appName)
    if (isPureNode(element)) {
      return rawMicroInsertAdjacentElement.call(this, where, element)
    }
    return rawRootElement.prototype.insertAdjacentElement.call(getRawTarget(this), where, element)
  }

  /**
   * Specific prototype properties:
   * 1. baseURI
   * 2. ownerDocument
   * 3. parentNode
   * 4. innerHTML
   */
  rawDefineProperty(microRootNode.prototype, 'baseURI', {
    configurable: true,
    enumerable: true,
    get () {
      return sandbox.proxyWindow.location.href
    },
  })

  rawDefineProperty(microRootNode.prototype, 'ownerDocument', {
    configurable: true,
    enumerable: true,
    get () {
      return this.__PURE_ELEMENT__ || this === microDocument
        ? rawOwnerDocumentDesc.get?.call(this)
        : microDocument
    },
  })

  // patch parentNode
  rawDefineProperty(microRootNode.prototype, 'parentNode', getIframeParentNodeDesc(
    appName,
    rawParentNodeDesc,
  ))

  microRootNode.prototype.getRootNode = function getRootNode (): Node {
    return microDocument
    // TODO: any case return document?
    // const rootNode = rawMicroGetRootNode.call(this, options)
    // if (rootNode === appInstanceMap.get(appName)?.container) return microDocument
    // return rootNode
  }

  // patch cloneNode
  microRootNode.prototype.cloneNode = function cloneNode (deep?: boolean): Node {
    const clonedNode = rawMicroCloneNode.call(this, deep)
    return updateElementInfo(clonedNode, appName)
  }

  rawDefineProperty(microRootElement.prototype, 'innerHTML', {
    configurable: true,
    enumerable: true,
    get () {
      return rawInnerHTMLDesc.get?.call(this)
    },
    set (code: string) {
      rawInnerHTMLDesc.set?.call(this, code)
      Array.from(this.children).forEach((child) => {
        if (isElement(child)) {
          updateElementInfo(child, appName)
        }
      })
    }
  })

  // Adapt to new image(...) scene
  const ImageProxy = new Proxy(microAppWindow.Image, {
    construct (Target, args): HTMLImageElement {
      const elementImage = new Target(...args)
      updateElementInfo(elementImage, appName)
      return elementImage
    },
  })

  rawDefineProperty(microAppWindow, 'Image', {
    configurable: true,
    writable: true,
    value: ImageProxy,
  })
}

function patchIframeAttribute (url: string, microAppWindow: microAppWindowType, appName: string): void {
  const microRootElement = microAppWindow.Element
  const rawMicroSetAttribute = microRootElement.prototype.setAttribute

  microRootElement.prototype.setAttribute = function setAttribute (key: string, value: any): void {
    if (
      /^micro-app(-\S+)?/i.test(this.tagName) &&
      key === 'data' &&
      this.setAttribute !== microRootElement.prototype.setAttribute
    ) {
      this.setAttribute(key, value)
    } else {
      const aHrefResolver = microApp?.options?.aHrefResolver
      if (key === 'href' && /^a$/i.test(this.tagName) && typeof aHrefResolver === 'function') {
        // 试验性质：a 标签开放自定义补齐功能
        value = aHrefResolver(value, appName, url)
      } else if (
        ((key === 'src' || key === 'srcset') && /^(img|script|video|audio|source|embed)$/i.test(this.tagName)) ||
        (key === 'href' && /^(link|image)$/i.test(this.tagName)) ||
        // If it is the anchor tag,eg. <a href="#xxx"/>, the path will not be completed
        (key === 'href' && /^(a)$/i.test(this.tagName) && !/^#/.test(value))
      ) {
        let _url = url
        if (isBrowser && key === 'href' && /^a$/i.test(this.tagName) && isFunction(microApp.options.excludeAssetFilter) && microApp.options.excludeAssetFilter(value)) {
          _url = document.baseURI
        }
        value = CompletionPath(value, _url)
      }
      rawMicroSetAttribute.call(this, key, value)
    }
  }

  const protoAttrList: Array<[HTMLElement, string]> = [
    [microAppWindow.HTMLImageElement.prototype, 'src'],
    [microAppWindow.HTMLScriptElement.prototype, 'src'],
    [microAppWindow.HTMLLinkElement.prototype, 'href'],
    [microAppWindow.SVGImageElement.prototype, 'href'],
  ]

  /**
   * element.setAttribute does not trigger this actions:
   *  1. img.src = xxx
   *  2. script.src = xxx
   *  3. link.href = xxx
   */
  protoAttrList.forEach(([target, attr]) => {
    const { enumerable, configurable, get, set } = Object.getOwnPropertyDescriptor(target, attr) || {
      enumerable: true,
      configurable: true,
    }

    rawDefineProperty(target, attr, {
      enumerable,
      configurable,
      get: function () {
        return get?.call(this)
      },
      set: function (value) {
        set?.call(this, CompletionPath(value, url))
      },
    })
  })
}
