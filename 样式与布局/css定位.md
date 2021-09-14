## position 属性
1.static 默认值。位置设置为static元素，它始终会处于文档流给予的位置
2.fixed 生成绝对定位的元素。默认情况下，可定位于相对于浏览器窗口的指定坐标。元素的位置通过left, right, top, bottom属性进行规定。不论窗口滚动与否，元素都会留在那个位置。但当祖先元素具有transform属性且不为none时，就会相对于祖先元素指定坐标，而不是当前浏览器窗口。
3.absolute, 生成绝对定位的元素，相对于距该元素在文档最近的已定位的祖先元素进行定位(设置了position不为static)。些元素可以通过left, top, right, bottom属性来规定
4.relative生成相对定位的元素，相对于该元素在文档中的初始位置时行定位，通过top, left, right, bottom属性来设置此元素相对于自身位置的偏移

