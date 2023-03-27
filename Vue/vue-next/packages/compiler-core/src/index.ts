/*
 * @Author: water.li
 * @Date: 2023-03-15 22:38:17
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\compiler-core\src\index.ts
 */
import { parser } from "./parser";
import { transform } from "./transform";

export function compile(template) {
  const ast = parser(template); // 对模板AST生产
  transform(ast);
  console.log(ast);
}
