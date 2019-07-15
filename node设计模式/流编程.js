/*通过流实现Gzip*/
const fs = require('fs');
const zlib = require('zlib');
const file = process.argz[2];

fs.createReadStream(file)
	.pipe(zlib.createGzip())
	.pipe(fs.createWriteStream(file + '.gz'))
	.on('finish', () => console.log('File successfully compressed'));

/**
 * 现在让我们来考虑这样的情况，一个应用压缩一个文件并将其上传到远程的HTTP服务器，接着服务器会解压缩这个文件
 * 并将其上传到时远程的HTTP服务器，接着服务器会解压这个文件并将文件保存到文件系统中。
 * 如果你在客户端使用缓存的方式实现，只有在整个文件被读取并压缩之后才会开始上传操作。
 * 同时，服务器端只有接收到所有数据之后才能开始解压文件。使用流来实现这个功能应该是一个更好的方式。
 * 在客户端，一旦从文件系统读取到数据块，流允许你立即进行压缩和发送这些数据块，
 * 而同时，在服务器上你也可以立即解压缩从远程收到的每个数据块。
 */
/*gzipReceive.js 服务器端*/
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');

const server = http.createServer((req, res) => {
	const filename = req.headers.filename;
	console.log('File request received: ' + filename);
	req.pipe(zlib.createGunzip())
		.pipe(fs.createWriteStream(filename))
		.on('finish', () => {
			res.writeHead(201, {'Content-Type': 'text/plain'});
			res.end('That\'s it\n');
			console.log(`File Saved: ${filename}`);
		});
});

/*gzipSend.js 客户端*/
const fs = require('fs');
const zlib = require('zlib');
const http = require('http');
const path = require('path');
const file = process.argv[2];
const server = process.argv[3];
const options = {
	hostname: server,
	port: 3000,
	path: '/',
	method: 'PUT',
	headers: {
		filename: path.basename(file),
		'Content-Type': 'application/octet-stream',
		'Content-Encoding': 'gzip'
	}
}

const req = http.request(options, res => {
	console.log('Server response:' + res.statusCode);
}); 

fs.createReadStream(file)
	.pipe(zlib.createGzip())
	.pipe(req)
	.on('finish', () => {
		console.log('File successfully sent');
	});

/*流的分类*/
 stream.Readable
 stream.Writable
 stream.Duplex
 stream.Transform

/*实现可写流*/ 
	const stream = require('stream');
	const Chance = require('chance'); // 一个用来生成各种随机值的模块
	const chance = new Chance();

	class RandomStream extends stream.Readable {
		constructor(options) {
			super(options)
		}

		_read(size) {
			const chunk = chance.string(); // 该方法使用string来生成随机的字符串
			console.log(`Pushing chunk of size: ${chunk.length}`);
			this.push(chunk, 'utf8'); // 将生成的字符串推送到时内部缓存中，在推送字符串的同时，也指定了编码格式
			if (chance.bool({likelihood: 5})) { // 流有5%的可能性会随机终止，通过推送null到内部缓存中来表示文件终止，或者说流的终止
				this.push(null);
			}
		}
	}

	module.exports = RandomStream;

	/*使用*/
	const RandomStream = require('./randomStream');
	const randomStream = new RandomStream();

	randomStream.on('readable', () => {
		let chunk;
		while ((chunk = randomStream.read()) !== null) {
			console.log(`Chunk received: ${chunk.toString()}`);
		}
	});

/*可写流*/	
/**
 * 向可写流写入数据是非常简单的，只需要调用write()方法，该方法的签名如下
 * writable.write(chunk, [encoding], [callback])
 * encoding参数是可选的，当数据块是string时可以指定该参数(默认为utf8, 当数据块为Buffer时会被忽略),
 * 而当数据完全被写入时，callback函数会被调用，该函数也是可选的
 * 如果不再将更多数据写入流中，需要使用end()方法
 * writalbe.end([chunk], [encoding], [callback]);
 * 可以通过end()方法写入最后的数据块，这时的callback函数相当于为finish事件注册的监听器，当流中所有数据被清空时，
 * 该函数会被执行
 */
	 const Chance = require('chance');
	 const chance = new Chance();

	 require('http').createServer((req, res) => {
	 	res.writeHead(200, {'Content-Type': 'text/plain'});
	 	while (chance.bool({likelihook: 95})) {
	 		res.write(chance.string() + '\n');
	 	}

	 	res.end('\nThe end ... \n');
	 	res.on('finish', () => console.log('All data was sent'));
	 }).listen(8080, () => console.log('Listening on http://localhost: 8080'));


