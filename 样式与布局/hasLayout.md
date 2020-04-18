# hasLayout

## 定义

hasLayout是IE7-浏览器的特有属性。hasLayout是一种只读属性，有两种状态：true和false。当其为true时，代表该元素有自己的布局，否则代表该元素的布局继承于父元素。

通过element.currentStyle.hasLayout可以得出当前元素的hasLayout情况

## html标签

默认触发hasLayout的有如下HTML标签：
1.html,body
2.table,tr,th,td
3.img
4.hr
5.input,button,select,textarea,fieldset
6.frameset,frame,iframe

## CSS属性

可以触发hasLayout的有如下CSS属性
1.display: inline-block
2.height/width: 除了auto
3.float: left/right
4.position:absolute
5.writing-mode(IE专有属性，设置文本的垂直显示):tb-rl
6.zoom(IE专有属性，设置或检索对象的绽放比例)：除了normal

-IE7专有的触发hasLayout的CSS属性
1.min-height/max-height/min-width/max-width: 除none
2.overflow\overflow-x\overflow-y:除visible
3.position:fixed

## 用途

### 【1】解决IE7浏览器低级边框不阻止子级上下margin传递的bug

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
      body{
        margin: 0;
      }
      ul{
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .list{
        border: 10px solid black;
        background-color: red;
        /*触发hasLayout*/
        /*float:left;*/
      }
      .in{
        height: 100px;
        width: 100px;
        margin-top: 50px;
        background-color: blue;
      }
    </style>
  </head>
  <body>
    <ul class="list">
      <li class="in"></li>
    </ul>
  </body>
</html>
```
