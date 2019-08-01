/*
	代理模式
	代理(proxy)是一个用来控制对另一个对象（称为本体）访问的对象。它实现了与本体对象相同的接口，我们可以对两个对象进行随意的替换使用，事实上，这种设计模式还可被称作替代模式。代理对象可以拦截所有或者部分本来要对本体对象执行的操作，补充或者增强它们的行为。
	代理模式在某些场景下非常有用
	数据验证：代理对象在将输入传递给本体对象之前先进行校验
	安全性：代理对象会校验客户端是否被授权对本体对象执行操作，只有通过了校验，操作的请求才会被传递到本体对象。
	缓存：代理对象内部维护一个缓存系统，只有当需要使用的数据当前不在缓存中，才会将需要执行的操作传递到本体对象。
	延迟初始化：如果本体对象的创建是非常耗费时间和穴的，代理对象可以延迟其创建的时机，直到真正需要时。
	日志： 代理对象拦截调用方法和相关参数，并将它们记录下来。
	远程对象代理：代理对象可以为远程对象提供本地的对象，就像使用一个本地的对象。
 */
/*对象组合*/
/*
	组合指的是一个对象为了扩展其自身功能或者使用其他对象的功能，将另一个对象合并进来。对于代理模式来说，我们创建一个拥有和本体对象相同接口的新对象。并且对本体对象的引用以实例变量或者闭包变量被存放在代理内部。可以在客户端初始化时注入本体对象或者由代理对象来创建。
 */
function createProxy(subject) {
	const proto = Object.getPrototypeOf(subject);
	function Proxy(subject) {
		this.subject = subject;
	}
	Proxy.prototype = Object.create(proto);
	/*拦截hello方法*/
	Proxy.prototype.hello = function() {
		return this.subject.hello() + 'world';
	};
	// delegated method
	Proxy.prototype.goodbye = function() {
		return this.subject.goodbye.apply(this.subject, arguments);
	}

	return new Proxy(subject);
}

/*
	上面的代理对象可以使用对象字面量和工厂函数来实现
 */
function createProxy(subject) {
	return {
		// proxied method
		hello: () => (subject.hello() + 'world!'),
		// delegated method
		goodbye: () => (subject.goodbye.apply(subject, arguments))
	}
}

/*对象增强*/
/*
	对象增强也许是代理对象最实用的方法，通过替换本体对象的方式来实现代理
 */
function createProxy(subject) {
	const helloOrig = subject.hello;
	subject.hello = () => (helloOrig.call(this) + 'world');
	return subject;
}
/*当我们只是代理本体对象一个或者很少一些方法的时候，这无疑是最简单的方式，但是也有直接修改本体对象的缺点*/



/*创建日志记录的写入流*/
function createLoggingWritable(writableOrig) {
	const proto = Object.getPrototyepOf(writableOrig);

	function LogginWritable(writableOrig) {
		this.writableOrig = writableOrig;
	}

	LogginWritable.prototype = Object.create(proto);

	LogginWritable.prototype.write = function(chunk, encoding, callback) {
		if (!callback && typeof encoding === 'function') {
			callback = encoding;
			encoding = undefined;
		}
		console.log('Writing', chunk);
		return this.writableOrig.write(chunk, encoding, function() {
			console.log('finished writing', chunk);
			// todo: something
			callback && callback();
		});
	};

	LogginWritable.prototype.on = function() {
		return this.writableOrig.on.apply(this.writableOrig, arguments);
	}

	LogginWritable.prototype.end = function() {
		return this.writableOrig.end.apply(this.writableOrig, arguments);
	}

	return new LogginWritable(writableOrig);
}