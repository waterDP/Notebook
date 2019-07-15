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