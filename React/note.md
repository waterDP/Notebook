<!--
 * @Author: water.li
 * @Date: 2022-01-11 20:34:30
 * @Description: 
 * @FilePath: \notebook\React\note.md
-->
## vdom 的优势
1. 研发体验 研发效率的提升
2. 跨平台
3. Dom的指更新可以带来性能的提升

## Diff 逻辑的拆分与解读
1. Diff 算法性能突破的关键点在于“分层对比”
2. 类型一致的节点才有继续Diff的必要性
3. key属性的设置，可以帮助我们尽可能重用同一层级内的节点

## setState是同步的还是异步的
1. 在React钩子函数及合成事件中，它表现为异步
2. 在setTimeout, setInterval等函数中，包括在DOM原生事件中，它都表现为同步