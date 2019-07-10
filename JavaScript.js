=> 数组的迭代方法
	1.every(): 对数组中的每一项运行给定函数，如果该函数每一项都返回true，则返回true。(任意)
	2.some(): 对数组中的每一项运行给定函数，如果该函数对任一项true，则返回true。     (存在)
	3.filter(): 对数组中的每一项运行给定函数，返回该函数会返回true的项组成的数组。 
	4.forEach(): 对数组中的每一项运行给定函数。这个方法没有返回值。
	5.map(): 对数组中的每一项运行给定函数，返回每次调用结果组成的数组。

	>>array.reduce(callbackFn [, initialValue]): 
	>>array.reduceRight(callbackFn [, initialValue]):
		对数组中的所有元素调用指定的回调函数。该回调函数的返回值为累积结果，并且此返回值在下一次调用该回调函数时作为参数提供。
		@参数
		array: 必需，一个数组对象
		callbackFn: 必需，一个接受最多四个参数的函数，对于数组中的每个元素，reduce方法都会调用callbackFn函数一次。
		initialValue: 可选。如果指定initialValue，即它将用作初始值来启动累积。第一次调用callbackFn函数将此值作为参数
		而非数组值提供。

		let peopleTable = lameCSV("name,age,hair\nMerible,35,red\nBob,66,blonde");
		>>[
			['name', 'age', 'hair'],
			['Merible', '35', 'red'],
			['Bob', '64', 'bonde']
		];

		function lameCSV(str) {
			return str.split('\n').reduce((tab, row)=>{
				tab.push(row.split(',').map(col => col.trim()));
				return tab;
			}, [])
		}

	【例】找最大值

		let arr= [1,2,4,5,3,6];

		let arrMax = arr.reduce((max, item) => {
			if(item>max) {
				max = item;
			}
			return max;
		});

		console.log(arrMax);]

	【例】求合

		let arr = [1,2,3,4,5,8,5];

		let arrSum = arr.reduce((sum, item) => {
			return sum += item;
		});

		console.log(arrSum);

	>>array.concat(arrayX,arrayX,...,arrayX): 
	合并多个数据，不会改变array

=> 类型转换
	采用Number类型的 toString()方法的基模式，可以用不同的基输出数字。例如二进制的基是2，八进制的基是8，十六进制的基是16。
	let num = 10;
	alert(num.toString(2));  // 输出'1010'
	alert(num.toString(8));  // 输出'12'
	alert(num.toString(16));  // 输出'A '

