/*
 * @Author: water.li
 * @Date: 2023-02-25 21:58:15
 * @Description: 
 * @FilePath: \Notebook\React\source\src\main.jsx
 */
import { createRoot } from "react-dom/client"

let element = (
  <h1>
    hello<span style={{color: 'red'}}>world</span>
  </h1>
)

console.log(element)
const root = createRoot(document.getElementById('#root'))
// 把element虚拟DOM渲染到容器中
root.render(element)