 /*
	在 Node.js 中，eventLoop是基于libuv的。通过查看libuv的文档可以发现整个eventLoop 分为 6 个阶段：
	1.timers: 定时器相关任务，node中我们关注的是它会执行 setTimeout() 和 setInterval() 中到期的回调
	2.pending callbacks: 执行某些系统操作的回调
	3.idle, prepare: 内部使用
	4.poll: 执行 I/O callback，一定条件下会在这个阶段阻塞住
	5.check: 执行 setImmediate 的回调
	6.close callbacks: 如果 socket 或者 handle 关闭了，就会在这个阶段触发 close 事件，执行 close 事件的回调

  > 事件循环机制
	  任务：
		  1.任务队列又分为macro-task（宏任务）与micro-task （微任务），在最新的标准中，它们分别称为task和job。
		  2.macro-task大概包括：script（整体代码），setTimeout, setInterval, setImediate,I/O,UI rendering;
		  3.micro-task大概包括：process.nextTick, Promise, Object.observe（已废弃）,MutationObserver（html5新特征）
		  4.setTimeout/Promise等我们称之为任务源。而进入任务队列的是他们指定的具体执行任务。
		  5.来自不同的任务源的任务会进入到不同的任务队列。其中setTimeout与setInterval是同源的。
		  5.事件循环顺序，决定了JavaScript代码的执行顺序。它从script开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的micro-task。当所有的micro-task执行完毕之后。循环再次从macro-task开始，找到其中的一个任务执行完毕，然后再执行所有的micro-task,这样一直循环下去。
		  6.其中每一个任务的执行，无论是macro-task还是micro-task，都是借助函数借用栈来完成。
*/

// 例
console.log(1)
console.log(2)
setTimeout(function () {
	console.log('setTimeout1')
	Promise.resolve().then(function () {
		console.log('promise')
	})
})
setTimeout(function() {
	console.log('setTime2')
})

/**
 * 打印结果
 * 1
 * 2
 * setTimeout1
 * promise
 * setTimeout2
 */

 // process.nextTick node中的事件环，node实现的微任务，他的优先级比promise还要高

// 微任务 promise.then / mutationObserver / process.nextTick
// 宏任务 script标签 ui渲染 messageChannel(浏览器) ajax click setTimeout setImmediate requestFrameAnimation
// 浏览器	是一个宏任务队列  node 的话是多个宏任务任队列
// 执行顺序是一样的 
