/*
	状态模式是策略模式的一种变形，其中的策略会根据上下文的状态而改变。由上节内容我们知道，策略的选择基于不同的变量（比如用户的选择、配置的参数或者提供的输入），一旦选择完成，策略在上下文剩下的生命周期中就保持不变。
	然而，在状态模式中，策略（这里也叫作状态）是动态的，在上下文的生命周期中是可变的，其允许根据内部的状态来使用不同的行为。
 */
/*实现一个基本的自动防故障套接字*/
/*
	现在我们应用刚刚学习的状态模式来完成一个具体的例子。我们构建一个客户端TCP套接字，当和服务端失去连接时也不会失效；相反，我们希望在服务端离线时，可以将要发送的套数据进行排队，当连接重新建立时能第一时间将其重新发送。我们希望在一个简单的监控系统中使用该套接字，其中一组机器定期向服务端发送资源利用率数据，如果接收这些数据的服务端停止服务，我们的套接字会继续工作，将要发送的数据在本地进行排除直到服务端重新启动。
 */
 /*下面我们先创建一个新的模块failsafeSocket.js，用来表示我们的上下文对象*/
const offlineState = require('./offlineState');
const onlineState = require('./onlineState');

/*
	FailsafeSocket类由三个主要部分组成
	1.构造函数初始化了不同的数据结构，包括在套接字的离线状态下用来保存数据并进行排队的队列。同时，也创建了一组状态，一个用于实现套接字离线状态的行为，另一个用于实现在线状态行为。
	2.changeState()方法用来完成状态的转换。它只是简单地更新currentState这个变量，并且在当前状态下调用activate()方法。
	3.send()方法是套接节的功能实现，当然，我们希望它根据offline或者online状态表现出不同的行为。正如我们所看到时的， 这个操作被委托给当前的状态对象。
 */
class FailsafeSocket {
	constructor(options) {
		this.options = options;
		this.queue = [];
		this.currentState = null;
		this.socket = null;
		this.states = {
			offline: new OfflineState(this),
			online: new OnlineState(this)
		};
		this.changeState('offline');
	}

	changeState(state) {
		console.log('Activating state:' + state);
		this.currentState = this.states[state];
		this.currentState.activate();
	}

	send(data) {
		this.currentState.send(data);
	}
}

module.exports = options => {
	return new FailsafeSocket(options);
}

/*现在我们来看这两个状态对象的实现*/

/**
 * [jot description]
 * @type {[type]}
 * 使用json-over-tcp以允许通过TCP发送JSON对象，而不是使用原始的TCP套接字。
 */
const jot = require('json-over-top');

module.exports = class OfflineState {
	constructor(failsafeSocket) {
		this.failsafeSocket = failsafeSocket;
	}

	/**
	 * [send description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 * send()方法只是用来将接收到的数据进行排队，这正是离线状态下需要实现的功能
	 */
	send(data) {
		this.failsafeSocket.queue.push(data);
	}

	/**
	 * [activate description]
	 * @return {[type]} [description]
	 * activate()方法尝试使用json-over-top来和服务器建立连接。如果操作失败了，它会在500ms之后重新尝试链接。它会持续尝试直到建立有效的连接，然后failsafeSocket的状态会被设置成online
	 */
	activate() {
		const retry = () => {
			setTimeout(() => this.activate(), 500);
		}

		this.failsafeSocket.socket = jot.connect(
			this.failsafeSocket.options,
			() => {
				this.failsafeSocket.socket.removeListener('error', retry);
				this.failsafeSocket.changeState('online');
			}
		);
		this.failsafeSocket;.socket.once('error', retry);
	}
}

/*接下来，创建onlineState.js模块，实现OnlineSate策略，代码如下*/
module.exports = class OnlineState {
	constructor() {
		this.failsafeSocket = failsafeSocket;
	}

	/**
	 * [send description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 * 在线状态下，send()方法直接将数据写入套接字
	 */
	send(data) {
		this.failsafeSocket.socket.write(data);
	}

	/**
	 * [activate description]
	 * @return {[type]} [description]
	 * activate()方法刷新套接字离线状态下排除的数据，并且开始监听任何错误事件，在套接字离线的时候，我们就会简单地做这样的处理。这种情况下，我们会把failsafeSocket的状态变成offline
	 */
	activate() {
		this.failsafeSocket.queue.forEach(data => {
			this.failsafeSocket.socket.write('data');
		});
		this.failsafeSocket.queue = [];

		this.failsafeSocket.socket.once('error', () => {
			this.failsafeSocket.changeState('offline');
		});
	}
}

/*服务端模块server.js的代码如下*/
const jot = require('json-over-tcp');
const server = jot.createServer(5000);
server.on('connection', socket => {
	socket.on('data', socket => {
		console.log('Client data', data);
	})
});
server.listen(5000, () => {console.log('Started')});

/*接下来是客户端的代码，这是我们真正感兴趣的*/
const createFailsafeSocket = require('./failsafeSocket');
const failsafeSocket = createFailsafeSocket({port: 5000});

setInterval(() => {
	failsafeSocket.send(process.memoryUsage());
}, 1000);