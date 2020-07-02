import path from 'path'
import {
  createCompoundExpression,
  createSimpleExpression,
  NodeTransform,
  NodeTypes,
  SimpleExpressionNode
} from '@vue/compiler-core'
import {
  isRelativeUrl,
  parseUrl,
  isExternalUrl,
  isDataUrl
} from './templateUtils'
import {
  AssetURLOptions,
  defaultAssetUrlOptions
} from './templateTransformAssetUrl'

const srcsetTags = ['img', 'source']

interface ImageCandidate {
  url: string
  descriptor: string
}

// http://w3c.github.io/html/semantics-embedded-content.html#ref-for-image-candidate-string-5
const escapedSpaceCharacters = /( |\\t|\\n|\\f|\\r)+/g

export const createSrcsetTransformWithOptions = (
  options: Required<AssetURLOptions>
): NodeTransform => {
  return (node, context) =>
    (transformSrcset as Function)(node, context, options)
}

export const transformSrcset: NodeTransform = (
  node,
  context,
  options: Required<AssetURLOptions> = defaultAssetUrlOptions
) => {
  if (node.type === NodeTypes.ELEMENT) {
    if (srcsetTags.includes(node.tag) && node.props.length) {
      node.props.forEach((attr, index) => {
        if (attr.name === 'srcset' && attr.type === NodeTypes.ATTRIBUTE) {
          if (!attr.value) return
          const value = attr.value.content

          const imageCandidates: ImageCandidate[] = value.split(',').map(s => {
            // The attribute value arrives here with all whitespace, except
            // normal spaces, represented by escape sequences
            const [url, descriptor] = s
              .replace(escapedSpaceCharacters, ' ')
              .trim()
              .split(' ', 2)
            return { url, descriptor }
          })

          // for data url need recheck url
          for (let i = 0; i < imageCandidates.length; i++) {
            if (imageCandidates[i].url.trim().startsWith('data:')) {
              imageCandidates[i + 1].url =
                imageCandidates[i].url + ',' + imageCandidates[i + 1].url
              imageCandidates.splice(i, 1)
            }
          }

          // When srcset does not contain any relative URLs, skip transforming
          if (
            !options.includeAbsolute &&
            !imageCandidates.some(({ url }) => isRelativeUrl(url))
          ) {
            return
          }

          if (options.base) {
            const base = options.base
            const set: string[] = []
            imageCandidates.forEach(({ url, descriptor }) => {
              descriptor = descriptor ? ` ${descriptor}` : ``
              if (isRelativeUrl(url)) {
                set.push((path.posix || path).join(base, url) + descriptor)
              } else {
                set.push(url + descriptor)
              }
            })
            attr.value.content = set.join(', ')
            return
          }

          const compoundExpression = createCompoundExpression([], attr.loc)
          imageCandidates.forEach(({ url, descriptor }, index) => {
            if (
              !isExternalUrl(url) &&
              !isDataUrl(url) &&
              (options.includeAbsolute || isRelativeUrl(url))
            ) {
              const { path } = parseUrl(url)
              let exp: SimpleExpressionNode
              if (path) {
                const importsArray = Array.from(context.imports)
                const existingImportsIndex = importsArray.findIndex(
                  i => i.path === path
                )
                if (existingImportsIndex > -1) {
                  exp = createSimpleExpression(
                    `_imports_${existingImportsIndex}`,
                    false,
                    attr.loc,
                    true
                  )
                } else {
                  exp = createSimpleExpression(
                    `_imports_${importsArray.length}`,
                    false,
                    attr.loc,
                    true
                  )
                  context.imports.add({ exp, path })
                }
                compoundExpression.children.push(exp)
              }
            } else {
              const exp = createSimpleExpression(
                `"${url}"`,
                false,
                attr.loc,
                true
              )
              compoundExpression.children.push(exp)
            }
            const isNotLast = imageCandidates.length - 1 > index
            if (descriptor && isNotLast) {
              compoundExpression.children.push(` + '${descriptor}, ' + `)
            } else if (descriptor) {
              compoundExpression.children.push(` + '${descriptor}'`)
            } else if (isNotLast) {
              compoundExpression.children.push(` + ', ' + `)
            }
          })

          const hoisted = context.hoist(compoundExpression)
          hoisted.isRuntimeConstant = true

          node.props[index] = {
            type: NodeTypes.DIRECTIVE,
            name: 'bind',
            arg: createSimpleExpression('srcset', true, attr.loc),
            exp: hoisted,
            modifiers: [],
            loc: attr.loc
          }
        }
      })
    }
  }
}
