/*
相同: 在不影响客户体验的前提下，将频繁的回调函数进行数次缩减，避免大量计算导致的页面卡顿。
不同: 防抖是将多次执行变为最后一次执行，节流是将多次执行变为在规定时间内只执行一次。

>> 防抖
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

			function debounceFactory(cb, delay = 500) {
				let timer = null; // 定时器
				return args => {
					clearTimeout(timer);
					timer = setTimeout(cb.bind(this, args), delay);
				}
			}

			// 接着用变量保存保存 debounce 返回的带有延时功能的函数
			let debounce = debounceFactory(callback, 500)

			// 添加事件监听
			let input = document.getElementById('dobunce');
			input.addEventListener('keyup', e => debounce.apply(this, e.target.value));

		//<立即执行版>
			function debounce(cb, delay = 500, immediate = true) {
				let timer; // 定时器
				return args => {
					clearTimeout(timer);  // 不管是否立即执行，都要先删除定时器
					if (immediate) {  // 立即执行版本
						if (!timer) {
							cb(args);
						}
						timer = setTimeout(() => timer = null, delay);
					} else{  // 非立即执行
						timer = setTimeout(cb.bind(this, args), delay);
					}
				}
			}	
