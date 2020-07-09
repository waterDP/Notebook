/**
 * new 的过程包括以下四个阶段
 * 1.创建一个新对象
 * 2.这个新对象的__proto__属性指向原函数的prototype属性。（即继承原函数的原型）
 * 3.将这个新对象绑定到此函数的this上。
 * 4.返回新对象，如果这个函数没有返回其他对象
 * ! let obj = {}; obj.__proto__ = Base.prototype; return Base.call(obj)
 */
/**
 * @param {function} Con 构造函数 
 * @param args传入构造函数的参数
 */
function create(Con, ...args) {
	// 创建空对象
	let obj = {}
	// 设置空对象的原型(链接对象的原型)
	obj.__proto__ = Con.prototype
	// 绑定this并执行构造函数（为对象设置属性）
	let result = Con.apply(obj, args)
	// 如果result没有其他选择的对象，就返回obj对象
	return result instanceof Object ? result : obj
}

// 构造函数
function Test(name, age) {
	this.name = name;
	this.age = age;
}

Test.prototype.sayName = function () {
	console.log(this.name);
}

// 实现一个new 操作符
const a = create(Test, 'xiz', 23);
console.log(a.age);

/**
 * Object.create(proto, [propertiesObject])
 * proto: 新创建对象的原型对象
 * properticesObject: (可选)可为创建的新对象设置属性和值
 */
let People = function (name) {
	this.name = name;
}

People.prototype.sayName = function () {
	console.log(this.name);
}

function Person(name, age) {
	this.age = age;
	People.call(this, name); // 使用call，实现了People属性的继承
}

// 使用Object.create()方法，实现People原型方法的继承，并且修改了constructor指向
Person.prototype = Object.create(People.prototype, {
	constructor: {
		configurable: true,
		enumerable: true,
		value: Person,
		writable: true
	}
});

Person.prototype.sayName = function() {
	console.log(this.age);
}

let p1  = new Person('person1', 25);
p1.sayName(); // 'person1'
// p1.sayAge(); // 25 

function mockNew() {
	let Constructor = [].shift.call(arguments)
	let obj = {}  // 返回的结果
	obj.__proto__ = Constructor.prototype
	let r = Constructor.apply(obj, arguments)
	return r instanceof Object ? r : obj
}
