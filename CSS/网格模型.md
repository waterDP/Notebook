<!--
 * @Description: Grid布局
 * @Date: 2021-09-14 15:11:42
 * @Author: water.li
-->
display: grid 或 inline-grid 来创建一个网络容器。声明display:grid则该容器是一个块级元素，设置成display:inline-block则容器元素为行内元素。

grid-template-columns属性设置列宽，grid-template-rows属性设置行高，这两个属性在grid而已中成为重要。它们的值是有多种多样的，而且它们的设置是比较相似的，下面针对grid-template-columns 属性进行讲解

repeat()函数，可以简化重复的值。该函数接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值。比如行高都是一样的，我们可以这样去实现
```css
  .wrapper {
    display: grid;
    grid-template-columns: 200px 100px 200px
    grid-tap: 5px; 
    /* 2行，而且行高都为50px */
    grid-template-rows: repeat(2, 50px)
  }
```

auto-fill 关键字：表示自动填充，让一行（或者一列）中尽可能的容纳更多的单元格。grid-template-columns(auto-fill, 200px)表示列宽为200px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素，代码如下
```css
  .wrapper-2 {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-gap: 5px;
    grid-auto-rows: 50px;
  }
```

fr 关键字: Grid布局还引入了一个另外的长度单位来帮助我们创建灵活的风格轨道。fr单位代表风格容器可用的空间的一等份。grid-template-columns: 200px 1fr 2fr表示第一个列宽度设置为200px，后面剩余的宽度分为两部分， 宽度为剩余宽度的1/3和2/3
```css
  .wrapper-3 {
    display: grid;
    grid-template-columns: 200px 1fr 2fr;
    grid-gap: 5px;
    grid-auto-rows: 50px;
  }
```

minmax()函数，我们有时候想给网格元素一个最小和最大的尺寸，minmax()函数产生一个长度范围，表示长度就在这个范围之中都可以应用到风格项目中。它接受两个参数，分别为最小值和最大值。grid-template-columns: 1fr 1fr minmax(300px 2fr)的意思是，第三个列宽最小也是要300px，但是最大不能大于第一列和第二列宽的二倍

auto关键字：由浏览器的决定长度。通过auto关键字，我们可以轻易实现三列与两列布局。grid-template-columns: 100px auto 100px表示第一列第三列为100px，中间由浏览器决定长度

grid-template-areas属性：一般这个属性跟网格元素的grid-area一起使用
```css
  .wrapper {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 120px 120px 120px;
    grid-template-areas: 
      ". header header"
      "sidebar content content";
    background-colo: #fff;
    color: #444;
  }
```

上面代码表示划分出6个单元格，其中值得注意是.符号代表空的单元格，也就是没有用到该单元格
```css
  .sidebar {
    grid-area: sidebar;
  }
  .content {
    grid-area: content;
  }
  .header {
    grid-area: header;
  }
```

grid-auto-flow属性控制着自动布局算法怎样运作，精确指定风格中自动布局的元素怎样排列。默认的放置顺序是“先行后列”，即