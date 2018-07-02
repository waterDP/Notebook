/*Promise 的连续异步用*/
function consbyTime(context) {
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			resolve(context);
		},100)
	});
}

console.log('begin');

consbyTime('111').then((res)=>{
	console.log(res);
	return consbyTime('222');  //注意此处的return 
}).then((res)=>{
	console.log(res)
})

=>ES6成生器（Generators）
	
	function* quips(name) {
		yield `你好 ${name}！`;
		yield `希望你能喜欢这篇文章`;
		if(name.startsWith('X')) {
			yield `你的名字 ${name} 首字母是X，这很酷!`
		}
		yield `我们下次再见！`
	}

	>	var iter = quips("jorendorff");
	  [object Generator]
	> iter.next()
	  { value: "你好 jorendorff!", done: false }
	> iter.next()
	  { value: "希望你能喜欢这篇介绍ES6的译文", done: false }
	> iter.next()
	  { value: "我们下次再见！", done: false }
	> iter.next()
	  { value: undefined, done: true }

	如果用专业术语描述，每当生成器执行yields语句，生成器的堆栈结构（本地变量、参数、临时值、生成器内部当前的执行
	位置）被移出堆栈。然而，生成器对象保留了对这个堆栈结构的引用（备份），所以稍后调用.next()可以重新激活堆栈结构
	并且继续执行。

	/Class 的 Generator 方法/
	如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数。

	class Foo {
	  constructor(...args) {
	    this.args = args;
	  }
	  * [Symbol.iterator]() {
	    for (let arg of this.args) {
	      yield arg;
	    }
	  }
	}
	// hello
	// world

	for (let x of new Foo('hello', 'world')) {
	  console.log(x);
	}

	>>生成器的迭代器
	class RangeIterator {
		constructor(start, stop) {
			this.value = start;
			this.stop = stop;
		}

		[Symbol.iterator](){ return this; }

		next() {
			let value = this.value;
			if(value < this.stop) {
				this.value++;
				return {done: false, value: value}
			} else {
				return {done: true, value: undefined}
			}
		}
	}

	//返回一个新的迭代器，可以从start到stop计数
	function range(start, stop) {
		return new RangeIterator(start, stop);
	}
	
	>生成器写法
	function* range(start, stop) {
		for(let i=start; i<stop; i++) {
			yield i;
		}
	}

	【例 1】假设你有一个函数，每次调用时返回一个数组结果，像这样：
 	//拆分一维数组icons
 	//根据长度rowLength
 	function splitIntoRows(icons, rowLength) {
 		let rows = [];
 		for (let i = 0; i < icons.length; i += rowLength) {
 			rows.push(icons.slice(i, i+rowLength));
 		}
 		return rows;
 	}

 	使用生成器创建的代码相对较短
 	function* splitIntoRows(icons, rowLength) {
 		for (let i = 0; i < icon.length; i += rowLength) {
 			yield icons.slice(i, i+rowLength)
 		}
 	}


 	>>基于promise对象的自动执行
 	const fs = require('fs');
 	let readFile = function (fileName) {
 		return Promise((resolve, reject)=>{
 			fs.readFile(fileName, (error, data)=>{
 				if(error) {
 					return reject(error);
 				}
 				return resovle(data);
 			})
 		})
 	}

 	let gen = function* () {
 		let y1 = yield readFile('/etc/fstab');
 		let y2 = yield readFile('/etc/shells');

 		console.log(y1);
 		console.log(y2);
 	}

 	let g = gen();
 	g.next().value.then((data)=>{
 		g.next().value.then((data)=>{
 			g.next(data);
 		})
 	}) 
 	//或者(推荐)
 	g.next().value.then((data)=>{
 		//...
 		return g.next().value;  //注意return
 	}).then((data)=>{
 		//...
 		g.next();
 	});

 	观察上面的执行过程，其实是一个递归调用，我们可以用一个函数来实现：
 	function run(gen) {
 		let g = gen();

 		function next(data) {
 			let result = g.next(data);
 			if(result.done) {
 				return result.value;
 			}
 			result.value.then((data)=>{
 				next(data);
 			})
 		}

 		next(data);
 	}

 	run(gen);

