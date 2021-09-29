/*使用一个工厂方法来实现私有变量的封装*/
function createPerson(name) {
	const privateProperties = {};
	const person = {
		setName(name) {
			if (name) throw new Error('A person must have a name');
			privateProperties.name = name;
		},
		getName() {
			return privateProperties.name = name;
		}
	}
	person.setName(name);
	return person;
}

/*构建一个简单的代码分析器*/
/*
	现在，我们使用工厂模式完成一个完整的例子。创建一个简单的代码分析器对象，该对象需要以下属性
		.一个start()方法来启动分析过程。
		.一个end()方法结束分析过程并将处理的时间输出到控制台
 */
class Profiler {
	constructor(label) {
		this.label = label;
		this.lastTime = null;
	}
	start() {
		this.lastTime = process.hrtime();
	}
	end() {
		const diff = process.hrtime(this.lastTime);
		console.log(`Time "${this.label}" took ${diff[0]} seconds and ${diff[1]}nanoseconds`);
	}
}

/*
	这里的Profiler类并没有什么特殊功能，只是简单地使用默认的高精确度计时器方法，记录start()方法执行的时刻，计算出到end()方法执行间隔的时间，并将结果输出到控制台。现在，如果我们想在真实应用程序中使用这个分析器来计算不同条件下执行的时间，很容易就能想到生成大量的日志标准输出，特别是在生产环境。我们想做的也许是将分析的信息重写向到另一个源，比如说保存到数据库，或者应用程序在生产环境运行的时候，完全禁止分析器工作。很明显，如果我们通过new操作符直接实例化一个Profiler对象，需要在客户端代码或者Profiler对象中添加一些额外的逻辑，以便在不同的逻辑中切换。我们可以使用一个工厂方法来抽象Profiler对象的创建，根据应用程序运行在生产环境还是开发环境，决定返回一个完全工作的Profiler对象或者一个具有相同接口的模拟对象，但并没有具体的方法实现。
 */
module.exports = function(label) {
	if (process.env.NODE_ENV === 'development') {
		return new Profiler(label);
	} else if (process.env.NODE_ENV === 'production') {
		return {
			start() {},
			end() {}
		}
	} else {
		throw new Error('Must set NODE_ENV');
	}
}

/*可组合的工厂函数*/
/*
	当我们想要创建从多个源继承一些行为和属性的对象，却不想构建复杂的类结构时，可组合的工厂函数就派上用场了
	stampit 模块
 */
const stampit = require('stampit');
const character = stampit()
	.props({
		name: 'anonymous',
		lifePoints: 100,
		x: 0,
		y: 0
	});
/*
	在这个代码片段中，定义了charater工厂函数，可以用它来创建基础角色。每一个角色对象实例都拥有这些属性： name, lifePoints,x和y,并且这些属性的默认值分别是anonymous,100,0,0。使用stampit模块的props方法可以定义这些属性。
 */
const c = character();
c.name = 'John';
c.lifePonints = 0;
console.log(c);  

/*现在我们来定义mover的工厂函数*/
const mover = stampit()
	.methods({
		move(xIncr, yIncr) {
			this.x += xIncr;
			this.y += yIncr;
			console.log(`${this.name} moved to [${this.x}, ${this.y}]`);
		}
	});

const slasher = stampit()
	.methods({
		slash(direction) {
			console.log(`${this.name} slasher to the ${direction}`);
		}
	});	

const shooter = stampit()
	.props({
		bullets: 6
	})	
	.methods({
		shoot(direction) {
			if (this.bullets > 0) {
				--this.bullets;
				console.log(`${this.name} shoot to the ${direction}`);
			}
		}
	});

/*定义好这几个基本角色以后，开始组合这些工厂函数来构建新的更强大的更复杂的工厂函数*/
const runner = stampit.compose(character, mover);
const samurai = stampit.compose(character, mover, slasher);
const sniper = stampit.compose(character, shooter);
const gunslinger = stampit.compose(character, mover, shooter);
const westernSamurai = stampit.compose(gunsliner, samurai);

