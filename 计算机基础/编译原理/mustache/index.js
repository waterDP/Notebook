/*
 * @Description: 
 * @Date: 2021-07-22 11:56:48
 * @Author: water.li
 */

import parseTemplateToTokens from './parseTemplateToTokens'
import renderTemplate from './renderTemplate';

window.mustache = {
  render(templateStr, data) {
    const tokens = parseTemplateToTokens(templateStr)
    const domStr = renderTemplate(tokens, data)
    return domStr
  }
}