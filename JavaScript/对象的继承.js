 // todo 1.原型链
 // ! A => B  B.prototype = new A()
// 	实现原型链有一种基本模式，其代码大致如下：
	function SuperType() {
		this.property = true
	}

	SuperType.prototype.getSuperValue = function() {
		return this.property
	}

	function SubType() {
		this.subproperty = false
	}

	// 继承了SuperType
	SubType.prototype = new SuperType()

	SubType.prototype.getSubValue = function() {
		return this.subproperty
	}

	let instance = new SubType()
	alert(instance.getSuperValue()) // true

	// >确定原型和实例的关系
	// 可以通过两种方式来确定原型与实例之间的关系。

	// (1)第一种方式是使用instanceof操作符，只要用这个操作符来测试实例与原型链中出现过的构造函数，结果就会返回true。

	alert(instance instanceof Object)     // true
	alert(instance instanceof SuperType)  // true
	alert(instance instanceof SubType)    // true

	// (2)第二种方式是使用 isPrototypeOf() 方法。同样，只要是原型链中出现过的原型，都可以说是该原型链所派生的实例原型，因此 
	// isPrototypeOf() 方法也会返回true。

	alert(Object.prototype.isPrototypeOf(instance))     // true
	alert(SuperType.prototype.isPrototypeOf(instance))   // true
	alert(SubType.prototype.isPrototypeOf(instance))    // true

// todo 2.借用构造函数
// ! A => B  function B() {A.call(this)}
	function SuperType() {
		this.colors = ['red', 'blue', 'green']
	}

	function SubType() {
		// 继承了SuperType
		SuperType.call(this)
	}

	let instance1 = new SubType()
	instance1.colors.push('black')
	alert(instance1.color) // 'red, blue, green, black'

	let instance2 = new SubType();
	alert(instance2.colors);  // 'red, blue, green'

	// 通过使用 call()方法 （或 apply() 方法也可以），我们实际上是在（未来将要）新创建的Super实例的环境下调用了SuperType构造函数。
	// 这样一来，就会在新SubType对象上执行 SuperType() 函数中定义的所有对象初始化代码。结果，SubType的每个对象就都会具有自已的colors
	// 属性的副本了。

	// > 传递参数
	//? 相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。

	function SuperType(name) {
		this.name = name
	}

	function SubType() {
		//继承了SuperType, 同时还传递了参数
		SuperType.call(this, 'Nicholas')

		//实例属性
		this.age = 29
	}

	let instance = new SubType()

	alert(instance.name) // 'Nicholas'
	alert(instance.age)  // 29 

	// 以上代码中的SubType只接受一个参数name，该参数会直接赋值给一个属性。在SubType构造函数内部调用SuperType构造函数时，实际上是为
	// SubType的实例设置了name	属性。为了确保SuperType构造函数不会重写子类型的属性，可以在调用超类构造函数后，再添加应该在子类型中
	// 定义的属性。

	// > 借用构造函数的问题
	// 如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题--方法都在构造函数中定义，因此函数复用就无从谈起了。而且，在超
	// 类型的原型中定义方法，对子类而言也是不可见的，结果所有类型都只能使用构造函数模式。

// todo 3.组合继承
// ! A => B function B() {A.call(this, property)} B.prototype = new A()
	// 组合继承，有时候也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承方式。其背后的思路
	// 是使用原型链对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又
	// 能够保证实例都有它自己的属性。

	function SuperType(name) {
		this.name = name
		this.colors = ['red', 'blue', 'green']
	} 	

	SuperType.prototype.sayName = function() {
		alert(this.name)
	}

	function SubType(name, age) {

		// 继承属性
		SuperType.call(this, name)

		this.age = age
	} 

	// 继承方法
	SubType.prototype = new SuperType()