=> 函数
	*如果同时采用function命令和赋值语句声明同一个函数，最后总是采用赋值语句的定义。
		var f = function () {
	  	console.log('1');
		}

		function f() {
	 	 console.log('2');
		}

		f() // 1

	*函数的属性和方法
		1.name属性
		函数的name属性返回函数的名字
		function f1() {}	
		f1.name // 'f1'
		如果是通过变量赋值定义的函数，那么name属性返回变量中
		var f2 = function() {};
		f2.name // 'f2'
		但是，上面这种情况，只有变量的值是一个匿名函数时才是如此。如果变量的值是一个具名函数，那么name属性返回function关键字之后那个函数名
		var f3 = function myName() {};
		f3.name // 'myName'
		2.length属性
		函数的length属性返回函数预期传入的参数个数，即函数定义之中的参数个数。
		function f(a, b) {}
		f.length  // 2
		length属性提供了一种机制，判断定义时和调用时参数的差异，以便实现面向对象编程的”方法重载“（overload）。

	*函数本身的作用域
	函数本身也是一个值，也有自己的作用域。它的作用域与变量一样，就是其声明时所在作用域，与其运行时所有的作用域无关
		var a = 1;
		var x = function () {
		  console.log(a);
		};

		function f() {
		  var a = 2;
		  x();
		}

		f() // 1

	*正常模式下，arguments对象可以在运行时修改。
	var f = function(a, b) {
		arguments[0] = 3;
		arguments[1] = 2;
		return a + b;
	}

	f(1, 1)  // 5

	*严格模式下，arguments对象是一个只读对象，修改它是无效的，但不会报错。
	var f = function(a, b) {
		'use strict';
		arguments[0] = 3;
		arguments[1] = 2;
		return a + b;
	}

	f(1, 1); // 2

	*与数组的关系
	需要注意的是，虽然arguments很像数组，但它的一个对象。数组专有的方法（比如slice和forEach)，不能在arguments对象上直接使用。
	如果要让arguments对象使用数组方法，真正的解决方法是将arguments转为真正的数组。下面是两种常用的转换方法，slice方法和逐一填入新数组。
	let args = Array.prototype.slice.call(arguments);

	let args = [];
	for(let i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	**闭包
	闭包是定义在一个函数内部的函数。
	闭包是指有权访问另一个函数作用域的函数。

=> 闭包案例
	function createScaleFunct(factor) {
		return function(v) {
			return _.map(v, (n)=> {
				return (n*factor);
			});
		}
	}

	let scale10 = createScaleFunct(10);
	scale([1,2,3]);
	//=> [10, 20, 30]


	function createWeirdScaleFunction(FACTOR) {
		return function(v) {
			this['FACTOR'] = FACTOR;
			let captrues = this;

			return _.map(v, _.bind(function(n) {
				return (n*this['FACTOR'])
			}, captures));
		};
	}

	let scale10 = createWeirdScaleFunction(10);
	scale10.call({}, [5,6,7]);
	//=> [50,60,70]

	<例> 累加器
	function sumFactory () {
	let sum = 0;
		return function(x) {
			return sum += x;
		}
	}

	let sum = sumFactory();

	console.log(sum(1));   // = 1
	console.log(sum(2));   // = 3
	console.log(sum(3));   // = 6

	let pingpong = (function() {
		let private = 0;

		return {
			inc(n) {
				return private += n;
			}, 
			dec(n) {
				return private -= n;
			}
		}
	})();

	pingpong.inc(10);
	//=> 10
	pingpong.dec(7);
	//=> 3

	添加其它函数，也是安全的。
	pingpong.div = function(n) {return private/n};

	pingpong.div(3);	
	//=> RefernceError: private is not difined;

=> typeof 的返回值
	'undefined' : 如果这个值未定义；
	'boolean'   : 如果这个值是布尔值；
	'string'    : 如果这个值是字符串；
	'number'    : 如果这个值是数值；
	'object'    : 如果这个值是对象或null； *
	'function'  : 如果这个值是函数；

=> Object.seal()方法封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要可写就可以改变。

=> 原型与原型链
	在默认情况下，所有的原型对象都会自动获得一个 constructor（构造函数）属性，这个属性（是一个指针）指向 prototype 属性所在的函数（Person）。

	ECMAScript5定义了一个名为Object.create()的方法，它创建一个对象，其中第一个参数是对象的原型。Object.create()提供第二个参数，用以对对象的属性进行进一步描述。
	可以通过传入参数null来创建一个没有原型的新对象，但通过这种方式创建的对象不会继承任何东西，甚至不包括基础方法，比如toString()，也就是说，它将不能和“+”运算符一起正常工作。
	>>> 通过原型继承创建一个新对象
	// inhert()返回一个继承自原型对象p的属性的新对象。
	// 这里使用ECMAScript5中的Object.create函数（如果存在的话）   
	// 如果不存在Object.create()，则退化为其他方法
	function inherit(p) {
		if (p == null) throw TypeError(); // p是一个对象，但不能是空对象
		if (Object.create) {
			return Object.create(p);
		}

		let t = typeof p;
		if (t !== 'object' && t !== 'function') throw TypeError();
		function f() {};
		f.prototype = p;
		return new f();
	}

=> js面向对象
	
	<<<创建对象>>>

		1.工厂模式

			function createPerson(name, age, job) {
				let o = new Object();

				o.name = name;
				o.age = age;
				o.job = job;
				o.sayName = function() {
					console.log(this.name);
				}

				return o;
			}

			let person1 = createPerson('Nicholas', 29, 'Software Engineer');
			let person2 = createPerson('Greg', 27, 'Doctor');

		2.构造函数模式

			function Person(name, age, job) {
				this.name = name;
				this.age = age;
				this.job = job;
				this.sayName = function() {
					console.log(this.name);
				}
			}

			let person1 = new Person('Nicholas', 29, 'Software Engineer');
			let person2 = new Person('Greg', 27, 'Doctor');

		3.原型模式

			function Person() {}

			Person.prototype.name = 'Nicholas';
			Person.prototype.age = 29;
			Person.prototype.job = 'Software Engineer';
			Person.prototype.sayName = function() {
				alert(this.name);
			}

			let person1 = new Person();
			person1.sayName();  //"Nicholas"

			let person2 = new Person();
			person2.sayName() //"Nicholas"

			alert(person1.sayName == person2.sayName); // true

		4.组合使用构造函数模式和原型模式

			function Person(name, age, job) {
				this.name = name;
				this.age = age;
				this.friends = ['Shelby', 'Court'];
			}

			Person.prototype = {
				constructor: Person,
				sayName: function() {
					alert(this.name);
				}
			}

			let person1 = new Person('Nicholas', 29, 'Software Engineer');
			let person2 = new Person('Greg', 27, 'Doctor');

			person1.friends.push('Van');
			alert(person1.friends); // 'Shelby, Court, Van'
			alert(person2.friends); // 'Shelby, Court'
			alert(person1.friends === person2.friends); //false;
			alert(person1.sayName === person2.sayName); // true;

		5.动态原型模式
			有其它OO语言经验经验的开发人员在看到独立的构造函数和原型时，很可能会感到非常困惑。动态原型式正是致力于解决这个问题的一个方案，
			它把所有信息都封装在构造函数中，而通过在构造函数中的初始化原型（仅在必要情况下），又保持了同时使用构造函数和原型的优点。换句
			话说，可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。

			function Person(name, age, job) {

				//属性
				this.name = name;
				this.age = age;
				this.job = job;
		
				// 方法
				if(typeof this.sayName != 'function') {

					Person.prototype.sayName = function() {
						alert(this.name);
					};

				}
			}

			let friend = new Person('Nocholas', 29, 'Software Engineer');
			friend.sayName();

		6.寄生构造函数模式

			function SpecialArray() {
				// 创建数组
				let values = new Array();

				// 添加值
				values.push.apply(values, arguments);

				// 添加方法
				values.toPipedString = function() {
					return this.join('|');
				}

				// 返回数组
				return values;

			}

			let colors = new SpecialArray('red', 'blue', 'green');
			alert(colors.toPipedString());  //'red|blue|green'

		7.稳妥构造函数模式
			稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：
			> 一是新创建对象的实例方法不引用this;
			> 二是不使用new操作符调用构造函数。
			
			function Person(name, age, job) {
				// 创建返回的对象
				let o = new Object();
				// 可以在这里定义私有变量和函数

				// 添加方法
				o.sayName = function() {
					alert(name);
				}

				return o;
			}


	<<<对象继承>>>

		1.原型链
			实现原型链有一种基本模式，其代码大致如下：
			function SuperType() {
				this.property = true;
			}

			SuperType.prototype.getSuperValue = function() {
				return this.property;
			}

			function SubType() {
				this.subproperty = false;
			}

			// 继承了SuperType
			SubType.prototype = new SuperType();

			SubType.prototype.getSubValue = function() {
				return this.subproperty;
			}

			let instance = new SubType();
			alert(instance.getSuperValue()) // true

			>确定原型和实例的关系
			可以通过两种方式来确定原型与实例之间的关系。

			(1)第一种方式是使用instanceof操作符，只要用这个操作符来测试实例与原型链中出现过的构造函数，结果就会返回true。

			alert(instance instanceof Object)     // true
			alert(instance instanceof SuperType)  // true
			alert(instance instanceof SubType)    // true

			(2)第二种方式是使用 isPrototypeOf() 方法。同样，只要是原型链中出现过的原型，都可以说是该原型链所派生的实例原型，因此 
			isPrototypeOf() 方法也会返回true。

			alert(Object.prototype.isPrototypeOf(instance));      // true
			alert(SuperType.prototype.isPrototypeOf(instance));   // true
			alert(SubType.prototype.isPrototypeOf(instance));     // true

		2.借用构造函数

			function SuperType() {
				this.colors = ['red', 'blue', 'green'];
			}

			function SubType() {
				// 继承了SuperType
				SuperType.call(this);
			}

			let instance1 = new SubType();
			instance1.colors.push('black');
			alert(instance1.color); // 'red, blue, green, black'

			let instance2 = new SubType();
			alert(instance2.colors);  // 'red, blue, green'

			通过使用 call()方法 （或 apply() 方法也可以），我们实际上是在（未来将要）新创建的Super实例的环境下调用了SuperType构造函数。
			这样一来，就会在新SubType对象上执行 SuperType() 函数中定义的所有对象初始化代码。结果，SubType的每个对象就都会具有自已的colors
			属性的副本了。

			> 传递参数
			相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。

			function SuperType(name) {
				this.name = name;
			}

			function SubType() {
				//继承了SuperType, 同时还传递了参数
				SuperType.call(this, 'Nicholas');

				//实例属性
				this.age = 29;
			}

			let instance = new SubType();

			alert(instance.name); // 'Nicholas'
			alert(instance.age);  // 29 

			以上代码中的SubType只接受一个参数name，该参数会直接赋值给一个属性。在SubType构造函数内部调用SuperType构造函数时，实际上是为
			SubType的实例设置了name	属性。为了确保SuperType构造函数不会重写子类型的属性，可以在调用超类构造函数后，再添加应该在子类型中
			定义的属性。

			> 借用构造函数的问题
			如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题--方法都在构造函数中定义，因此函数复用就无从谈起了。而且，在超
			类型的原型中定义方法，对子类而言也是不可见的，结果所有类型都只能使用构造函数模式。

		3.组合继承

			组合继承，有时候也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承方式。其背后的思路
			是使用原型链对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又
			能够保证实例都有它自己的属性。

			function SuperType(name) {
				this.name = name;
				this.colors = ['red', 'blue', 'green'];
			} 	

			SuperType.prototype.sayName = function() {
				alert(this.name);
			}

			function SubType(name, age) {

				// 继承属性
				SuperType.call(this, name);

				this.age = age;
			} 

			// 继承方法
			SubType.prototype = new SuperType();

		4.原型式继承	

			function object(o) {
				function F() {}
				F.prototype = o;
				return new F();
			}

			在 object() 函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个
			新实例。从本质上讲，object()对传入其中的对象执行了一次浅复制；

			let person = {
				name: 'Nocholas',
				friends: ['Shelby', 'Court', 'Van']
			};

			let anotherPerson = object(person);
			anotherPerson.name = 'Greg';
			anotherPerson.friends.push('Rob');

			let yetAnotherPerson = object(person);
			yetAnotherPerson.name = 'Linda';
			yetAnotherPerson.friends.push('Barbie');

			alert(person.friends); //'Shelby,Court,Van,Rob,Barbie'

			ECMAScript5通过新接增Object.create()方法规范了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个
			为新对象定义的额外属性的对象。在传入一个参数的情况下Object.create()与 object()  方法的行为相同。

			let person = {
				name: 'Nicholas',
				friends: ['Shelby', 'Court', 'Van']
			}

			let anotherPerson = Object.create(person);
			anotherPerson.name = 'Grag';
			anotherPerson.friends.push('Rob');

			let yetAnotherPerson = Object.create(person);
			yetAnthorPerson.name = 'Linkda';
			yetAnthorPerson.friends.push('Barbie');

			alert(person.friends);  // 'Shelby, Court, Van, Rob, Barbie'

			Object.create()方法的第二个参数与Object.defineProperties()方的第二个参数格式相同：每个属性都是通过自己的描述符定义的。
			以这种方式指定的任何属性都会覆盖原型对象上的同名属性。

			let person = {
				name: 'Nicholas',
				friends: ['Shelby', 'Court', 'Van']
			}

			let anotherPerson = Object.create(person, {
				name: {
					value: 'Greg'
				}
			});

		5.寄生式继承

			function createAnother(original) {
				let clone = object(original);   // 通过调用函数来创建一个新对象
				clone.sayHi = function() {      // 以某种方式增强这个对象
					alert('hi');
				}

				return clone;                   // 返回这个对象
			}

			在这个例子中，createAnother()函数接收一个参数，也就是将要作为新对象基础的对象。然后，把这个对象（origin）传递给 object() 
			函数，将返回的结果赋值给clone。再为clone对象添加一个新方法 sayHi()，最后返回clone对象。可以像下面这样使用createAnother函数。

			let person = {
				name: 'Nicholas',
				friends: ['Shelby', 'Court', 'Van']
			}

			let anotherPerson = createAnother(person);
			anotherPerson.sayHi();

			这个例子中的代码基于person返回了一个新对象--anotherPerson。新对象不仅具有person的所有属性和方法，而且还有自己的 sayHi() 方法。

			在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。前面示范继承式时使用的 object() 函数不是必需
			的；任何能够返回新对象的函数都适用于此模式。

			使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率；这一点与构造函数模式类似。 

		6.寄生组合继承

			组合式继承是JavaScript最常用的继承方式；不过，它也有自己的不足。组合继承最大的问题就是无论什么情况下，都会调用两次超类型的构
			造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。没错，子类型最终会包含超类型对象的全部实例属性，但我们不
			得不在调用子类型构造函数时重写这些属性。再来看一看下面组合继承的例子。

			function SuperType(name) {
				this.name = name;
				thos.colors = ['red', 'blue', 'green']
			}

			SuperType.prototype.sayName = function() {
				alert(this.name);
			}

			function SubType(name, age) {
				SuperType.call(this, name);  //第二次调用SuperType()

				this.age = age;
			}

			SubType.prototype = new SuperType();  //第一次调用SuperType()
			SubType.prototype.constructor = SubType;
			SubType.prototype.sayAge = function() {
				alert(this.age);
			};

			所谓寄生组合继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：不必为了指定子类型的原型
			而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生继承来继承超类型的原型，然后再将结
			果指定给子类型的原型。寄生组合式继承的基本模式如下所示：

			function inheritPrototype(subType, superType) {
				let prototype = object(superType.protototype); // 创建对象
				prototype.constructor = subType;               // 增强对象
				subType.prototype = prototype;                 // 指定对象
			}

			function object(o) {
				function F() {}
				F.prototype = o;
				return new F();
			}

			这个示例中的 inheritPrototype() 函数实现了寄生组合式继承的最简单的形式。这个函数接收两个参数，子类型构造函数和超类型构造函
			数。在数内部，第一步是创建超类型原型的一个副本。第二步是为创建的副本添加constructor属性，从而弥补因重写原型面失去默认的
			constructor属性。最后一步，将新创建的对象（即副本）赋值给子类型的原型。这样，我们就可以调用 inheritPrototype() 函数的语句，
			去替换前面例子中为子类型赋值的语句了。

			function SuperTypr(name) {
				this.name = name;
				this.colors = ['red', 'blue', 'green']
			}

			SuperType.prototype.sayName = function() {
				alert(this.name);
			}

			function SubType(name, age) {
				SuperType.call(this, name);

				this.age = age;
			}

			inheritPrototype(SubType, SuperType);

			SubType.prototype.sayAge = function() {
				alert(this.age);
			}
		
=> 缓动算法
	缓动算法接受4个参数，这4个参数的含义分别是动画已消耗的时间、物体的原始位置、物体目标位置、动画持续时间，返回的值则是动画元素应该处在的当前位置：
	let tween = {
		linear(t, b, c, d) {
			return c*t/d + b;
		},
		easeIn(t, b, c, d) {
			return c * (t /= d) + b;
		},
		strongEaseIn(t, b, c, d) {
			return c * (t /= d) * t ** 4 + b;
		},
		strongEaseOut(t, b, c, d) {
			return c *( (t = t/d -1) * t**4+1) + b;
		},
		sineaseIn(t, b, c, d) {
			return c *( t /= d)*t**2 + b;
		},
		sineaseOut(t, b, c, d) {
			return c *( (t = t/d-1)*t**2+ 1) + b;
		}
	}

=> 一个网上的元编程案例
	function DS(computorId) {
		this.computorId = computerId;

		//不同电脑的不同配置
		this.data = {
			mouseInfo: '鼠标',
			mousePrice: '999',
			keyboardInfo: '键盘',
			keyboardPrice: '888',
			lcdInfo: '驱动',
			lcdPrice: '888',
			/*
			* 略去其他音响，声卡，显卡等属性 
			*/
		}
	}

	DS.prototype = {
		constructor: DS,

		get_mouse_info() {
			return  this.data.mouseInfo;  // 取回鼠标信息
		},
		get_mouse_price() {
			return this.data.mousePrice; // 取回鼠标价格
		},
		get_keyboard_info() {
			return this.data.keyboardInfo; // 取回键盘信息
		},
		get_keyboard_price() {
			return this.data.keyboardPrice; // 取回键盘价格
		}

		/*
		* 还有其他一些关于显示器，音响，声卡等等信息和价格
		*/
	}
	

	let AimClass = function (id, data_source) {
		this.id = id;
		this.data_source = data_source;
	}

	AimClass.prototype = {
		constructor: AimClass,
		methodmissing(name, args) {
			let methodName = `get_${name}`;
			if (!this.data_source[`${methodName}_info`]) {
				return `找不到此设置信息`;
			}

			let info = this.data_source[`${methodName}_info`](this.id);
			let price = this.data_source[`${methodName}_price`](this.id);
			let result = `mouse:${info}${price}`;

			result = price >= 100 ? `*${reuslt}` : result;
			console.log(result);
			return this;  
		},
		methods() {
			let args = Array.prototype.slice.call(arguments);
			let methodName = args.shift()||undefined;
			let methodArgs = args.length > 1 ? args : [];

			if (typeof methodName === 'undefined') {
				return;
			}

			if (this[methodName]) {
				return this[methodName].apply(this, methodArgs);
			} else {
				return this['methodmissing'](methodName, methodArgs);
			}
		}
	}

	let b = new AimClass(12, new DS('15'));
	b.methods('keyboard').methods('www');
	
=> ajax 模型
	// 生成可发送同步/异步请求的 XMLHttpRequest 对象实例
	const oReq = new XMLHttpRequest();
	// open 方法初始化请求方法、地址，第三个参数 true 声明进行异步请求
	oReq.open("GET", "http://www.jianshu.com/", true);
	// 请求的整个过程中有五种状态，且同一时刻只能存在一种状态：
	// 0. 未打开
	// 1. 未发送
	// 2. 已获取响应体
	// 3. 正在下载响应体
	// 4. 请求完成
	// 当请求状态发生改变时，触发 onreadystatechange 会被调用
	oReq.onreadystatechange = function (oEvent) {
	  // 如果已经开始下载响应体了
	  if (oReq.readyState === 4) {
	    // 如果响应体成功下载，并且服务端返回 200 状态码
	    if (oReq.status === 200) {
	      // 打印响应信息
	      console.log(oReq.responseText);
	    } else {
	      console.log("Error", oReq.statusText);
	    }
	  }
	};
	// send 方法发送请求，由于此请求是异步的，该方法立刻返回
	oReq.send(null);

+> 封装一个ajax对象
	const ajax = {};
	ajax.httpRequest = () => {
		// 判断是否支持XMLHttpRequest对象
		// Chrome,Firefox,Opera, 8.0+, Safari
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		}
		// 兼容IE浏览器
		const versions = [
		 	"MSXML2.XmlHttp.6.0",
      "MSXML2.XmlHttp.5.0",
      "MSXML2.XmlHttp.4.0",
      "MSXML2.XmlHttp.3.0",
      "MSXML2.XmlHttp.2.0",
      "Microsoft.XmlHttp"
		];

		// 定义局部变量xhr,储存IE浏览器的ActiveXObject对象
		let xhr;
		for (let i = 0; i < versions.lenght; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
			} catch (err) {

			}
		} 
		return xhr;
	};

	ajax.send = (url, callback, method, data, async) => {
		// 默认异步
		if (async === undefined) {
			async = true;
		}
		let httpRequest = ajax.httpRequest();
		// 初始化HTTP请求
		httpRequest.open(method, url, async);
		// onreadystatechange函数
		httpRequest.onreadystatechange = () => {
			// readyState的值等于4，从服务器拿到数据
			if (httpRequest.readState === 4) {
				// 回调函数响应数据
				callback(httpRequest.responseText);
			}
		}
	}	
	
	// 实现GET请求
	ajasx.get = (url, data, callback, aync) => {
		const query = [];
		for (let key in data) {
			query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
		}
		ajax.send(`${url}${query.leng ? `?${query.join('&')}` : ''}`, callback, 'GET', null, async);
	}

	// 实现POST请求
	ajax.post = (url, data, callback, async) => {
		const query = {};
		for {let key in data} {
			query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
		}
		ajax.send(url, callback, 'POST', query.join('&'), async);
	}

