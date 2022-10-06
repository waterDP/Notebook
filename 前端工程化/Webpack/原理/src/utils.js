/*
 * @Author: water.li
 * @Date: 2022-10-06 16:09:13
 * @Description: 
 * @FilePath: \note\前端工程化\Webpack\原理\src\utils.js
 */
function toUnixPath(path) {
  return path.replace(/\\/g, '/')
}

module.exports = toUnixPath