// todo 4.原型式继承	
// ! a => b function extend(a) {function F() {}; F.prototype = a; return new F()}
	function object(o) {
		function F() {}
		F.prototype = o
		return new F()
	}

	// 在 object() 函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个
	// 新实例。从本质上讲，object()对传入其中的对象执行了一次浅复制；

	let person = {
		name: 'Nocholas',
		friends: ['Shelby', 'Court', 'Van']
	}

	let anotherPerson = object(person)
	anotherPerson.name = 'Greg'
	anotherPerson.friends.push('Rob')

	let yetAnotherPerson = object(person)
	yetAnotherPerson.name = 'Linda'
	yetAnotherPerson.friends.push('Barbie')

	alert(person.friends) //'Shelby,Court,Van,Rob,Barbie'

	// ECMAScript5通过新接增Object.create()方法规范了原型式继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个
	// 为新对象定义的额外属性的对象。在传入一个参数的情况下Object.create()与 object()  方法的行为相同。

	let person = {
		name: 'Nicholas',
		friends: ['Shelby', 'Court', 'Van']
	}

	let anotherPerson = Object.create(person)
	anotherPerson.name = 'Grag'
	anotherPerson.friends.push('Rob')

	let yetAnotherPerson = Object.create(person)
	yetAnthorPerson.name = 'Linkda'
	yetAnthorPerson.friends.push('Barbie')

	alert(person.friends)  // 'Shelby, Court, Van, Rob, Barbie'

	// Object.create()方法的第二个参数与Object.defineProperties()方的第二个参数格式相同：每个属性都是通过自己的描述符定义的。
	// 以这种方式指定的任何属性都会覆盖原型对象上的同名属性。

	let person = {
		name: 'Nicholas',
		friends: ['Shelby', 'Court', 'Van']
	}

	let anotherPerson = Object.create(person, {
		name: {
			value: 'Greg'
		}
	})

// todo 5.寄生式继承

	function createAnother(original) {
		let clone = object(original)    // 通过调用函数来创建一个新对象
		clone.sayHi = function() {      // 以某种方式增强这个对象
			alert('hi')
		}

		return clone                // 返回这个对象
	}

	// 在这个例子中，createAnother()函数接收一个参数，也就是将要作为新对象基础的对象。然后，把这个对象（origin）传递给 object() 
	// 函数，将返回的结果赋值给clone。再为clone对象添加一个新方法 sayHi()，最后返回clone对象。可以像下面这样使用createAnother函数。

	let person = {
		name: 'Nicholas',
		friends: ['Shelby', 'Court', 'Van']
	}

	let anotherPerson = createAnother(person)
	anotherPerson.sayHi()

	// 这个例子中的代码基于person返回了一个新对象--anotherPerson。新对象不仅具有person的所有属性和方法，而且还有自己的 sayHi() 方法。

	// 在主要考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。前面示范继承式时使用的 object() 函数不是必需
	// 的；任何能够返回新对象的函数都适用于此模式。

	// 使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率；这一点与构造函数模式类似。 

// todo 6.寄生组合继承

	// 组合式继承是JavaScript最常用的继承方式；不过，它也有自己的不足。组合继承最大的问题就是无论什么情况下，都会调用两次超类型的构
	// 造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。没错，子类型最终会包含超类型对象的全部实例属性，但我们不
	// 得不在调用子类型构造函数时重写这些属性。再来看一看下面组合继承的例子。

	function SuperType(name) {
		this.name = name;
		this.colors = ['red', 'blue', 'green']
	}

	SuperType.prototype.sayName = function() {
		alert(this.name);
	}

	function SubType(name, age) {
		SuperType.call(this, name)  //第二次调用SuperType()

		this.age = age
	}

	SubType.prototype = new SuperType()  //第一次调用SuperType()
	SubType.prototype.constructor = SubType
	SubType.prototype.sayAge = function() {
		alert(this.age)
	};

	// 所谓寄生组合继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。其背后的基本思路是：不必为了指定子类型的原型
	// 而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。本质上，就是使用寄生继承来继承超类型的原型，然后再将结
	// 果指定给子类型的原型。寄生组合式继承的基本模式如下所示：

	function inheritPrototype(Sub, Sup) {
		let prototype = object(Sup.prototype)   // 创建对象
		prototype.constructor = Sub               // 增强对象
		Sub.prototype = prototype                // 指定对象
	}

	function object(o) {
		function F() {}
		F.prototype = o
		return new F()
	}

	// 这个示例中的 inheritPrototype() 函数实现了寄生组合式继承的最简单的形式。这个函数接收两个参数，子类型构造函数和超类型构造函
	// 数。在数内部，第一步是创建超类型原型的一个副本。第二步是为创建的副本添加constructor属性，从而弥补因重写原型面失去默认的
	// constructor属性。最后一步，将新创建的对象（即副本）赋值给子类型的原型。这样，我们就可以调用 inheritPrototype() 函数的语句，
	// 去替换前面例子中为子类型赋值的语句了。

	function SuperTypename() {
		this.name = name
		this.colors = ['red', 'blue', 'green']
	}

	SuperType.prototype.sayName = function() {
		alert(this.name)
	}

	function SubType(name, age) {
		SuperType.call(this, name)

		this.age = age
	}

	inheritPrototype(SubType, SuperType)

	SubType.prototype.sayAge = function() {
		alert(this.age)
	}