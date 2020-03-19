/*算法*/ 

// >> 数据结构
// 	=> 栈
// 		>>操作
// 			1.push(element): 添加一个（或几个）新元素到栈顶。
// 			2.pop(): 移除栈顶的元素，同时返回被移除的元素。
// 			3.peek(): 返回栈顶的元素，不对栈做任何修改（这个方法不会移除栈顶的元素，仅仅返回它）。
// 			4.isEmpty(): 如果栈里没任何元素就返回true,否则返回false。
// 			5.clear(): 移除栈里的所有元素。
// 			6.size(): 返回栈里的元素个数。这个方法和数组的length属性很像。

// 		有一种数据类型可以确保属性是私有的，这就是WeakMap;
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

		// 进制转化
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

	// => 队列	
	// 	>> 操作
	// 		1.enqueue(element): 向队列尾部添加一个（或多个）新的项。
	// 		2.dequeue(): 移除队列的第一（即在队列最前面的）项，并返回被移除的元素。
	// 		3.front(): 返回队列中第一个元素--最先被添加，也是将是最先被移除的元素。队列不做任何变动（不移除元素，只返回元素信息--与stack类的peek方法非常类似）。
	// 		4.isEmpty(): 如果队列中不包含任何元素，返回true, 否则返回false。
	// 		5.size(): 返回队列包含的元素个数，与数组的length属性类似。

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

		// 优先队列
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

		// 循环队列--击鼓传花
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

	// => 链表
	// 	>> 操作
	// 		1.append(element): 向列表尾部添加一个的新的项。
	// 		2.insert(position): element): 向列表的特定位置插入一个新的项。
	// 		3.remove(element): 从列表中移除一项。
	// 		4.indexOf(element): 返回元素在列表中的索引。如果列表中没有该元素则返回。
	// 		5.removeAt(position): 从列表的特定位置移除一项。
	// 		6.isEmpty(): 如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false。
	// 		7.size(): 返回链表包含元素个数。与数组的length类似。
	// 		8.toString(): 由于列表项使用了Node类，就需要重写继承自JavaScript对象默认的toString方法，让其只输出元素的值。

	// 	>> 实现
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
			  	if (position >= 0 && position <= length) {
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

		// >> 双向链表
		// 	双向链表和普通链表的区别在于，在链表中一个节点只有链向下一个节点的链接，而在双同链表中，链接是双向的：一个链向下一个元素，另一个链向上一下元素。

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

	// => 集合
	// 	>> 操作
	// 		add(value): 向集合添加一个新的项。
	// 		remove(value): 从集合移除一个值。
	// 		has(value): 如果值在集合中，返回true，否则返回false。
	// 		clear(): 移除集合中的所有项。
	// 		size(): 返回集合中所有元素的数量。与数组的length属性类似。
	// 		values(): 返回一个包含集合中的有值的数组。

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

			this.remove = function(value) {
				if (this.has(value)) {
					delete item[value];
					return true;
				}
				return false;
			}

			this.clear = function() {
				items = {};
			}

			this.size = function() {
				return Object.keys(items).length;
			}

			this.values = function () {
				let values = [];
				for (let i = 0, keys = Object.keys(items); i < keys.length; i++) {
					values.push(item[keys[i]]);
				}
				return values;
			}

	// => 树
	// 	二叉搜索树（BST）是二叉树的一种，但是它只允许你在左侧节点存储（比父节点）小的值，在右侧存储（比父节点）大的值。

	// 	创建BinarySearchTree类
		function BinarySearchTree() {
			let Node = function (key) {
				this.key = key;
				this.left = null;
				this.right = null;
			}

			let root = null;
		}		

		// >> 操作
		// 	insert(key): 向树中插入一个新的键。
		// 	search(key): 在树中查找一个键，如果节点存在，则返回true；如果不存在，则返回false。
		// 	inOrderTraverse: 通过中序遍历方式遍历所有节点。
		// 	preOrderTraverse: 通过先序遍历方式遍历所有节点。
		// 	postOrderTraverse: 通过后序遍历方式遍历所有节点。
		// 	min: 返回树中最小的键。
		// 	max: 返回树中最大的键。
		// 	remove: 从树中移除某个键。

			class BinarySearchTree() {

				let Node = function (key) {
					this.key = key;
					this.left = null;
					this.right = null;
				}

				constructor() {
					this.root = null;
				}

				insert(key) {
					let newNode = new Node(key);

					if (this.root = null) {
						this.root = newNode;
					} else {
						insertNode(root, newNode);
					}
				}

				insertNode(node, newNode) {
					if (newNode.key < node.key) {
						if (node.left === null) {
							node.left = newNode;
						} else {
							insertNode(node.left, newNode);
						}
					} else {
						if (node.right === null) {
							node.right = newNode;
						} else{
							insertNode(node.right, newNode);
						}
					}
				}

				// 树的遍历

				/**
				 * 中序遍历
				 */
				inOrderTraverse(callback) {
					this.inOrderTraverseNode(this.root, callback);
				}

				inOrderTraverseNode(node, callback) {
					if (node !== null) {
						this.inOrderTraverseNode(node.left, callback);
						callback(node.key);
						this.inOrderTraverseNode(node.right, callback);
					}
				}

				/**
				 * 先序遍历
				 */
				preOrderTraverse(callback) {
					this.perOrderTraverseNode(this.root, callback);
				}

				perOrderTraverseNode(node, callback) {
					if (node !== null) {
						callback(node.key);
						this.perOrderTraverseNode(node.left, callback);
						this.perOrderTraverseNode(node.rigth, callback);
					} 
				}

				/**
				 * 后序遍历
				 */
				postOrderTraverse(callback) {
					this.postOrderTraverseNode(this.root, callback);
				}

				postOrderTraverseNode(node, callback) {
					if (node !== null) {
						this.postOrderTraverseNode(node.left, callback);
						this.postOrderTraverseNode(node.right, callback);
						callback(node.key);
					}
				}

				/**
				 * 搜索最小值
				 */
				min() {
					return this.minNode(this.root);
				}

				minNode(node) {
					if (node) {
						while (node && node.left !== null) {
							node = node.left;
						}
						return node.key;
					}
					return null;
				}

				/**
				 * 搜索最大值
				 */
				max() {
					return this.maxNode(this.root);
				}

				maxNode(node) {
					if (node) {
						while (node && node.right !== null) {
							node = node.right;
						}
						return node.key;
					}
					return null;
				}

				/**
				 * 搜索一个选定值
				 */
				search(key) {
					return this.searchNode(this.root, key);
				}

				searchNode(node, key) {
					if (node === null) {
						return false;
					}

					if (key < node.key) {
						return this.searchNode(node.left, key);
					} 
					if (key > node.key) {
						return this.searchNode(node.right, key);
					} 

					return true;
				}

				/**
				 * 删除一个节点
				 */
				remove(key) {
					this.root = this.removeNode(this.root, key);
				}

				removeNode(node, key) {

					if (node === null) {
						return null;
					}

					if (key < node.key) {
						node.left = this.removeNode(node.left, key);
						return node;
					} else if (key > node.key) {
						node.right = this.removeNode(node.right, key);
						return node;
					} else { // 键等于key

						// 第一各情况——一个叶节点
						if (node.left === null && node.right === null) {
							node = null;
							return node;
						}

						// 第二种情况——一个只有一个子节点的节点
						if (node.left === null) {
							node = node.right;
							return node;
						} else if (node.right === null) {
							node = node.left;
							return node;
						}

						// 第三种情况——一个有两个子节点的节点
						let aux = this.findMinNode(node.right);
						node.key = aux.key;
						node.right = this.removeNode(node.right, aux.key);
						return node;
					}

				}

				findMinNode(node) {
					while(node && node.left !== null) {
						node = node.left;
					}
					return node;
				}

			}


		// <红黑树>
		// 红黑树的定义
		// 	性质1：每个节点要么是黑色，要么是红色。
		// 	性质2：根节点是黑色。
		// 	性质3：每个叶子节点(NIL)是黑色。
		// 	性质4：每个红节点的两个子节点是黑节点。
		// 	性质5：任意一节点到每个叶节点的路径都包含数量相同的黑要点。
		// 	性质6：如果一个节点存在黑子节点，那么该结点肯定有两个子结点。
		// 操作：
		// 	左旋：以某个节点作为支点(旋转节点)，其右子节点变为旋转节点的父节点，右子节点的左子节点变为旋转节点的右子节点，左子节点保持不变。
		// 	右旋：以某个节点作为支点(旋转节点)，其左子节点变为旋转节点的父节点，左子节点的右子节点变为旋转节点的左子节点，右子节点保持不变。
		// 	变色：结点的颜色由红变黑或黑变红


	// => 图		
	// 	创建Grap类
		function Grap() {
			let vertices = [];
			let adjList = new Dictionary();

			/**
		 	* 添加顶点
		 	*/
		 	this.addVertex = function(v) {
		 		vertices.push(v);
		 		adjList.set(v, []);
		 	}

		 	/**
		 	 * 添加边
		 	 */
		 	this.addEdge = function(v, w) {
		 		adjList.get(v).push(w);
		 		adjList.get(w).push(v);
		 	}
		}

		// >> 图的遍历
		// 白色：表示该顶点没有被访问
		// 灰色：表示该顶点被访问过，但并未被探索过
		// 黑色：表示该顶点被访问过且被完全探索过

		// 1.创建一个队列Q
		// 2.将v标注为被发现的（灰色），并将v入队列Q
		// 3.如果Q非空，则运行以下步骤：
		// 	.将u从Q中出队列；
		// 	.将标注u为被发现的；（灰色）
		// 	.将u所有未被访问过的邻点（白色）如队列；
		// 	.将u标注为已被探索过。

		const initializeColor = function() {
			let color = {};
			for (let i = 0; i < vertices.length; i++) {
				color[vertices[i]] = 'white';
			}
			return color;
		}	

		this.bfs = function(v, callback) {
			let color = initializeColor();  // 初始化每个项点为白色
			let queue = new Queue();
			queue.enqueue(v);   // 入队

			while(!queue.isEmpty()) {
				let u = queue.dequeue(); // 出队
				let neighbors = adjList.get(u);
				color[u] = 'grey';
				for (let i = 0; i < neighbors.length; i++) {
					let w = neighbors[i];
					if (color[w] === 'white') {
						color[w] = 'grey';
						queue.enqueue(w); // 入队
					}
				}
				color[u] = 'black';
				if (callback) {
					callback(u);
				}
			}
		}

		// <使用BFS寻找最短路径>
		this.BFS  = function (v) {
			let color = initializeColor();
			let queue = new Queue();
			let d = {};
			let pred = {};
			queue.enqueue(v);

			for (let i = 0; i < vertices.length; i++) {
				d[vertices[i]] = 0;
				pred[vertices[i]] = null;
			}

			while (!queue.isEmpty()) {
				let u = queue.dequeue();
				let neighbors = adjList.get(u);
				color[u] = 'grey';
				for (let i = 0; i < neighbors.length; i++) {
					let w = neighbors[i];
					if (color[w] === 'white') {
						color[w] = 'grey';
						d[w] = d[u] + 1;
						pred[w] = u;
						queue.enqueue(w);
					}
				}
				color[u] = 'black';
			}

			return {
				distance: d,
				predecessors: pred
			}
		}

		// <深度优先搜索>
		this.dfs = function(callback) {
			let color = initializeColor();
			for (let i = 0; i < vertices.length; i++) {
				if (color[vertices[i]] === 'white') {
					dfsVisite(vertices[i], color, callback);
				}
			}
		}

		function dfsVisit(u, color, callback) {
			color[u] = 'grey';
			if (callback) {
				callback(u);
			}
			let neighbors = adjList.get(u);
			for (let i = 0; i < neighbors.length; i++) {
				let w = neighbors[i];
				if (color[w] === 'white') {
					dfsVisit(w, color, callback);
				}
			}
			color[u] = 'black';
		}

		// <Dijkstra算法> 迪杰斯特拉算法
		const graph = [
			[0, 2, 4, 0, 0, 0],
			[0, 0, 1, 4, 2, 0],
			[0, 0, 0, 0, 3, 0],
			[0, 0, 0, 0, 0, 2],
			[0, 0, 0, 3, 0, 2],
			[0, 0, 0, 0, 0, 0]
		];

		function dijkstra (src) {
			const dist = [], visited = [], length = graph.length; // length为图的节点总数

			for (let i = 0; i < length; i++) {
				dist[i] = INF; // 距离设置为最大
				visited[i] = false;
			}
			dist[src] = 0;

			for (let i = 0; i < length - 1; i++) {
				let u = minDistance(dist, visited);
				visited[u] = true;
				for (let v = 0; v < length; v++) {
					if (!visited[v] && 
						graph[u][v] !== 0 &&
						dist[u] !== INF &&
						dist[u] + graph[u][v] < dist[v]) {
						dist[v] = dist[u]
					}
				}
			}
			return dist;
		}

		minDistance(dist, visited) {
			let min = INF, minIndex = -1;
			for (let v = 0; v < dist.length; v++) {
				if (visited[v] === false && dist[v] <= min) {
					min = dist[v];
					minIndex = v;
				}
			}

			return minIndex;
		}