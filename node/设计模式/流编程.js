/*通过流实现Gzip*/
const fs = require('fs');
const zlib = require('zlib');
const file = process.argv[2];

fs.createReadStream(file)
	.pipe(zlib.createGzip())
	.pipe(fs.createWriteStream(file + '.gz'))
	.on('finish', () => console.log('File successfully compressed'));

/**
 * 现在让我们来考虑这样的情况，一个应用压缩一个文件并将其上传到远程的HTTP服务器，接着服务器会解压缩这个文件
 * 并将其上传到远程的HTTP服务器，接着服务器会解压这个文件并将文件保存到文件系统中。
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
		/**
 	 	* super(options)
 	 	* @params: {Object} options
 	 	* objectMode: {Boolean} 指定流以对象模式工作(true)
 	 	* highWaterMark: (默认为16KB) 用来控制背压的限制
 	 	* decodeStrings: (默认为true) 这允许将字符串传入_write()应运之前其被自动解码成二进制流。在对象模式中会忽略该配置项。
 	 	*/
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
 	
 	const tfs = new ToFileStream();

 	tfs.write({path: 'file1.txt', content: 'hello'});
 	tfs.end(() => console.log('All files created'));

/*双向流*/ 	
/**
 * 双向流指的是既可以读取又可以写入的流。当我们想要描述一个既是数据源双是数据目的的实体时，双向流就显得非常有用，比如网络
 * 套接字。双向流同是继承了stream.Readable和stream.Writable的方法，所以这对我们来说并不是全新的概念。
 * 这意味着我们既可以通过read()和write()方法读写数据，也可以同时监听readable和drain事件。
 * 想要创建特定的双向流，必须同时实现_read()和_write()方法，传递给Duplex()构造函数的options对象在内部会同时传递给可读
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

/*使用管道拼接流*/	

