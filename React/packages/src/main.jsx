/*
 * @Author: water.li
 * @Date: 2023-02-25 21:58:15
 * @Description: 
 * @FilePath: \Notebook\React\packages\src\main.jsx
 */
import { createRoot } from "react-dom/client"

function FunctionComponent() {
  return (
    <h1 id="container" 
      onClick={(e) => console.log('父冒泡', e.currentTarget)}
      onClickCapture={(e) => console.log('父捕获', e.currentTarget) }
      >
      <span 
        onClick={(e) => console.log('子冒泡', e.currentTarget)}
        onClickCapture={(e) => console.log('子捕获', e.currentTarget) }
      >world</span>
    </h1>
  )
}

let element = <FunctionComponent />

console.log(element)

const root = createRoot(document.getElementById('root'))
// 把element虚拟DOM渲染到容器中
root.render(element)