=>async函数
	const fs = require('fs');
 	let readFile = function (fileName) {
 		return Promise((resolve, reject)=>{
 			fs.readFile(fileName, (error, data)=>{
 				if(error) {
 					return reject(error);
 				}
 				return resovle(data);
 			})
 		})
 	}

	const asyncReadFile = async function () {
		const f1 = await readFile('/etc/fstab');
		const f2 = await readFile('/etc/shells');
		console.log(f1.toString());
		console.log(f2.toString());
	}

	【比较】async函数是对Generator函数的改进，体现在以下四点：
	1.内置执行器
	Generator函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，asyn函数的执行，
	与普通函数一模一样，只要一行 asyncReadFile(); 调用asyncReadFile函数，然后它就自动执行，输出最后结果。
	这完全不像Generator函数，需要调用next方法，或者用co模块，才真正执行，得到最后结果。

	2.更好的语义
	async和await，比起星号和yield，语义更清楚了，async表示函数里有异步操作，await表示紧跟在后面的表达式
	需要等待结果。

	3.更广的适用性 
	co模块约定，yield命令后面只能跟是Thunk函数或promise对象，而async函数的await命令后面，可以是Promise对象和
	原始类型的值。

	4.返回值是Promise
	async函数的返回值是Promise对象，这比Generator函数的返回值是Iterator对象，这比Generator函数返回值是
	Iterator对象方便多了。你可以用then方法指定下一步的操作。

	【例 2】指定多少毫秒后输出一个值
	function timeout(ms) {
		return new Promise((resolve)=>{
			setTimeout(resolve, ms);
		});
	}

	async function asyncPrint(value, ms) {
		await timeout(ms);
		console.log(value);
	}

	asyncPrint('hello world', 50);

	//上面的代码指定50毫秒以后，输出hello world
	
=> ES面向对象语法
	class PersonWithMiddlename extends Person {
		constructor(name, middlename, surname, age) {
			super(name, surname, age);
			this.middlename = middlename;
		}
		getFullName() {
			return this.name + '' + this.middlename + '' + this.surname;
		}
	}	

=> Map与Set集合
	> ES2015引入新的原型Map，它通过一种更安全、灵活和直观的方式来定义哈希映射集合。
		const profiles = new Map();
		
		profiles.set('twitter', '@adalovelace');
		profiles.set('facebook', 'adalovelace');
		profiles.set('gooleplus', 'ada');
		profiles.size; // 3
		profiles.has('twitter'); // true
		profiles.get('twitter'); // '@adalovelace'
		profiles.has('youtube'); // false
		profiles.delete('facebook'); 
		profiles.has('facebook'); // false
		profiles.get('facebook'); // undefined

		for (let item of profiles) {
			console.log(item);
		}
	> 除了Map以外，ES2015还引入了Set原型。这个原型可以用于轻松构建集合，一个所有值都是唯一的列表
		const s = new Set([0, 1, 2, 3]);
		a.add(3); // will not be added
		a.size; // 4
		s.delete(0);
		s.has(0); // fase
		s.values();
		
		for (let item of a) {
			console.log(item);
		}	

	>>用ES6的WeakMap实现栈

	const Stack = (function () {
		const items = new WeakMap();

		return class Stack {
			constructor() {
				items.set(this, []);
			}
		
			push(element) {
				let s = items.get(this);
				s.push(element);
			}

			pop() {
				let s = items.get(this);
				let r = s.pop();
				return r;
			}
		}	
	})();

=> ES6数组新功能
	>>数组中的迭代器@@iterator
		const arr = [1,2,3,4]

		let iterator = arr[Symbol.iterator]();

		console.log(iterator.next().value)   // 1
		console.log(iterator.next().value)   // 2
		console.log(iterator.next().value)   // 3
		console.log(iterator.next().value)   // 4

	>> 使用from方法	
	/*所有偶数的集合，对应_.filter*/
	let evens = Array.from(arr, x => (x % 2 === 0));