/**
 * 使用管道将两个流连接起来可以使数据自动传输到可写流中，所以没有必要再调用read()方法或者write()方法，
 * 最重要的是我们再也不用考虑背压的问题，管道会自动处理。
 */

 	const ReplaceStream = require('./replaceStream');
 	process.stdin
 		.pipe(new ReplaceStream(process.argv[2], process.argv[3])
 		.pipe(process.stdout);	

/*
	error事件不会在管道中自动传递。举个例子，看下面的代码片段
		stream1
			.pipe(stream2)
			.on('error', function() {});
	在上面这个管道中，只能捕捉到stream2产生的错误，即被添加了错误监听器的流。这意味着，如果想要捕捉任何stream1产生的错误，需要直接对其添加错误监听器。
 */ 		

/*使用流处理异步流程*/

	//> 顺序执行 
		const through = require('./through2');
		const fromArray = require('./from2-array');
		const fs = require('fs');

		console.log(fromArray);
		function concatFiles(destination, files, callback) {
			const destStream = fs.createWriteStream(destination);
			fromArray.obj(files)
				.pipe(through.obj((file, enc, done) => {
					const src = fs.createReadStream(file);
					src.pipe(destStream, {end: false});
					src.on('end', done);
				}))
				.on('finish', () => {
					destStream.end();
					callback();
				});
		}

		// module.exports = concatFiles
		// 
		concatFiles(process.argv[2], process.argv.slice(3), () => {
			console.log('Files Concatenated successfully');
		});

		// node concat allTogether.txt file1.txt file2.txt
		// 
	//> 无序并行执行
		const stream = require('stream');

		class ParallelStream extends stream.Transform {
			constructor(userTransform) {
				super({objectMode: true});
				this.userTransform = userTransform;
				this.running = 0;  // 救援队列
				this.terminateCallback = null;
			}

			_transform(chunk, enc, done) {
				this.running++;
				this.userTransform(
					chunk, 
					enc,
					this.push.bind(this),
					this._onComplete.bind(this)
				);
				done();
			}

			_flush(done) {
				if (this.running > 0) {
					this.terminateCallback = done;
				} else{
					done();
				}
			}

			_onComplete(err) {
				this.running--;
				if (err) {
					return this.emit('error', err);
				}
				if (this.running === 0) {
					this.terminateCallback && this.terminateCallback();
				}
 			}
		}
	/*
		分析：如你所见，构造函数会接受一个userTransform()函数作为参数，并将其保存到一个实例中，同时我们调用父类的构造函数。为了处理简单，默认开启了对象模式。

		接下来是_transform()方法。在该方法中，执行了userTranform()函数，并增加当前运行任务的数量，最终调用done()方法，表示当前变换过程的结束。触发并列进行另一个变换的关键就在于此，在调用done()方法之前我们不会等待userTransform()函数执行完成，而是在调用done()方法。换句语说，我们会为userTransform()函数提供一个特殊的回调函数this.onComplete(), 当userTransform()执行完毕时就会通知我们

		只有流终止时_flush()方法才会被调用，所以如果还有任务在运行中，只要不立即调用done(),就能延迟finish事件的触发，相反可以将done()函数赋值给this.terminateCallback任务完成后，该方法就会被调用。该方法会检查当前是否还有正在运行的任务，如果没有话，就调用this.terminateCallback()函数，结束整个流，并触发finish事件，该事件在_flush()方法中被延迟触发了。

		刚刚构建的ParallelStream类使我们可以轻松地创建一个变换流，并列执行其中的任务，但是有个需要注意的地方：该变化流无法保证它接收到任务的顺序。事实上，任何时刻异步操作都可以结束和摄像头数据，而不需要关心它是何时开始的。可以看到，这一特性对于二进制流并不适用，因为此时数据的顺序是至关重要的，但是该特性对于对象流来说却是非常有用的。
	 */	

	//> 实现一个URL状态监控应用
		/*
			我们想要构建一个简单的服务来监控一大组URL的状态。设想所有这些URL都存放一个单独的文件中，并使用换行的方式进行分隔。
		 */
		const fs = require('fs');
		const split = require('split');
		const request = require('request');
		const ParallelStream = require('./parallelStream');

		fs.createReadStream(process.argv[2])
			.pipe(split())
			.pipe(new ParallelStream((url, enc, push, done) => {
				if (!url) return done();
				request.head(url, (err, response) => {
					push(`${url}is${err ? 'down' : 'up'}\n`);
					done();
				});
			}))
			.pipe(fs.createWriteStream('result.txt'))
			.on('finish', () => console.log('All urls were checked'));

	//> 无序有限制的并行执行
	/*
		如果我们试着用checkUrls这个应用来对包含了成千上条URL的文件进行处理，肯定会遇到麻烦。应用程序会一次创建不可控数量的连接，并行发送大量的数据，这有可能会破坏应用程序的可靠性和整个系统的可用性。我们已经知道，控制负载和资源使用的方法就是限制任务的并发执行。
	 */		
	class LimitedParallelStream extends stream.Transform {
		/*
			新增了一个控制并发的变量concurrency作为传入参数，同时保存两个回调函数，一个在调用transform方法时会的执行(continueCallback)，另一个在调用flush()方法时会执行(terminateCallback)
		 */
		constructor(concurrency, userTransform) {
			super({objectMode: true});
			this.concurrency = concurrency;
			this.userTransform = userTransform;
			this.running = 0;
			this.terminateCallback = null;
			this.continueCallback = null;
		}

		/*
			此时在_transform()方法中，在调用done()方法和触发下一个处理流程之前需要检查是否还有空间的资源可以用于执行下一个任务。如果当前工作中的流总数已经达到了最大的限制，可以简单地将回调函数done()赋给continueCallback变量，当有任务执行完毕时该函数就会被调用。
		 */
		_transform(chunk, enc, done) {
			this.running++;
			this.userTransform(chunk, enc, this._onComplete.bind(this));
			if (this.running < this.concurrency) {
				done();
			} else {
				this.continueCallback = done;
			}
		}

		_onComplete(err) {
			this.running--;
			if (err) {
				return this.emit('error', err);
			}
			const tmpCallback = this.continueCallback;
			this.continueCallback = null;
			tmpCallback && tmpCallback();
			if (this.running === 0) {
				this.terminateCallback && this.terminateCallback();
			}
		}
		
	}

	//> 顺序并行执行
	/*
		之前创建的并列流可能会改变处理数据的顺序，但在有些使用场景下这是不可接受的，事实上有时候，我们需要保证处理数据的顺序完全一致。当然，这也是可以做到的，仍然可以使用并列流，只需要将每个任务处理的数据块进行排序，使其和接受数据时的顺序一致。
	 */
	const throughParallel = require('through2-parallel');
	fs.createReadStream(process.argv[2])
		.pipe(split())
		.pipe(throughParallel.obj({concurrency: 2}, (url, enc, done) => {
			// ...
		}))
		.pipe(fs.createWriteStream('resulte.txt'))
		.on('finish', () => console.log('All urls were checked'));

// 管道模式
	/*
		实现一个组合流
		 .一个用来压缩和加密数据
		 .一个用来解压和解密数据
	 */		
	const zlib = require('zlib');
	const crypto = require('crypto');
	const combine = require('multipipe');

	module.exports.compressAndEncrypt = password => {
		return combine(
			zlib.createGzip(),
			crypto.createCipher('aes192', password)
		);	
	}

	module.exports.decryAndDecompress = password => {
		return combine(
			crypto.createDecipher('aes192', password),
			zlib.createGunzip()
		);
	}

	/*
		可以将这些组合看作黑盒来使用，举个例子，我们创建一个小的应用程序对指定文件进行压缩和加密操作。
	 */
	const fs = require('fs');
	const compressAndEncryptStream = 
		require('./combinedStream').compressAndEncrypt;

	fs.createReadStream(process.argv[3])	
		.pipe(compressAndEncryptStream(process.argv[2]))
		.pipe(fs.createWriteStream(process.argv[3] + '.gz.enc'));

	/*
		可以进一步增加上面代码，基于我们之前创建的管理来构建组合流，这次我们并不会创建一个类似黑盒的组合流，仅仅实现聚合错误管道的功能。事实上，如我们之前多次提到的，下面的代码仅仅会捕获最后一个流发的错误。
	 */	
	fs.createReadStream(process.argv[3])
		.pipe(compressAndEncryptStream(process.argv[2]))
		.pipe(fs.createWriteStream(process.argv[3] + '.gz.enc')|)
		.on('error', err => {
			// Only error from the last stream
			console.log(err);
		});

	/*
		然而，将这此流都组合起来，我们可以优雅地解决这个问题。
	 */	
	const combine = require('multipipe');
	const fs = require('fs');
	const compressAndEncryptStream =
		require('./combinedStream').compressAndEncrypt;

	combine(
		fs.createReadStream(process.argv[3])
		.pipe(compressAndEncryptStream(process.argv[2]))
		.pipe(fs.createWriteStream(process.argv[3] + '.gz.enc'))
	).on('error', err => {
		// this error may come from any stream in the pipeline
		console.log(err);
	});