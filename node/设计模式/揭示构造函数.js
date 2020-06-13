/*只读事件触发器*/
/*
	我们使用提示构造器模式构建一个只读事件触发器，这一种特殊的事件触发器，它无法调用emit方法（除非在传递给构造函数的函数内部）
 */
const EventEmitter = require('events').EventEmitter;

module.exports = class Roee extends EventEmitter {
	constructor(executor) {
		super();
		const emit = this.emit.bind(this);
		this.emit = undefined;
		executor(emit);
	}
}

/*
	在这个简单的类中，扩展了Node.js核心的EventEmitter类，并且接受一个执行器函数作为唯一的构造函数的参数。
	在构造函数内部，调用super方法来确保通过调用父类构造函数来正确初始化事件发射器，然后保存了一个emit函数的备份并且通过赋undefined值来将它从对象实例中移除。
	最后调用执行器并将备份的emit方法作为参数传递进去。
	需要理解的重要一点是，在将emit方法赋值为undefined之后，代码将无法再调用这个方法。备份的emit方法被定义成一个局部变量，只是被传递给了执行器函数。使用这样的方式为保证我们只能在执行器函数中使用emit方法。
 */
const Roee = require('./Roee');
const ticker = new Roee(emit => {
	let tickCount = 0;
	setInterval(() => emit('tick', tickCount++), 1000);
});

module.exports = ticker;

