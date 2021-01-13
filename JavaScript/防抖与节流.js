/*
相同: 在不影响客户体验的前提下，将频繁的回调函数进行数次缩减，避免大量计算导致的页面卡顿。
不同: 防抖是将多次执行变为最后一次执行，节流是将多次执行变为在规定时间内只执行一次。

todo 防抖
	> 条件
		1.如果客户连续的操作会导致频繁的事件回调（可能引起页面卡顿）；
		2.客户只关心“最后一次”操作（也可以理解为停止连续操作后）所返回的结果；
	> 场景	
		. 输入搜索联想，用户在不断输入值时，用防抖来节约请求资料。
		. 按钮点击

	> 原理:
		通过定时器将回调函数进行延时。如果在规定时间内继续回调,发现存在之前的定时器,则将该定时器清除,并重新设置定时器。这里有个细节,就是后面所有的回调函数都要能访问到之前设置的定时器,这时就需要用到闭包

	> 两种版本
		防抖分为两种:
			1.非立即执行版：事件触发->延时->执行回调函数;如果在延时中,继续触发事件,则会重新进行延时。在延时结束后执行回调函数。常见例子：就是input搜索框,客户输完过一会就会自动搜索。
			2.立即执行版：事件触发->执行回调函数->延时;如果在延时中,继续触发事件,则会重新进行延时。在延时结束后,并不会执行回调函数。常见例子：就是对于按钮防点击。例如点赞,心标,收藏等有立即反馈的按钮。


		<非立即执行版>	
			//然后准备包装函数:
			//1.保存定时器标识 
			//2.返回闭包函数
*/

		// 一个回调函数
		function callback(content) {
			console.log(content)
		}

		function debounce(cb, delay = 500) {
			let timer = null // 定时器
			return (...args) => {
				clearTimeout(timer)
				timer = setTimeout(cb.bind(this, ...args), delay)
			}
		}

		// 接着用变量保存保存 debounce 返回的带有延时功能的函数
		let handler = debounce(callback, 500)

		// 添加事件监听
		let input = document.getElementById('debounce');
		input.addEventListener('keyup', e => handler.apply(this, e.target.value));

	//<立即执行版>
	function debounce(cb, delay = 500, immediate = true) {
		let timer; // 定时器
		return (...args) => {
			clearTimeout(timer);  // 不管是否立即执行，都要先删除定时器
			if (immediate) {  // 立即执行版本
				if (!timer) {
					cb(args);
				}
				timer = setTimeout(() => timer = null, delay);
			} else{  // 非立即执行
				timer = setTimeout(cb.bind(this, ...args), delay);
			}
		}
	}	
			
// todo 节流
// 	> 条件
// 		1.客户连续频繁地触发事件； 
// 		2.客户不再只关心“最后一次”操作的结果反馈，而是在操作过程中持续的反馈。
// 	> 场景
// 		. 鼠标不断点击触发，点击事件在规定时间内只触发一次（单位时间内只触发一次）。
// 		. 监听滚动事件，比如是否滑动到底部自动加载更多，用throttle来判断。			
// 	[注意]：：何为连续触发频繁地触发事件，就是事件触发时间间隔至少要比规定时间要短。	

// 	> 原理
// 		两种实现方式：
// 			1.时间戳方式：通过闭包保存上一次的时间戳，然后与事件触发的时间戳比较。如果大于规定时间，则执行回调，否则，什么也不干
// 			. 特点： 一般第一次会执行，之后连续频繁地触发事件，也是超过了规定时间才会触发一次。最后一次触发事件，也不会执行（说明： 如果你最后一次发时间大于规定时间，这样就算不是连续触发了）。
// 			2.定时器方式：原理与防抖类似。通过闭包保存上一次的定时器状态。然后事件触发时，如定时器为null（即代表时间间隔大于规定时间），则设置的定时器。到时间后执行回调函数，并将定时器设置为null。
// 			. 特点： 当第一次触发事件时，不会立即执行函数，到了规定时间后才会执行。之后连续频繁的触发事件，也是到了规定时间才会执行一次(因为定时器)。当最后一次停止触发后，由于定时器的延时，还会执行一次回调查函数（那也是上一次成功触发执行的回调，而不是你最后一次触发产生的）。一句话总结就是延时回调，你能看到的回调都是上次成功触发的，而不是你此刻产生的。

	// 时间戳版本		
	function throttle(fn, delay = 500) {
		let previous = null // 记录上一次触发的时间戳，这里初始化为0，是为了第一次触发产生回调
		return (...args) => {
			let now = Date.now()
			if (previous) {
				if (now - previous > delay) { // 如果时间差大于规定时间，则触发
					previous = now
					fn(...args)
				}
			} else {
				previous = now
				fn(...args)
			}
		}
	}

	// 定时器版本
	function throttle(fn, delay = 500) {
		let timer
		return (...args) => {
			if (!timer) {
				fn(...args)
				timer = setTimeout(() => {
					clearTimeout(timer)
					timer = null
				}, delay)
			}
		}
	}

	// 时间戳+定时器版：实现第一次触发可以立即响应，结束触发后了也能响应
	// 该版主体思路还是时间戳，定时器的作用仅是执行最后一次回调
	function  throttle(fn, delay = 500) {
		let timer = null;
		let previous = 0;
		return function (args) {
			let now = Date.now();
			let remaining = delay - (now - previous); //  距离规定时间还剩多少时间
			let that = this;
			let _args = args;
			clearTimeout(timer);
			if (remaining <= 0) {
				fn.apply(that, _args);
				previous = Date.now();
			} else {
				timer = setTimeout(function() {
					fn.apply(that, _args);
				}, remaining); // 因为上面添加一个clearTime，实际这个定时器只有最后一次才会执行。
			}
		}
	}