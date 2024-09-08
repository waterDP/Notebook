<!--
 * @Author: water.li
 * @Date: 2020-07-07 11:24:42
 * @Description: 
 * @FilePath: \notebook\样式与布局\em-rem.md
-->
# css中单位em和rem的区别

在css中单位长度用的最多的是px、em、rem，这三个的区别是：

px是固定的像素，一旦设置了就无法因为适应页面大小而改变。

em和rem相对于px更具有灵活性，他们是相对长度单位，意思是长度不是定死了的，更适用于响应式布局。

对于em和rem的区别一句话概括：em相对于父元素，rem相对于根元素。

rem中的r意思是root（根源），这也就不难理解了。

## em

子元素字体大小的em是相对于父元素字体大小
元素的width/height/padding/margin用em的话是相对于该元素的font-size

## rem

rem是全部的长度都相对于根元素，根元素是谁？html元素。通常做法是给html元素设置一个字体大小，然后其他元素的长度单位就为rem。