/*背压*/	 
/**
 * 和液体在真实的管道中流动一样，Node.js中的流动也可能遇到瓶颈，即将数据写入流的速度比从流中读取的速度快。
 * 处理该问题的机制是缓存写入的数据，然而如果流不对数据写入者做出任何回应，则可能导致越来越多的数据聚积到内部缓存中，
 * 导致不必要的内存使用
 * 为了防止这种情况的发生，当内部缓存超过了hightWaterMark的限制时，writable.write()会返回false。
 * 可写流有hightWaterMark这个属性，当内部缓存超出限制后，write()方法会返回false
 * 告诉应用应该停止写数据的操作。当缓存被清空后，drain事件会被触发，通知应用现在已经安全，可以重新执行写操作。
 * 这一机制被称作背压
 */
 	const Chance = require('chance');
 	const chance = new Chance();

 	require('http').createServer((req, res) => {
 		res.writeHead(200, {'Content-Type': 'text/plain'});

 		function generateMore() {
 			while (chance.bool({likelihook: 95})) { 
 				let shouldContinue = res.write(chance.string({length: 16 * 1024 - 1}));
 				if (!shouldContinue) {
 					console.log('Backpressure');
 					return res.once('drain', generateMore);
 				}
 			}
 			res.end('\nThe end...n', () => console.log('All data was sent'))
 		}

 		generateMore();
 	}).listen(8080, () => console.log('Listening on http:// localhost:8080'));

/*实现可写流*/
	const stream = require('stream');
	const fs = require('fs');
	const path = require('path');
	const mkdirp = require('mkdirp');

	class ToFileStream extends stream.Writable {
		constructor() {
			super({objectMode: true})
		}

		_write(chunk, encoding, callback) {
			mkdirp(path.dirname(chunk.path), err => {
				if (err) {
					return callback(err);
				}
				fs.writeFile(chunk.path, chunk.content, callback);
			});
		}
 	}

 	module.exports = ToFileStream;

 	/**
 	 * super(options)
 	 * @params: {Object} options
 	 * objectMode: {Boolean} 指定流以对象模式工作(true)
 	 * highWaterMark: (默认为16KB) 用来控制背压的限制
 	 * decodeStrings: (默认为true) 这允许将字符串传入_write()应运之前其被自动解码成二进制流。在对象模式中会忽略该配置项。
 	 */
 	
 	const tfs = new ToFileStream();

 	tfs.write({path: 'file1.txt', content: 'hello'});
 	tfs.end(() => console.log('All files created'));

/*双向流*/ 	
/**
 * 双向流指的是既可以读取又可以写入的流。当我们想要描述一个既是数据源双是数据目的的实体时，双向流就显得非常有用，比如网络
 * 套接字。双向流同是继承了stream.Readable和stream.Writable的方法，所以这对我们来说并不是全新的概念。
 * 这意味着我们既可以通过read()和write()方法读写数据，也可以同时监听readable和drain事件。
 * 想要创建算定的双向流，必须同时实现_read()和_write()方法，传递给Duplex()构造函数的options对象在内部会同时传递给可读
 * 流和可写流的构造函数。配置项options和我们之前讨论的是一样的，只是添加了一个新选项allowHalfOpen(默认为true)，如果它被
 * 设置为false,只要读或者写的一部分终止，整个流都会终止。
 */

/*变换流*/
	const stream = require('stream');
	const util = require('util');

	class ReplaceStream extends stream.transform {
		constructor(searchString, replaceString) {
			super();
			this.searchString = searchString;
			this.replaceString = replaceString;
			this.tailPiece = '';
		}

		_transform(chunk, encoding, callback) {
			const pieces = (this.tailPiece + chunk).split(this.searchString);
			const lastPiece = pieces[pieces.length - 1];
			const tailPieceLen = this.searchString.length - 1;
			this.tailPiece = lastPiece.slice(-tailPieceLen);
			pieces[pieces.length - 1] = lastPiece.slice(0, -tailPieceLen);

			this.push(pieces.join(this.replaceString));
			callback();
		}

		_flush(callback) {
			this.push(this.tailPiece);
			callback();
		}
	}

	module.exports = ReplaceStream;