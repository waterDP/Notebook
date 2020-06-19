
# loader

## 分类 (enforce)

- pre 在前面
- normal
- inline 内置的
- post 在后面

loader的顺序 pre -> normal -> inline -> post

  -! noPreAutoLoader 不要前置和普通loader
   ! noAutoLoader 不要普通loader
  !! noPerPostAutoLoader 什么都不要，只要行内loader来处理

```javascript
  let str = require('-!inline-loader!./a.js')
```

loader 默认是由两个部分组成 pitch / normal
