## loader分类 (enforce)
- pre 在前面
- post 在后面
- normal

## loader的顺序 pre -> normal -> inline -> post

```javascript
  // -! 不会让文件再去通过pre+normal loader来处理了
  // ! 没有normal
  // !! 什么都不要，只要行内loader来处理
  let str = require('-!inline-loader!./a.js')
```

## loader 默认是由两个部分组成 pitch / normal

