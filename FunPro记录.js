/*函数式编程*/

元编程：编写代码来做一些事情叫作编程，而元编程是当你写的代码改变了某些代码被解释的方法。
幂等性：幂等性是指执行无数次后还具有相同的效果。
Curry柯里化：函数柯里化是指，把接受多个参数的函数转换成接受一个单一参数的函数。
function add(a, b) {
  return a + b;
}
var curriedAdd = _.curry(add);
var add2 = curriedAdd(2);
add2(1);
// 3

// ES6写法
const add = a => b => a + b;
const add2 = add(2);
add2(1);
// 3


=>  一个阶乘的尾递归优化
  传统的写法
  function factorial(n) {
  	if (n === 1) return 1;
  	return n * factorial(n-1);
  }

  尾递归
  function factorial(n, total) {
  	if (n === 1) return total;
  	return factoiral(n - 1, total);
  }
  factorial(5, 1);

/*=================================================*/
function splat(fun) {
	return function(array) {
		return fun.apply(null, array);
	}
}

let addArrayElements = splat((x, y) => x + y);
addArrayElements([1, 2]);  // => 3

/*=================================================*/
function unsplat(fun) {
	return function() {
		return fun.call(null, _.toArray(arguments));
	}
}

/*=================================================*/
_.rest = _.tail = _.drop = function(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
};

let joinElements = unsplat(array => array.join(' '));
joinElements(1, 2);  // '1 2'
joinElements('-', '$', '/', '!', ':');
// '- $ / ! :'

为了判断什么是索引的数据类型，我们可以创建一个isIndexed函数，实现如下所示
function isIndexed(data) {
	return _.isArray(data) || _.isString(data);
}

/*====================================================*/
function existy(x) {
	return x != null;
}

/*==========把捕获的变量作为私有数据============*/

const pingpong = (function () {
	/**
	 * PRIVATE 在此处具有封闭性 
	 */
	let PRIVATE = 0;

	return {
		inc(n) {
			return PRIVATE += n;
		},
		dec(n) {
			return PRIVATE -= n;
		}
	};
})();

pingpong.inc(10);  // 10
pingpong.dec(7);   // 3

pingpong.div = function (n) {
	return PRIVATE/n;
}

pingpong.div(3);
// ReferenceError: PRIVATE is not defined

=> 高阶函数 
	1.以其它函数为参数的函数
		>> max()
			let people = [{name: 'Fred', age: 65}, {name: 'Lucy', age: 36}];
			_.max(people, item => item.age);

		>>function finder(valueFun, bestFun, coll) {
				return _.reduce(coll, (best, current) => {
					let bestValue = valueFun(best);
					let currentValue = valueFun(current);

					return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
				})
			}

			finder(_.indentity, math.max, [1, 2, 3, 4, 5]);
			// 5

		>>简化finder
		function best(fun, coll) {
			return _.reduce(coll, (x, y) => {
				return fun(x, y) ? x : y;
			});
		}

		best((x, y) => x > y, [1, 2, 3, 4, 5]);   // 5


		function repeat(times, VALUE) {
			return _.map(_.range(times), () => VALUE);   // 大写的VALUE表示闭包
		}

		repeat(4, 'Major');
		// ['Major', 'Major', 'Major', 'Major']

		>>使用函数，而不是值
		function repeatedly(times, fun) {
			return _.map(_.range(times), fun);
		}

		repeatdly(3, () => {
			return Math.floor((Math.random() * 10) + 1);
		});
.
		// [2, 4, 9]

		>>函数iterateUntil接收两个函数：一个用来执行一些动作，另外一个用来进行结果检查，当结果满足“结束”值时返回 false;
		function iterateUntil(fun, check, init) {
			let ret = [];
			let result = fun(init);

			while (check(result)) {
				ret.push(result);
				result = fun(result);
			};

			return ret;
		}

		iterateUntil(n => n+n, n <= 1024, 1);
		// [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]

	2.返回其它函数的函数
		repeatdly(3, function() {return 'Odelay'});

		function always(value) {
			return function() {
				return value;
			}
		}

		接下来，用always来替换之前的匿名函数，会更加简洁一些
		repeatedly(2, always('Odelay'));
		像always这样的函数被称为组合子。

		>>invoker：接收一个方法，并在任何给定的对象上调用它。
		function invoker(NAME, METHOD) {
			return function (target /* args ... */) {
				if (!existy(target)) {
					fail('Must provide a target');
				}

				let targetMethod = target[NAME];
				let args = _.rest(METHOD);

				return doWhen((existy(targetMethod) && method === targetMethod), targetMethod.bind(target, args));
			}
		}

		/*============防止不存在的函数fnull=================*/
		function fnull(fun, /*, defaults*/) {
			let default = _.rest(arguments);

			return function(/* args */) {
				let args = _.map(arguments, (e, i) => {
					return existy(e) ? e : default[i];
				});

				return fun.apply(null, args);
			}
		} 

