/*
 * @Description: 
 * @Date: 2021-07-22 11:56:48
 * @Author: water.li
 */

import parseTemplateToTokens from './parseTemplateToTokens'

window.mustache = {
  render(templateStr, data) {
    const tokens = parseTemplateToTokens(templateStr)

  }
}