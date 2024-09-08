# IFC

## 概念

IFC的全称是Inline Formatting Contexts, 也就是“内联格式化上下文”

## 生成条件

IFC的形成条件非常简单，块级元素仅包含内联级别元素，需要注意的是当IFC中有块级元素插入时，会产生两个匿名块将父元素分割开来，产生两个IFC

## IFC渲染规则

1.子元素水平方向横向排列，并且垂直方向起点为元素顶部
2.子元素只会计算横向样式空间，【padding, border, margin】,垂直方向样式空间不会被计算，yu【padding, border, margin】
3.在垂直方向上，子元素会以不同形式来对齐(vertical-align)
4.能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框（line box）。行框的宽度是由包含块(containing box)和其中的浮动来决定
5.IFC中的"line box"一般左右贴紧其包含块，但float元素会优先排列
6.IFC中的"line box"高度由css行高计算规则来确定，同个IFC下的多个line box 高度可能会不同
7.当inline-level boxes的总宽度少于包含它们的line box时，其水平渲染规则由text-algin属性值来决定
8.当一个"inline box"超过父元素的宽度时，它会被分割成多个boxes,这些boxes分布在多个"line box"中。如果子元素未设置强制换行的情况下，“inline box”将不可被分割，将会溢出父元素

## IFC的应用

水平居中：当一个块要在环境中水平居中时，设置其为inline-block则会在外层产生IFC, 通过text-align则可以使其水平居中。
垂直居中：创建一个IFC，用其中一个元素撑开其父元素的高度，然后设置其vertical-align: middle，其行内元素则可以在此父元素下垂直居中。
