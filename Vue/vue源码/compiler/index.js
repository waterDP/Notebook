/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description:
 * @FilePath: \note\Vue\vue源码\compiler\index.js
 */
import {parseHTML} from './html-parser'
import {generate} from './generate'

export function compileToRenderFunction(template) {
  // 1）解析html字符串 将html字符串 =》ast语法树
  let root = parseHTML(template)
  // 2 需要将ast语法树生成最终的render函数 模板引擎
  let code = generate(root)

  let renderFn = new Function(`with(this) { return ${code}}`)

  // vue的render 他返回的是虚拟dom
  return renderFn
}