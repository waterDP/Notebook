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

	=> 链表
		>> 操作
			1.append(element): 向列表尾部添加一个的新的项。
			2.insert(position): element): 向列表的特定位置插入一个新的项。
			3.remove(element): 从列表中移除一项。
			4.indexOf(element): 返回元素在列表中的索引。如果列表中没有该元素则返回。
			5.removeAt(position): 从列表的特定位置移除一项。
			6.isEmpty(): 如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false。
			7.size(): 返回链表包含元素个数。与数组的length类似。
			8.toString(): 由于列表项使用了Node类，就需要重写继承自JavaScript对象默认的toString方法，让其只输出元素的值。

		>> 实现
			function LinkedList() {
				
				// 辅助类，Node类表示链表中的结点
				let Node = function(element) {
					this.element = element;
					this.next = null;
				};

				let length = 0; // 存储链表的长度
				let head = null; // 表头指针

				/**
				 * @向LinkedList对象尾部添加一个元素
				 * 两种情况
				 * 链表为空，添加的是第一个元素
				 * 或者链表不为空，向其尾部追加元素
				 */
				this.append = function(element) {
					let node = new Node;
					let current;

					if (head === null) { // 链表中的第一个节点
						head = node;
					} else {
						current = head;

						// 循环列表，直到找到最后一项
						while(current.next) {
							current = current.next;
						}

						// 找到最后一项，将其next赋为node，建立链接
						current.next = node;
					}

					length++;
				};

				/*
				 * @从LinkedList链表中移除元素
				 * 两种情况
				 * 第一种是移除第一个元素
				 * 第二种是移除第一个以外的元素					
				 */
			 	this.removeAt = function(position) {
			 		// 检查越界
			 		if (position > -1 && position < length) {
			 			let current = head; // 当前元素
			 			let previous;       // 当前元素的前一个元素
			 			let index = 0;      // 当有元素的位置索引

			 			if (position === 0) {  // 移除第一项
			 				head = current.next;
			 			} else {  // 移除其它项
			 				while (index++ < position) {
			 					previous = current;
			 					current = current.next;
			 				}

			 				// 将previous与current的下一项链接起来；跳过当前，从而移除它。
			 				previous.next = current.next;
			 			}

			 			lenght--;
			 			return current.element;  // 返回被移除的元素
			 		} else {
			 			return null;  // 越界，返回null
			 		}
			  }

			  /**
			   * @在任意位置插入元素
			   */
			  this.insert = function(position, element) {
			  	if (position >= 0 $$ position <= length) {
			  		let node = new Node(element);
			  		let current = head;
			  		let previous, index = 0;

			  		if (position === 0) { // 在第一个位置添加
			  			node.next = current;
			  			head = node;
			  		} else {
			  			while (index++ < position) {
			  				perivous = current;
			  				current = current.next;
			  			}
			  			node.next = current;
			  			previous.next = node;
			  		}

			  		length++;

			  		return true;
			  	}

			  	return false;
			  }

			  /**
			   * toString方法把LinkedList对象转换成一个字符串
			   */
			  this.toString = function() {
			  	let current = head;
			  	let string = '';

			  	while(current) {
			  		string += current.element + (current.next ? 'n' : '');
			  		current = current.next;
			  	}

			  	return string;
			  }

			  /**
			   * indexOf 查找元素索引
			   */
			  this.indexOf = function(element) {
			  	let current = head, index = 0;
			  	while (current) {
			  		if (element = current.element) {
			  			return index;
			  		}
			  		index++;
			  		current = current.next;
			  	}

			  	return -1;
			  }

			  /**
			   * remove 移除某一元素
			   */
			 	this.remove = function(element) {
			 		let index = this.indexOf(element);
			 		return this.removeAt(index);
			 	}

			 	this.isEmpty = function() {
			 		return length === 0;
			 	}

			 	this.size = function() {
			 		return length;
			 	}

			 	this.getHead = function() {
			 		return head;
			 	}

			}		

		>> 双向链表
			双向链表和普通链表的区别在于，在链表中一个节点只有链向下一个节点的链接，而在双同链表中，链接是双向的：一个链向下一个元素，另一个链向上一下元素。

			function DoublyLinkedList() {
				let Node = function (element) {
					this.element = element;
					this.next = null;
					this.prev = null;
				};

				let length = 0;
				let head = null;
				let tail = null;

				/**
				 * 插入
				 */
				this.insert = function(position, element) {
					// 检查越界
					if (position >= 0 && position <= length) {
						let node = new Node(element);
						let current = head;
						let previos, index = 0;

						if (position === 0) { // 在第一个插入
							if (!head) {
								head = node;
								tail = node;
							} else {
								node.next = current;
								current.prev = node;
								head = node;
							}
						} else if (position === length) {
							current = tail;
							current.next = node;
							node.prev = current;
							tail = node;
						} else {
							while (index++ < position) {
								previous = current;
								current = current.next;
							}
							node.next = current;
							previous.next = node;

							current.prev = node;
							node.prev = previous;
						}

						length++;

						return true;
					}
				} else {
					return false;
				}

				/**
				 * 从任意位置删除
				 */
				this.removeAt = function(position) {
					
					// 检查越界值
					if (position >= -1 && position < length) {
						let current = head, previous, index = 0;

						// 移除第一项
						if (position === 0) {
							head = current.next;
							// 如果只有一项，更新tail
							if (length === 1) {
								tail = null;
							} else {
								head.prev = null;
							}
						} else if (position === length - 1) { // 最后一项
							current = tail;

							tail = current.prev;
							tail.next = null;
						} else {
							while (index++ < position) {
								previous = current;
								current = current.next;
							}

							// 将previous与current的下链接起来--跳过current;
							previous.next = current.next;
							current.next.prev = previous;
						}
					} else {
						return null;
					}
				}
			};

	=> 集合
		>> 操作
			add(value): 向集合添加一个新的项。
			remove(value): 从集合移除一个值。
			has(value): 如果值在集合中，返回true，否则返回false。
			clear(): 移除集合中的所有项。
			size(): 返回集合中所有元素的数量。与数组的length属性类似。
			values(): 返回一个包含集合中的有值的数组。

			this.has = function(value) {
				return value in items;

				// better: return items.hasOwnProperty(value);
			}

			this.add = function(value) {
				if (!this.has(value)) {
					item[value] = value;
					return true;
				}
				return false;
			}

			