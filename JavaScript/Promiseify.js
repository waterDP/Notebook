/*什么是promise*/
/*简单来说，promise是一个抽象，允许函数返加一个名为promise的对象来表示操作异步操作的最终结果。在promise术语中，我们会说，当异步操作尚未完成时，一个promise是pending(预备态)，当操作成功完成时，它是fulfilled(成功态)，当操作因错误终止时它是rejected(拒绝态)。。一旦promise被履行或被拒绝，我们认为它是settled（完成态）*/

/*Node 风格的函数promise化*/
module.exports.promisify = function(callbackBaseApi) {
	return function promisified() {
		const args = [].slice.call(arguments);
		return new Promise((resolve, reject) => {
			args.push((err, result) => {
				if (err) {
					return reject(err);
				}
				if (arguments.length <= 2) {
					resolve(result);
				} else {
					resolve([].slice.call(arguments, 1));
				}
			});
			callbackBaseApi.apply(null, args);
		});
	}
}


/*应用*/
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);

stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});

/*或者，使用async function获得等效的效果:*/
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}

const readFile = util.promisify(fs.readFile);

readFile('./router').then((data) => {}, err => {});


=> 实现一个基本的Promise
const Promise = (function () {
	function Promise(executor) {
		if (executor && typeof executor !== 'function') {  // resolver必须是函数
			throw new TypeError('Promise executor' + executor + ' is a function')
		}

		if (!(this instanceof Promise)) return new Promise(executor);

		const self = this; // 保存this
		self.callbacks = []; // 保存onResolve和onReject函数的集合
		self.status = 'pending'; // 当前状态
		self.data = undefined; // 数据

		function resolve(value) {
			setTimeout(function() { // 异步调用
				if (self.status !== 'pending') {
					return;
				}
				self.status = 'resolved'; // 修改状态
				self.data = value;

				for (let i = 0; i < self.callbacks.length; i++) {
					self.callbacks[i].onResolved(value);
				}
			}); 
		} 

		function reject(reason) {
			setTimeout(function() { // 异步调用
				if (self.status !== 'pending') {
					return;
				}
				self.status = 'rejected'; // 修改状态
				self.data = reason;

				for (let i = 0; i < self.callbacks.length; i++) {
					self.callbacks[i].onRejected(reason);
				}
			});
		}

		try {
			executor(resolve, reject); // 执行executor函数
		} catch(e) {
			reject(e);	
		}
	}

	function resolvePromise(promise, x, resolve, reject) {
		let then, thenCalledOrThrow = false;
		if (promise === x) {
			return reject(new TypeError('Chaining cycle delected for promise'));
		}

		if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
			try {
				then = x.then;
				if (typeof then === 'function') {
					then.call(x, function rs(y) {
						if (thenCalledOrThrow) return;
						thenCalledOrThrow = true;
						return resolvePromise(promise, y, resolve, rejected);
					}, function rj(r) {
						if (thenCalledOrThrow) return;
						thenCalledOrThrow = true;
						return rejected(r);
					});
				} else {
					return resolve(x);                 
				}
			} catch(e) {
				if (thenCalledOrThrow) return;
				thenCalledOrThrow = true;
				return rejected(e);
			}
		} else {
			return resolve(x);
		}
	}

	Promise.prototype.then = function(onResolved, onRejected) {
		// 健壮处理，处理点击穿透
		onResolved = typeof onResolved === 'function' ? onResolved : v => v;
		onRejected = typeof onRejected === 'function' ? onRejected : e => throw e;
		const self = this;
		let promise2;

		// promise 状态为resolved
		if (self.status === 'resolved') {
			return promise2 = new Promise(function (resolve, reject) {
				setTimeout(function() {
					try {
						// 调用then方法的onResolved回调
						const x = onResolved(self.data);
						// 根据x的值修改promise2的状态
						resolvePromise(promise2, x, resolve, reject);
					} catch(e) {
						// promise2状态变为rejected
						return reject(e);
					}
				})
			})
		} 

		// promise状态为rejected
		if (self.status === 'rejected') {
			return promise2 = new Promise(function(resolve, reject) {
				setTimeout(function() {
					try {
						//调用then方法的onReject回调
            const x = onRejected(self.data)
						//根据x的值修改promise2的状态
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            //promise2状态变为rejected
            return reject(e)
          }
        })
      })
		}

		// promise状态为pending
		// 需要等待promise的状态改变
		if (self.status === 'pending') {
			return promise2 = new Promise(function(resolve, rejected) {
				self.callbacks.push({
					onResolved(value) {
						try {
							// 调用then方法的onResolved回调
							let x = onResolved(value);
							// 根据x的值修改promise2的状态
							resolvePromise(promise2, x, resolve, reject);
						} catch(e) {
							// promise2状态变为rejected;
							return rejected(e);
						}
					},
					onRejected(reason) {
						try {
							// 调用then方法的onResolved回调
							let x = onRejected(reason);
							// 根据x的值修改prommise2的状态
							resolvePromise(promise2, x, resolve, reject);
						} catch(e) {
							// promise2状态变为rejected
							return reject(e);
						}
					}
				})
			})
		}
	}

	// 获取当前Promise传递的值
	Promise.prototype.valueOf = function () {
		return this.data;
	}

	// finally方法
	Promise.prototype.finally = function (fn) {
		return this.then(function (v) {
			setTimeout(fn);
			return v;
		}, function (r) {
			setTimeout(r);
			return v;
		})
	}

	Promise.prototype.spread = function (fn, onRejected) {
		return this.then(function(values) {
			return fn.aplly(null, values);
		}, onRejected);
	}

	Promise.prototype.inject = function(fn, onRejected) {
		return this.then(function(v) {
			return fn.apply(null, fn.toString().match(/\((.*?)\)/)[1].split(','))
				.map(key => v[key])
		}, onRejected);
	}

	Promise.prototype.delay = function(duration) {
		return this.then(function(value) {
			return new Promise((resolve, reject) => {
				setTimeout(function() {
					resolve(value)
				}, duration)
			})
		}, function(reason) {
			return new Promise((resolve, reject) => {
				setTimeout(function() {
					reject(reason);
				}, duration);
			})
		})
	}

	Promise.all = function(promises) {
		return new Promise(function(resolve, reject) {
			let resolveCounter = 0;
			let promiseNum = promises.length;
			let resolveValues = new Array(promiseNum);
			for (let i = 0; i < promiseNum; i++) {
				Promise.resolve(promises[i]).then(value => {
					resolveCounter++;
					resolveValues[i] = value;
					if (resolveCounter === promiseNum) {
						return resolve(resolveValues);
					}
				}, reason => {
					return reject(reason);
				});
			}
		})
	}

	Promise.race = function(promises) {
		return new Promise(function(resolve, reject) {
			for (let i = 0; i < promise.length; i++) {
				Promise.resolve(promises[i]).then(value => {
					return resolve(value);
				}, reason => reject(reason));
			}
		});
	}

	Promise.reject = function(reason) {
		return new Promise((resolve, reject) => {
			reject(reason);
		})
	}

	Promise.fcall = function(fn) {
		return Promise.resolve().then(fn);
	}

	Promise.done = Promise.stop = function() {
		return new Promise(function() { });
	}

	Promise.deferred = Promise.defer = function() {
		let dfd = {};
		dfd.promise = new Promise((resolve, reject) => {
			dfd.resolve = resolve;
			dfd.reject = reject;
		});
		return dfd;
	}

	try { // CommonJS Compliance
		module.exports = Promise;
	} catch(e) {}

	return Promise;
})();