=> 由函数构建函数 
	function dispatch(/* funs */) {
		let funs = _.toArray(arguments);
		let size = funs.length;

		return function (target /*,args*/) {
			let ret = undefined;
			let args = _.rest(arguments);

			for(let funIndex = 0; funIndex < size; funIndex++) {
				let fun = funs[funIndex];
				ret = fun.apply(fun, construct(target, args));

				if (existy(rest)) {
					return rest;
				}
			}

			return ret;
		}
	}	

	let str = dispatch(invoker('toString', Array.prototype.toString),
										 invoker('toString', String.prototype.toString));
		str('a');   // => 'a'								 			
		str(_.range(4)); // => '0,1,2,3'

	>> 柯里化 (Curring)	
	function rightAwayInvoker() {
		let args = _.toArray(arguments);
		let method = args.shift();
		let target = args.shift();

		return method.apply(target, args);
	}

	rightAwayInvoker(Array.prototype.reverse, [1 ,2, 3]);

	$ 自动柯里化参数
	function curry(fun) {
		return function (arg) {
			return fun(arg);
		}
	}
	curry的操作可以概括为
		·接受一个函数
		·返回一个只接收一个参数的函数

	['11', '11', '11', '11'].map(curry(parseInt));
	// => [11, 11, 11, 11]

	一个柯里化两个参数的curry2函数
	function curry(fun) {
		return function (secondeArg) {
			return function (firstArg) {
				return fun(firstArg, secondeArg);
			}
		}
	}
	curry2还可用于固化parseInt的行为，使其解析时只处理二进制 
	const parseBinaryString = curry2(parseInt)(2);
	parseBinaryString('111'); // => 7
	parseBinaryString('10'); // => 2

	柯里化有利于指定JavaScript函数行为 ，并将现有函数“组合”为新函数。
	1.使用柯里化构建新函数
		const plays = [
			{artist: 'Burial', track: 'Archangel'},
			{artist: 'Ben Frost', track: 'Stomp'},
			{artist: 'Ben Frost', trach: 'Stomp'},
			{artist: 'Burial', track: 'Archangel'},
			{artist: 'Emeralds', track: 'Snores'},
			{artist: 'Burial', track: 'Archangel'}
		];

		_.countBy(plays, song => [song.artist, song.track].join(' - '));

		/*
			=>{
				'Ben Frost - Stomp': 2,
				'Burial - Archangel': 3,
				'Emeralds - Snores': 1
			}
		*/

		_.countBy 接收任意的函数作为第二个参数这一事实，你可以用 _.countBy 柯里化有用的函数来实现定制的计数功能。 
		function songToString(song) {
			return [song.artist, song.tract].join(' - ');
		}

		const songCount = curry2(_.countBy)(songToString);

		songCount(plays);
		/*
			=>{
				'Ben Frost - Stomp': 2,
				'Burial - Archangel': 3,
				'Emeralds - Snores': 1
			}
		*/

	2.柯里化三个来实现HTML十六进制颜色构建器
		使用实现curry2相同的模式，可以定义柯里化三个参数的函数
		function curry3(fun) {
			return function (last) {
				return function (middle) {
					return function (first) {
						return fun(first, middle, last);
					}
				}
			}
		}

		function toHex(n) {
			let hex = n.toString(16);
			return (hex.length < 2) ? [0, hex].join('') : hex;
		}

		function rgbToHexString(r, g, b) {
			return ['#',  toHex(r), toHex(g), toHex(b)].join('');
		}

		rgbToHexString(255, 255, 255);
		// => #ffffff

		可以继续柯里化该函数来生成按按特定的颜色或色调;
		const blurGreenish = curry3(rgbToHexString)(255)(200);
		blurGreenish(0);
		// => '#00c8ff'


/*=========函数组合=========*/
const compose = function (f, g) {
	return x => f(g(x));
}

let toUpperCase = function(x) {
	return x.toUpperCase();
}

let exclaim = function(x) {
	return x + '!';
}

const shout = compose(exclaim, toUpperCase);

shout('send in the clowns');
// => 'SEND IN THE CLOWNS!'

/*===========pointfree无参数风格================*/
// 非pointfree风格
const snakeCase = function (word) {
	return word.toLowerCase().replace(/\s+/ig, '_');
}

// pointfree无参数风格
const toLowerCase = function (word) {
	return word.toLowerCase();
}

const replace = function (what, to) {
	return function(word) {
		return word.replace(what, to);
	} 
}

const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);

/*===========强大的容器==========================*/
const Container = function (x) {
	this._value = x;
};

Container.of = function (x) {
	return new Container(x);
};

Container.prototype.map = function (f) {
	return Container.of(f(this._value);
};

Container.of(2).map(two => two * 2);
// => Container(4)

Container.of('flamerthrowers').map(s => s.toUpperCase());
// => Container('FLAMERTHROWERS')

Container.of('bombs').map(concat(' aways')).map(_.prop('length'));
// => Container(10)

/*==========Maybe==============*/
const Maybe = function (x) {
	this._x = x;
};

Maybe.of = function (x) {
	return new Maybe(x);
}

Maybe.prototype.isNothing = function () {
	return (this._value === null || this._value === undefined);
}

Maybe.prototype.map = function (f) {
	return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this._value));
}

/*
	Maybe看起来跟Container非常类似，但是有一点不同：Maybe会先检查自己的值是否为空，然后才调用传进来的函数。这样我们在使用map的时候就能避免恼人的空值了。
*/

Maybe.of('Malkovich Malovich').map(match(/a/ig));
// => Maybe(['a', 'a'])

Maybe.of(null).map(match(/a/ig));
// => Maybe(null)

Maybe.of({name: 'Boris'}).map(_.prop('age')).map(add(10));
// => Maybe(null)

Maybe.of({name: 'Dinah', age: 14}).map(_.prop('age')).map(add(10));
// => Maybe(24)

/*=========Monad(单子)================*/
/*
	一个functor，只要它定义了一个join方法和一个of方法，并遵守一些定律，那么它就是一个monad。
	join的实现并不太复杂，我们来为Maybe定义一个
*/
Maybe.prototype.join = function () {
	return this.isNothing() ? Maybe.of(null) : this._value;
}

const join = function (mma) {
	return mma.join();
}

let firstAddressStreet = 
	compose(join, map(safeProp('street')), join, map(safeHead), safeProp('addresses'));

firstAddressStreet({
	addresses: [
		{
			street: {name: 'Mulburry', number: 8042},
			postcode: 'WC2N'
		}
	]
});


	