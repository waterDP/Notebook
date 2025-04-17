// jest默认不支持module类型，所以模拟支持module的环境
export const rawDocumentCreateElement = Document.prototype.createElement
Document.prototype.createElement = function (tagName: string, options?: ElementCreationOptions): HTMLElement {
  const element = rawDocumentCreateElement.call(document, tagName, options)
  // @ts-ignore
  if (tagName === 'script') element.noModule = false
  return element
}

export const rawSetAttribute = Element.prototype.setAttribute
Element.prototype.setAttribute = function setAttribute (key: string, value: string): void {
  if (/^script$/i.test(this.tagName)) {
    if (key === 'noModule') {
      // @ts-ignore
      this.noModule = true
    } else if (key === 'module') {
      // @ts-ignore
      this.type = 'module'
    }
  }

  rawSetAttribute.call(this, key, value)
}