+> ajax请求的5个readyState状态
	状态0 Uninitialized 初始化状态。XMLHttpRequest对象创建或已被 abort()方法重置。
	状态1 Open Open()方法已调用，但是send()方法未调用。请求还未被发送。	  
	状态2 Sent Send()方法已调用，Http请求已发送到到Web服务器。未接收到响应。
	状态3 Receiving 所有响应头都已经接收到。响应体开始接收未完成。
	状态4 Loaded HTTP响应已经完全接收。
	readyState的值不会递减，除非当一个请求在处理的过程中的时候调用了 abort() 或 open()方法。每次这个属性的值增加的时候，都会触发onreadystatechange事件。	

=> fetch的基本用法
 	// url 必选 ，options 可选
 	fetch('/some/url', {
 		method: 'get'
 	}).then(res => {

 	}).catch(err => {

 	})

 	>> 请示头
 	let headers = new Headers({
 		'Context-Type': 'text/plain',
 		'X-My-Custom-Header': 'CustomValue'
 	});	

 	// 添加(append)请求头信息
 	headers.append('Context-Type', 'text/plain');
 	headers.append('X-My-Coutom-Header', 'CustomValue');

 	// 判断(had)，获取(get)，以及修改(set)请求头的值
 	headers.has('Content-Type'); // true
 	headers.get('Content-Type'); // text/plain
 	headers.set('Content-Type', 'application/json');

 	// 删除某条请求头信息（a header）
 	headers.delete('X-My-Custom-Header');

 	需要创建一个Request对象来包装请求头：
 	let request = new Request('/some-url', {
 		headers: new Headers({
 			'Content-Type': 'text/plain'
 		})
 	});

 	fetch(reqest).then(res => {});

 	Request 简介
 	Request对象表示一次fetch调用的请求信息。传入Request参数来调用fetch, 可以执行很多自定义请求的高级用法：
 	method: 支持GET, POST, PUT, DELETE, HEAD
 	url: 请求的URL
 	headers: 对应Headers对象
 	body: 请求参数（JSON.stringify过的字符串或'name=jim&age=22'格式）
 	mode: 是否允许跨域请求，以及哪上些响应的属性是可读的。可选值：
 		cors: (默认)，允许跨域请求，将遵守CORS协议
 		no-cors: 该模式允许来自CDN的脚本，其他域的图片和其他一些跨域资源。前提条件是method只能是GET,POST,HEAD，此外，如果ServiceWorkers拦截了这些请求，它不能随意添加或者修改除这些之外Header属性。第三，js不能访问Response对象中的任何属性，这确保了跨域时ServiceWorkers的安全和隐私信息泄露问题。
 		some-origin: 如果是一个跨域请求，将返回一个error
 		navigate: 支持导航的模式，仅用于html导航
	credentials: 设置cookies	是否随意请求一起发送，可选值
		omit: (默认)，不发送Cookie。
		same-origin: 同域下自动发送Cookie。
		include: 始终发送Cookie，即使是跨域。
	redirect: 定义重定向处理方式。可选值：follow（默认），error，manual
	integrity: 子资源完整性值
	cache: 设置缓存模式。可选值	

