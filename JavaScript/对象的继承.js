// todo 1.原型链
/** 
 * 缺点
 * 1. 引用类型的属性被实例共享了
 * 2. 创建子类的时候，不能向父类传参 
 */
function Parent() {}
function Child() {}
Child.prototype = new Parent()

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

// todo 2.借用构造函数(经典继承)
// 优点：相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数。
// 缺点：方法都在构造函数中定义，每次创建实例都会创建一遍方法 无法继承父类原型中的属性和方法
function Parent(name) {}
function Child(name) {
	Parent.call(this, name)
}

// todo 3.组合继承
// 缺点：调用用了两次父类的构造函数
function Parent() {}
function Child() {
	Parent.call(this)
}
Children.prototype = new Parent()
Children.prototype.constructor = Child

// todo 4.原型式继承(Object.create())
// 缺点：包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样
function createObject(o) {
	function F() {}
	F.prototype = o
	return new F()
}

// todo 5.寄生式继承
// 缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法
function createObject(o) {
	let clone = Object.create(o)
	clone.sayName = function() {}
	return clone
}

// todo 6.寄生组合继承 (最理想)
// 优点：1.高效率，只调用一次父类构造函数 2.原型链不变
function Parent() {}
function Child() {
	Parent.call(this)
}
let F = function() {}
F.prototype = Parent.prototype
Child.prototype = new F()