/**
 * new 的过程包括以下四个阶段
 * 1.创建一个新对象
 * 2.这个新对象的__proto__属性指向原函数的prototype属性。（即继承原函数的原型）
 * 3.将这个新对象绑定到此函数的this上。
 * 4.返回新对象，如果这个函数没有返回其他对象
 */
/**
 * @param {function} Con 构造函数 
 * @param args传入构造函数的参数
 */
function create(Con, ...args) {
	// 创建空对象
	let obj = {};
	// 设置空对象的原型(链接对象的原型)
	obj._proto_ = Con.prototype;
	// 绑定this并执行构造函数（为对象设置属性）
	let result = Con.apply(obj, args);
	// 如果result没有其他选择的对象，就返回obj对象
	return result instanceof Object ? result : obj;
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

/**
 * js对象的两类属性
 * 数据属性
 * 	1.value 属性的值
 * 	2.writable 决定属性能否被赋值
 *  3.enumerable 决定for in 能否枚举该属性
 * 	4.configurable 决定该属性能否被删除或者改变特征值 
 * 访问器属性
 * 	1.getter 函数或undefined，在取属性时被调用
 *  2.setter 函数或undefined，在设置属性仁政时被调用
 *  3.emerable 决定for in 能否枚举该属性
 *  4.configurable 决定该属性能否被删除或者改变特征值
 */

// 属性的属性值我们可以通过Object.getOwnPropertyDescriptor
var o = { a: 1 };
o.b = 2;
//a和b皆为数据属性
Object.getOwnPropertyDescriptor(o,"a") // {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(o,"b") // {value: 2, writable: true, enumerable: true, configurable: true}