=> 注册 Service Worker
	当浏览器对 Service Worker 提供原生支持时，我们便可以在页面加载后注册指定的 JavaScript 文件，并运行在后台线程之中，以下代码是这一过程的实例。	
		// 检查浏览器是否对 serviceWorker 有原生支持
    if ('serviceWorker' in navigator) {
      // 有原生支持时，在页面加载后开启新的 Service Worker 线程，从而优化首屏加载速度
      window.addEventListener('load', function() {
      // register 方法里第一个参数为 Service Worker 要加载的文件；第二个参数 scope 可选，用来指定 Service Worker 控制的内容的子目录
        navigator.serviceWorker.register('./ServiceWorker.js').then(function(registration) {
          // Service Worker 注册成功
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
          // Service Worker 注册失败
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }

=> 安装 Service Worker
	安装阶段，我们可以执行任何任务。这里我们逐步打开缓存、缓存文件和确认所有需要的资产是否缓存。ServiceWorker.js 中的实例安装代码如下：

	var CACHE_NAME = 'my-site-cache-v1';
	var urlsToCache = [
	  '/',
	  '/styles/main.css',
	  '/script/main.js'
	];

	self.addEventListener('install', function(event) {
	  // Perform install steps
	  event.waitUntil(
	    caches.open(CACHE_NAME)
	      .then(function(cache) {
	        console.log('Opened cache');
	        return cache.addAll(urlsToCache);
	      })
	  );
	});
	这要求我们在与项目根目录下建立 main.js 和 main.css 空文件。我们可以在 Chrome 开发者工具里的“Application”菜单的“Cache Storage”中看到相应的缓存。并且在图中的“Service Workers”选项卡中看到正在运行的 Service Workers。

	且从上面的代码可以看到，通过 Service Worker 对象加载的文件拥有全局变量 caches 等，并且 self 关键字指向这个对象本身。cache 使我们可以存储网络响应发来的资源，并且根据它们的请求来生成 key。这个 API 和浏览器的标准的缓存工作原理很相似，且会持久存在，直到我们释放主动空间——我们拥有全部的控制权。

=>js实现简单的双向绑定
	`
		<body>
			<div id='app'>
				<input type="text" id='txt' />
				<p id="show"></p>
			</div>
		</body>
	`	
	let obj = {};
	Object.defineProperty(obj, 'txt', {
		get: function() {
			return obj
		},
		set: function(newValue) {
			document.getElemenetById('txt').value = newValue
			document.getElemenetById('show').innerHTML = newValue
		}
	})
	document.addEventListener('keyup', e => {
		obj.text = e.target.value
	})

=> Thunk 函数
	在JavaScript语言中，Thunk函数替换的不是表达式，而是多参数函数的版本，且只接受回调函数作为参数
	// 正常版本的readFile(多参数版本)
	fs.readFile(fileName, callback);

	// Thunk版本的readFile(单参数版本)
	let readFileThunk = Thunk(fileName);
	readFileThunk(callBack);

	function Thunk(fileName) {
		return function(callback) {
			return fs.readFile(fileName, callback);
		}
	}

	Thunk 函数转换器
		// ES5版本
	var Thunk = function(fn){
	  return function (){
	    var args = Array.prototype.slice.call(arguments);
	    return function (callback){
	      args.push(callback);
	      return fn.apply(this, args);
	    }
	  };
	};

	// ES6版本
	var Thunk = function(fn) {
	  return function (...args) {
	    return function (callback) {
	      return fn.call(this, ...args, callback);
	    }
	  };
	};

	使用上面的转换器，生成fs.readFile的Thunk函数
	let readFileThunk = Thunk(fs.readFile);
	readFileThunk(fileName)(callback);

	&& Thunkify模块
	生产环境的转换器，建议使用Thunkify模块。
	首先是安装。
	$ npm install thunkify

	使用方法如下
	const thunkify = require('thunkify');
	const fs = require('thunkify');

	let read = thunkify(fs.readfile);
	read('package.json')((err, str) => {
		// ...
	});

	[code thunkify源码]
	function thunkify(fn) {
		let args = new Array(arguments.length);
		let ctx =  this;

		for (let i = 0; i < args.length; ++i) {
			args[i] = arguments[i];
		}

		return function(done) {
			let called;
			args.push(function () {
				if (called) return;
				called = true;
				done.apply(null, arguments)
			});

			try {
				fn.apply(ctx, args)
			} catch(err) {
				done(err);
			}
		}
	}

=> promisify 
	const promisify = require('promisify');
	const fs = require('fs');

	let read = promisify(fs.readFile);
	read('package.json').then(data => {
		// ...
	}).catch(err => {
		// ...
	});

=> EventLoop 事件循环
	在 Node.js 中，eventLoop是基于libuv的。通过查看libuv的文档可以发现整个eventLoop 分为 6 个阶段：
	1.timers: 定时器相关任务，node中我们关注的是它会执行 setTimeout() 和 setInterval() 中到期的回调
	2.pending callbacks: 执行某些系统操作的回调
	3.idle, prepare: 内部使用
	4.poll: 执行 I/O callback，一定条件下会在这个阶段阻塞住
	5.check: 执行 setImmediate 的回调
	6.close callbacks: 如果 socket 或者 handle 关闭了，就会在这个阶段触发 close 事件，执行 close 事件的回调


=> Object.defineProperty() && Object.defineProperties();
	ECMAS-262第5版在定义只有内部采用的特性时，提供了描述了属性特征的几种属性。ECMAScript对象中目前存在的属性描述符主要有两种，数据描述符(数据属性)和存取描述符(访问器属性)，数据描述符是一个拥有可写或不可写值的属性。存取描述符是由一对 getter-setter 函数功能来描述的属性。	

	& 数据（数据描述符）属性
		数据属性有4个描述内部属性的特性
		[[Configurable]]
		表示能否通过delete删除此属性，能否修改属性的特性，或能否把属性修改为访问器属性，如果直接使用字面定义对象，默认为 true;
		[[Enumerable]]
		表示该属性是否可枚举，即是否通过for-in循环或Object.keys()返回属性，如果直接使用字面值定义对象，默认值为 true;
		[[Writable]]
		能否修改属性的值，如果直接使用字面量定义对象，默认值为 true;
		[[Value]]
		该属性对应的值，默认为undefined

	& 访问器（存取描述符）属性
		[[Configurable]]
		和数据属性的[[Configurable]]一样，表示能否通过delete删除此属性，能否修改属性的特性，或能否修改把属性修改为访问器属性，如果直接使用字面量定义对象，默认值为true;
		[[Enumerable]]	
		和数据属性的[[Configurable]]一样，表示该属性是否可枚举，即是否通过for-in循环或Object.keys()返回属性，如果直接使用字面量定义对象，默认值为true;
		[[Get]]
		一个给属性提供 getter 的方法(访问对象属性时调用的函数,返回值就是当前属性的值)，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined；
		[[Set]]
		一个给属性提供 setter 的方法(给对象属性设置值时调用的函数)，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined

		1.在使用Object.defineProperty、Object.defineProperties 或 Object.create 函数的情况下添加数据属性，writable、enumerable和configurable默认值为false。
		2.使用对象直接量创建的属性，writable、enumerable和configurable特性默认为true。

	>> Object.defineProperty()
	方法会直接在一个对象上定义一个新的属性，或者修改一个对象的现有属性，并返回这个对象。如果不指定configurable,
	writable,enumerable，则这些属性的默认值为 false, 如果不指定value, get, set， 则这此属性的默认什为 undefined;
	Object.defineProperty(obj, prop, descriptor)
	obj: 需要被操作的目标对象
	prop: 目标对象需要定义或修改的属性的名称
	descriptor: 将被定义或修改的属性的描述符

	let obj = new Object();

	Object.defineProperty(obj, 'name', {
		configurable: false,
		writable: true,
		enumerable: true,
		value: '张三'
	})

	console.log(obj.name) // 张三

	>> Object.defineProperties()
	方法直接在一个对象上定义一个或多个新的属性或修改现有的属性，并返回该对象。
	Object.defineProperties(obj, props)
	obj: 将要被添加属性或修改属性的对象；
	props: 该对象的一个或多个键值对定义了将要为对象添加或修改的属性的具体配置；

	let obj = new Object();

	Object.defineProperties(obj, {
		name: {
			value: '张三',
			configurable: false,
			writeable: true,
			enumerable: true
		},
		age: {
			value: 18,
			configurable: true
		}
	});

	console.log(obj.name, obj.age); // 张三，18

  .. 简易的数据绑定 get set 
  `
		<body>
			<p>
				input=>
				<input type="text" id='input1'>
			</p>
			<p>
        input2=>
        <input type="text" id="input2">
	    </p>
	    <div>
	        我每次比input1的值加1=>
	        <span id="span"></span>
	    </div>
		</body>
  `	

  let oInput1 = document.getElemenetById('input1');
  let oInput2 = document.getElemenetById('input2');
  let oSpan = document.getElemenetById('span');

  let obj = {};
  Object.defineProperties(obj, {
  	val1: {
  		configurable: true,
  		get() {
  			oInput1.value = 0;
  			oInput2.value = 0;
  			oSpan.innerHTML = 0;
  			return 0;
  		},
  		set(newValue) {
  			oInput2.value = newValue;
  			oSpan.innerHTML = Number(newValue) ? Number(newValue) : 0;
  		}
  	},
  	val2: {
  		configurable: true,
  		get() {
  			oInput1.value = 0;
  			oInput2.value = 0;
  			oSpan.innerHTML = 0;
  			return 0;
  		},
  		set(newValue) {
  			  oInput1.value = newValue;
          oSpan.innerHTML = Number(newValue) + 1;
  		}
  	}
  })

  oInput1.value = obj.val1;
  oInput1.addEventListener('keyup', () => {
  	obj.val1 = oInput1.value;
  }, false);
  oInput2.addEventListener('keyup', () => {
  	obj.val2 = oInput2.value;
  }, false);

=> proxy
	使用defineProperty只能重定义属性的读取（get）和设置（set）行为，到了ES6，提供了Proxy，可以重新定义更多的行为，比如in,delete函数调用等更多行为。

	let proxy = new Proxy(target, handler);
	proxy对象的所有用法，都是上面的这种形式，不同的只是handler参数的方法。其中，new Proxy() 表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为；
	let proxy = new Proxy({}, {
		get(obj, prop) {
			console.log('设置get操作');
			return obj[prop];
		},
		set(obj, prop, value) {
			console.log('设置set操作');
			obj[prop] = value;
		}
	});

	proxy.time = 35; //  设置set操作
	console.log(proxy.time); // 设置get操作  // 35

=> Watch API
	Html中有个span标签和button标签
	`
		<span id='container'>1</span>
		<button id='button'>点击加1</button>
	`
	当单击按钮的时候，span标签加1。

	>>传统的做法
	document.getElemenetById('button').addEventListener('click', () => {
		let container = document.getElemenetById('container');
		container.innerHTML = Number(container.innerHTML) + 1;
	});

	>>defineProperty
	let obj = {
		value: 1
	};

	let value = 1;

	Object.defineProperty(obj, 'value', {
		get() {
			return value;
		},
		set(newValue) {
			value = newValue;
			documnet.getElemenetById('container').innerHTML = newValue;
		}
	});

	document.getElemenetById('button').addEventListener('click', () => {
		obj.value += 1;
	});

	然而，现在的写法，我们还需要单独声明一个变量存储 obj.value 的值，因为如果你在 set 中直接 obj.value = newValue   watch 函数。使用效果如下：
	let obj = {
		value: 1
	};

	watch(obj, 'value', (newValue) => {
		document.getElemenetById('container').innerHTML = newValue;
	});

	document.getElemenetById('button').addEventListener('click', () => {
		obj.value += 1;
	});

	watch函数
	(function() {
		function watch(obj, name, func) {
			let value = obj[name];

			Object.defineProperty(obj, name, {
				get() {
					return value;
				},
				set(newValue) {
					value = newValue;
					func(value)
				}
			});

			if (value) obj[name] = value;
		}
		this.watch = watch;
	})();

	>>> watch API 优化
	我们使用 proxy 再来写一下 watch 函数。使用效果如下： 
	(function() {
    function watch(target, func) {
      let proxy = new Proxy(target, {
        get(target, prop) {
          return target[prop];
        },
        set(target, prop, value) {
          target[prop] = value;
          func(prop, value);
        }
      });

      return proxy;
    }
    this.watch = watch;
	})();

	let obj = {
	    value: 1
	}

	let newObj = watch(obj, (key, newValue) => {
	    if (key == 'value') document.getElementById('container').innerHTML = newValue;
	})

	document.getElementById('button').addEventListener("click", () => {
	    newObj.value += 1
	});

+> 根据js的语法，要满足===的条件如下：
	1.如果是引用类型，则两个变量必须指向同一个对象（同一个地址）；
	2.如果是基本类型，则两个变量除了类型必须相同外，值还必须相等；

+> 变量对象的创建，依次经历了以下几个过程。
	1.建立arguments对象。检查当前上下文的参数，建立该对象下的属性的属性值。
	2.检查当前上下文中的函数声明，也就是使用function关键字声明的函数。在变量对象中以函数名建立一个属性，属性值为指向该函数所在内存地址的引用，如果函数的属性已存在，那么该属性将会被新的引用覆盖。	
	3.检查当前上下文中的变量声明，每找到一个变量声明，就在变量对象中以变量名建立一个属性，属性值为undefined。如果该变量名的属性已存在，为了防止同名的函数被修改为undefined，则会直接跳过，原属性值不会被修改。

=> 事件循环机制
	任务：
		1.任务队列又分为macro-task（宏任务）与micro-task （微任务），在最新的标准中，它们分别称为task和job。
		2.macro-task大概包括：script（整体代码），setTimeout, setInterval, setImediate,I/O,UI rendering;
		3.micro-task大概包括：process.nextTick, Promise, Object.observe（已废弃）,MutationObserver（html5新特征）
		4.setTimeout/Promise等我们称之为任务源。而进入任务队列的是他们指定的具体执行任务。
		5.来自不同的任务源的任务会进入到不同的任务队列。其中setTimeout与setInterval是同源的。
		5.事件循环顺序，决定了JavaScript代码的执行顺序。它从script开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的micro-task。当所有的micro-task执行完毕之后。循环再次从macro-task开始，找到其中的一个任务执行完毕，然后再执行所有的micro-task,这样一直循环下去。
		6.其中每一个任务的执行，无论是macro-task还是micro-task，都是借助函数借用栈来完成。

>>> [片断]: 用循环依次输出1到5，每一次输出的时间间隔为1秒；
	1. Promise 版本
		const tasks = [];  // 这里存放异步操作的Promise
		const output = (i) => new Promise(resolve => {
		  setTimeout(() => {
		    console.log(new Date, i);
		    resolve();
		  }, 1000*i);
		});

		// 生成所有的异步操作
		for(var i=0; i < 5; i++) {
		  tasks.push(output(i));
		}

		// 异步操作完成之后，输出最后的i
		Promise.all(tasks).then(() => {
		  setTimeout(() => {
		    console.log(new Date, i);
		  }, 1000);
		}); 		
	2. async 版本	
		// 其他语言中的sleep，实际上可以是任何异步操作
		const sleep = (timeoutMS) => new Promise(resolve => {
			setTimeout(resolve, timeoutMS);
		});

		(async () => { // 声明即执行的async函数表达式
			for (var i = 0; i < 5; i++) {
				await sleep(1000);
				console.log(new Date(), i);
			}

			await sleep(1000);
			console.log(new Date(), i);
		})();

=> Promise 的连续异步调用
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

 	&& 一个简单的随机数生成
	 	比如我们将实现一个随机数的获取：
	 	function * randomGenerator (...randoms) {
		  let len = randoms.length
		  while (true) {
		    yield randoms[Math.floor(Math.random() * len)]
		  }
		}

		const randomeGen = randomGenerator(1, 2, 3, 4);

		randomeGen.next().value // 返回一个随机数

	&& 代替一些递归的操作
		那个最著名的斐波那契数，基本上都会选择使用递归来实现
		但是再结合着Generator以后，就可以使用一个无限循环来实现了：
		function * fibonacci(seed1, seed2) {
		  while (true) {
		    yield (() => {
		      seed2 = seed2 + seed1;
		      seed1 = seed2 - seed1;
		      return seed2;
		    })();
		  }
		}

	const fib = fibonacci(0, 1);
	fib.next(); // {value: 1, done: false}
	fib.next(); // {value: 2, done: false}
	fib.next(); // {value: 3, done: false}
	fib.next(); // {value: 5, done: false}
	fib.next(); // {value: 8, done: false}

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

=> Reflect 对象
	Refkect 是一个内置对象，它提供拦截javaScript操作的方法。这些对象与处理器的方法。Reflect不是一个函数对象，因此它是不可构造的。

	1.Refkect.apply(target, thisArgument, argumentsList); 
		>描述：
		该方法与ES5中Function.prototype.apply()方法类似：调用一个方法并且显式地指定this变量和参数列表（arguments） ，参数列表可以是数组，或类似数组的对象。
		>参数：
		target
			目标函数
		thisArgument
			target函数调用时绑定的this对象
		argumentsList
			target函数调用时传入的实参列表，该参数应该是一个类数组的对象。	
		>异常：
		如果target是不可调用，抛出TypeError。	
		>使用示例：
		Reflect.apply(Math.floor, undefined, [1.75]);
		// 1
		Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]);
		// 'hello'
	// todo: ...	

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

=> Symbol 
	作为属性名的Symbol
	let mySymbol = Symbol();
	// 第一种写法
	let a = {};
	a[mySymbol] = 'Hello'
	// 第二种写法
	let a = {
		[mySymbol]: 'Hello'
	};
	// 第三种写法
	let a = {};
	Object.definePerproty(a, mySymbol, 'Hello');
  // 以上写法都行得出同行的结果
  a[mySymbol]  // 'Hello'

  Symbol值作为对象属性名时，不能用点运算符：
  let a = {};
  let name = Symbol();
  a.name = 'lili';
  a[name] = 'lucy';
  console.log(a.name, a[name]);   // lili, lucy
  Symbol值作为属性名时，该属性是公开属性，不是私有属性。
  /*
  	这个有点类似于java中的protected属性（protected和private的区别：在类的外部都是不可以访问的，在类内的子类可以继承protected不可以继承private）

		但是这里的Symbol在类外部也是可以访问的，只是不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()返回。但有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有Symbol属性名
   */
  

  && Symbol.for(), Symbol.keyFor()
  Symbol.for机制有点类似于单例模式，首先在全局中搜索有没有以该参数作为名称的Symbol值，如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。和直接Symbol就有点不同了
  let s1 = Symbol.for('foo');
  let s2 = Symbol.for('foo');

  s1 === s2;  // true;

  Symbol.keyFor方法返回一个已登记的Symbol类型值的key。实质就是检测该Symbol是否已创建；
  let s1 = Symbol.for("foo");
  Symbol.keyFor(s1); // 'foo'

  let s2 = Symbol('foo');
  Symbol.keyFor(s2);  // undefined

=> async
  async function testAwati() {
  	try {
  		await func1();
  		await func2();
  		await func3();
  	} catch (err) {
  		console.log(err);
  	}
  }

+> 使用Reduce实现Promise串行执行
	function runPromiseByQueue(myPromises) {
		myPromises.reduce((prevPromise, nextPromise) => 
			prevPromise.then(nextPromise.bind(this)), Promise.resolve());
	}  

	当上一个Promise开始执行（previousPromise.then），当其执行完毕后再调用下一个Promise,并作为一个新Promise返回，下次迭代就会继续这个循环。
	const createPromise = (time, id) => {
		return new Promise(resolve => {
			setTimeout(() => {
				console.log('promise', id);
				resolve();
			}, time);
		})
	}

	runPromiseByQueue([
    createPromise.bind(this, 3000, 1),
    createPromise.bind(this, 2000, 2),
    createPromise.bind(this, 1000, 3)
	]);

	// promise 1
	// promise 2
	// promise 3

=> 箭头函数与普通函数的区别
	1. 箭头函数是匿名函数，不能作为构造函数，不能使用new;
	2. 箭头函数不能绑定auguments,取而代之用rest...解决；
	3. 箭头函数不绑定this，会捕获其所在上下文的this值，作为自己的this值
	4. 箭头函数通过call()或apply()方法调用一个函数时，只传入一个参数，对this并没有影响。
	5. 箭头函数没有原型属性。
	6. 箭头函数不能当做Generator函数，不能使用yield关键字。

=> 防抖和节流
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

				// 一个回调函数
				function callback(content) {
					console.log(content)
				}

			<非立即执行版>	
				//然后准备包装函数:
				//1.保存定时器标识 
				//2.返回闭包函数
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

			<立即执行版>
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

	>> 节流
		> 条件
			1.客户连续频繁地触发事件； 
			2.客户不再只关心“最后一次”操作的结果反馈，而是在操作过程中持续的反馈。
		> 场景
			. 鼠标不断点击触发，点击事件在规定时间内只触发一次（单位时间内只触发一次）。
			. 监听滚动事件，比如是否滑动到底部自动加载更多，用throttle来判断。			
		[注意]：：何为连续触发频繁地触发事件，就是事件触发时间间隔至少要比规定时间要短。	

		> 原理
			两种实现方式：
				1.时间戳方式：通过闭包保存上一次的时间戳，然后与事件触发的时间戳比较。如果大于规定时间，则执行回调，否则，什么也不干
				. 特点： 一般第一次会执行，之后连续频繁地触发事件，也是超过了规定时间才会触发一次。最后一次触发事件，也不会执行（说明： 如果你最后一次发时间大于规定时间，这样就算不是连续触发了）。
				2.定时器方式：原理与防抖类似。通过闭包保存上一次的定时器状态。然后事件触发时，如定时器为null（即代表时间间隔大于规定时间），则设置的定时器。到时间后执行回调函数，并将定时器设置为null。
				. 特点： 当第一次触发事件时，不会立即执行函数，到了规定时间后才会执行。之后连续频繁的触发事件，也是到了规定时间才会执行一次(因为定时器)。当最后一次停止触发后，由于定时器的延时，还会执行一次回调查函数（那也是上一次成功触发执行的回调，而不是你最后一次触发产生的）。一句话总结就是延时回调，你能看到的回调都是上次成功触发的，而不是你此刻产生的。

		// 时间戳版本		
		function throttle(fn, delay = 500) {
			let previous = 0; // 记录上一次触发的时间戳，这里初始化为0，是为了第一次触发产生回调
			return function(args) {
				let now = Date.now();
				let thet = this;
				let _args = args;
				if (now - previous > delay) { // 如果时间差大于规定时间，则触发
					fn.apply(that, _args);
				}
			}
		}

		// 定时器版本
		function throttle(fn, delay = 500) {
			let timer;
			let args = args;
			if (!timer) { // 如果定时器不存在，则设置新的定时器，到时后，才执行回调，并将定时器置为null
				timer = setTimeout(function () {
					timer = null;
					fn.apply(that, age);
				}, delay);
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

=> 原生js版前路由实现

	下面分别使用 hash 和 history 两种实现方式回答上面的两个核心问题。

		hash 实现
			hash 是 URL 中 hash (#) 及后面的那部分，常用作锚点在页面内进行导航，改变 URL 中的 hash 部分不会引起页面刷新
			通过 hashchange 事件监听 URL 的变化，改变 URL 的方式只有这几种：通过浏览器前进后退改变 URL、通过<a>标签改变 URL、通过window.location改变URL，这几种情况改变 URL 都会触发 hashchange 事件
			history 实现

		history 提供了 pushState 和 replaceState 两个方法，这两个方法改变 URL 的 path 部分不会引起页面刷新
		history 提供类似 hashchange 事件的 popstate 事件，但 popstate 事件有些不同：通过浏览器前进后退改变 URL 时会触发 popstate 事件，通过pushState/replaceState或<a>标签改变 URL 不会触发 popstate 事件。好在我们可以拦截 pushState/replaceState的调用和<a>标签的点击事件来检测 URL 变化，所以监听 URL 变化可以实现，只是没有 hashchange 那么方便。

	`
		<body>
			<ul>
		    <!-- 定义路由 -->
		    <li><a href="#/home">home</a></li>
		    <li><a href="#/about">about</a></li>

		    <!-- 渲染路由对应的 UI -->
		    <div id="routeView"></div>
		  </ul>
		</body>
	`

	>> 基于hash实现
		// 页面加载完不会触发hashchange事件，这里主动触发一次hashchange事件
		window.addEventListener('DOMContentLoaded', onLoad);
		// 监听路由变化
		window.addEventListener('hashChange', onHashChange);

		// 路由视图
		let routerView = null;
		
		function onLoad() {
			routeView = document.querySelector('#routerView');
			onHashChange();
		}	

		// 路由变化时，根据路由渲染对应UI
		function onHashChange() {
			switch(location.hash) {
				case '#/home':
					routeView.innerHTML = 'Home';
					break;
				case '#/about':
					routerView.innerHTML = 'About';
					break;
				default: 
					break;	
			}
		}

	>> 基于history实现
		// 页面加载完不会触发 hashchange，这里主动触发一次 hashchange 事件
		window.addEventListener('DOMContentLoaded', onLoad);
		// 监听路由变化
		window.addEventListener('popstate', onPopState);

		// 路由视图
		let routerView = null

		function onLoad () {
		  routerView = document.querySelector('#routeView')
		  onPopState()

		  /*
		  	拦截 <a> 标签点击事件默认行为， 点击时使用 pushState 修改 URL并更新手动 UI，从而实现点击链接更新 URL 和 UI 的效果。
		   */
		  let linkList = document.querySelectorAll('a[href]')
		  linkList.forEach(el => el.addEventListener('click', function (e) {
		    e.preventDefault()
		    history.pushState(null, '', el.getAttribute('href'))
		    onPopState()
		  }))
		}

		// 路由变化时，根据路由渲染对应 UI
		function onPopState () {
		  switch (location.pathname) {
		    case '/home':
		      routerView.innerHTML = 'Home'
		      break;
		    case '/about':
		      routerView.innerHTML = 'About'
		      break;
		    default:
		      break;
		  }
		}

=> React 版前端路由实现
	`
	  <BrowserRouter>
	    <ul>
	      <li>
	        <Link to="/home">home</Link>
	      </li>
	      <li>
	        <Link to="/about">about</Link>
	      </li>
	    </ul>

	    <Route path="/home" render={() => <h2>Home</h2>} />
	    <Route path="/about" render={() => <h2>About</h2>} />
	  </BrowserRouter>
	`

	>> BrowserRouter实现
		export default class BrowserRouter extends React.Component {
			state = {
				currentPath: utils.extractHashPath(window.location.href);
			}

			onHashChange = e => {
				const currentPath = utils.extractHashPath(e.newURL);
				console.log('onHaskChange', currentPath);
				this.setState({currentPath});
			}

			componentDidMount() {
				window.addEventListener('hashChange', this.onHaskChange);
			}

			componentWillUnmount() {
				window.removeEventListener('hashChange', this.onHaskChange)
			}

			render() {
				return (
					<RouteContext.Provider value={{currentPath: this.state.currentPath}}>
						{this.props.children}
					<\/RouteContext.Provider>
				)
			}
		}

		>>Router实现
			export default ({path, render}) => {
				<RouterContent.Consumer>
					{{(currentPath) => currentPath === path && render()}}
				<\/RouterContent.Consumer>
			}
		>>Link实现
			export default ({ to, ...props }) => <a {...props} href={"#" + to} \/>;

		>> HistoryRouter 实现
			export default class HistoryRouter extends React.Component {
				state = {
					currentPath: utils.extractUrlPath(window.location.href)
				}

				onPopState = e => {
					const currentPath = utils.extractUrlPath(window.location.href);
					console.log('onPropState:', currentPath);
					this.setState({currentPath});
				}

				componentDidMount() {
					window.addEventListener('popState', this.onPopState);
				}

				componentWillUnmount() {
					window.removeEventListener('popState', this.onPopState);
				}

				render() {
					return (
						<RouteContext.Provider value={{currentPath: this.state.currentpath, onPopState: this.onPopState}}>
						<\/RouteContext.Provider>
					)
				}
			}		

		>> Route 实现
			export default ({ path, render }) => (
			  <RouteContext.Consumer>
			    {({currentPath}) => currentPath === path && render()}
			  <\/RouteContext.Consumer>
			);

		>> Link 实现
			export default ({ to, ...props }) => (
			  <RouteContext.Consumer>
			    {({ onPopState }) => (
			      <a
			        href=""
			        {...props}
			        onClick={e => {
			          e.preventDefault();
			          window.history.pushState(null, "", to);
			          onPopState();
			        }}
			      />
			    )}
			  </RouteContext.Consumer>
			);


=> Vue 版本前端路由实现				
	`
		<div>
    	<ul>
      	<li><router-link to="/home">home</router-link></li>
      	<li><router-link to="/about">about</router-link></li>
    	</ul>
    	<router-view></router-view>
  	</div>
  `	
  >> 基于hash实现
	  const routes = {
		  '/home': {
		    template: '<h2>Home</h2>'
		  },
		  '/about': {
		    template: '<h2>About</h2>'
		  }
		}

		const app = new Vue({
		  el: '.vue.hash',
		  components: {
		    'router-view': RouterView,
		    'router-link': RouterLink
		  },
		  beforeCreate () {
		    this.$routes = routes
		  }
		});

	>> router-view 实现
		`
			<template>
				<component :is="routeView"></component>
			</template>
		`
		import utils from "~/utils.js";
		export default {
			data() {
				return {
					routeView: null
				}
			},
			created() {
				this.boundHashChange = this.onBoudHaskChange.bind(this)
			},
			berforeMount() {
				window.adddEventListener('hashchange', this.boundHashChange)
			},
			mounted() {
				this.onHashChange();
			},
			beforeDestroy() {
				window.removeEventListener('hashchange',  this.boundHashChange)
			},
			methods: {
				onHashChange() {
					const path = utils.extractHashPath(window.location.href);
					this.routeView = this.$root.$routes[path] || null;
					console.log('vue:hashchange', path);
				}	
			}
		}

	>> router-link 实现
	`
		<template>
			<a @click.prevent='onClick'><slot></slot></a>
		</template>
	`	
	export default {
		props: {
			to: String
		},
		methods: {
			onClick() {
				window.location.hash = `#${this.to}`
			}
		}
	}

	>> 基于history实现	
		使用方式和 vue-router 类似：
			`
		    <div>
		      <ul>
		        <li><router-link to="/home">home</router-link></li>
		        <li><router-link to="/about">about</router-link></li>
		      </ul>
		      <router-view></router-view>
		    </div>
	    `

			const routes = {
			  '/home': {
			    template: '<h2>Home</h2>'
			  },
			  '/about': {
			    template: '<h2>About</h2>'
			  }
			}

			const app = new Vue({
			  el: '.vue.history',
			  components: {
			    'router-view': RouterView,
			    'router-link': RouterLink
			  },
			  created () {
			    this.$routes = routes
			    this.boundPopState = this.onPopState.bind(this)
			  },
			  beforeMount () {
			    window.addEventListener('popstate', this.boundPopState) 
			  },
			  beforeDestroy () {
			    window.removeEventListener('popstate', this.boundPopState) 
			  },
			  methods: {
			    onPopState (...args) {
			      this.$emit('popstate', ...args)
			    }
			  }
			})

		>> router-view 实现：
			`
				<template>
	  			<component :is="routeView" />
				</template>
			`	
			import utils from '~/utils.js'
			export default {
			  data () {
			    return {
			      routeView: null
			    }
			  },
			  created () {
			    this.boundPopState = this.onPopState.bind(this)
			  },
			  beforeMount () {
			    this.$root.$on('popstate', this.boundPopState)
			  },
			  beforeDestroy() {
			    this.$root.$off('popstate', this.boundPopState)
			  },
			  methods: {
			    onPopState (e) {
			      const path = utils.extractUrlPath(window.location.href)
			      this.routeView = this.$root.$routes[path] || null
			      console.log('[Vue] popstate:', path)
			    }
			  }
			}

		>> router-link 实现
			`
				<template>
  				<a @click.prevent="onClick" href=''><slot></slot></a>
				</template>
			`	
			export default {
			  props: {
			    to: String
			  },
			  methods: {
			    onClick () {
			      history.pushState(null, '', this.to)
			      this.$root.$emit('popstate')
			    }
			  }
			}
