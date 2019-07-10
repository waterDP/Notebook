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