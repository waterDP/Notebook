/*
 * @Author: water.li
 * @Date: 2023-04-07 20:32:28
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-dom-bindings\src\client\CSSPropertyOperations.js
 */
export function setValueForStyles(node, styles) {
  const { style } = node;
  // styles = {color: 'red'}
  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const styleValue = styles[styleName];
      style[styleName] = styleValue;
    }
  }
}
