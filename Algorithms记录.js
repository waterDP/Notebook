/*算法*/ 

>> 数据结构
	=> 栈
		>>操作
			1.push(element): 添加一个（或几个）新元素到栈顶。
			2.pop(): 移除栈顶的元素，同时返回被移除的元素。
			3.peek(): 返回栈顶的元素，不对栈做任何修改（这个方法不会移除栈顶的元素，仅仅返回它）。
			4.isEmpty(): 如果栈里没任何元素就返回true,否则返回false。
			5.clear(): 移除栈里的所有元素。
			6.size(): 返回栈里的元素个数。这个方法和数组的length属性很像。

		有一种数据类型可以确保属性是私有的，这就是WeakMap;
		let Stack = (function() {
			const items = new WeakMap();
			class Stack {
				constructor() {
					items.set(this, [])
				}
				push(element) {
					let s = items.get(this);
					s.push(element);
				}
				pop() {
					let s = item.get(this);
					let r = s.pop();
					return r;
				}
			}
			return Strack();
		})();

		>> 进制转化
			function baseConverter(decNumber, base) { // decNumber十进制的数据，base进制基
				let remStack = new Stack();
				let rem;
				let baseString = '';
				let digits = '0123456789abcdef';

				while(decNumber > 0) {
					rem = Math.floor(decNumber % base);
					remStrack.push(rem);
					decNumber = Math.floor(decNumber / base);
				}

				while(!remStack.isEmpty()) {
					baseString += digits[remStack.pop()];
				}

				return baseString;
			}

	=> 队列	
		>> 操作
			1.enqueue(element): 向队列尾部添加一个（或多个）新的项。
			2.dequeue(): 移除队列的第一（即在队列最前面的）项，并返回被移除的元素。
			3.front(): 返回队列中第一个元素--最先被添加，也是将是最先被移除的元素。队列不做任何变动（不移除元素，只返回元素信息--与stack类的peek方法非常类似）。
			4.isEmpty(): 如果队列中不包含任何元素，返回true, 否则返回false。
			5.size(): 返回队列包含的元素个数，与数组的length属性类似。

			let Queue = (function () {
				const items = new WeakMap();

				class Queue {
					constructor() {
						items.set(this, []);
					}
					enqueue(element) {
						let q = items.get(this);
						q.push(element);
					}
					dequeue() {
						let q = items.get(this);
						let r = q.shift();
						return r;
					}
				}

				return Queue;
			})();

	>> 优先队列
	function PriorityQueue() {
		let items = [];

		function QueueElement(element, priority) {
			this.elements = element;
			this.priority = priority;
		}

		this.enqueue = function(element, priority) {
			let queueElement = new QueueElement(element, priority);

			let added = false;
			for (let i = 0; i <items.length; i++) {
				if (queueElement.priority < items[i].priority) {
					items.splice(i, 0, queueElement);
					added = true;
					break;
				}
			}
			if (!added) {
				items.push(queueElement);
			}
		};

		this.print = function() {
			for (let i = 0; i < items.length; i++) {
				console.log(`${item[i].element} - ${item[i].priority}`);
			}
		}
	}	
	>> 循环队列--击鼓传花
	function hotPotato(nameList, num) {
		let queue = new Queue();

		for (let i = 0; i < nameList.length; i++) {
			queue.enqueue(nameList[i]);
		}

		let eliminated = '';
		while (queue.size() > 1) {
			for (let i = 0; i < num; i++) {
				queue.enqueue(queue.dequeue());
			}
			eliminated = queue.dequeue();
			console.log(eliminated + '在击鼓游戏中被淘汰！');
		}

		return queue.dequeue();
	}	

	let names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl'];
	let winner = hotPotato(name, 7);
	console.log('The winner is' + winner);