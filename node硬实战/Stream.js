/*类型*/
/**
 * stream.Readable  _read(size)  用于在I/O上获取数据
 * stream.Writable  _write(chunk, encoding, callback) 用于在输出的目标写入数据
 * stream.Duplex   _read(size) _write(chunk, encoding, callback) 一个可读和可写的流，例如网络连接
 * stream.Transform _flush(size) _transform(chunk, encoding, callback) 一个会以某种方式修改数据的双工流，没有输入数据要匹配输出数据的限制 
 */

//... 内置流
  //> 一个使用的流的简间静态web服务器
  const http = require('http');
  const fs = require('fs');
 
  http.createServer((req, res) => {
 		fs.createReadStream(__dirname + '/index.html').pipe(res);
  }).listen(8080);

  传统写法
  const http = require('http');
  const fs = require('fs');

  http.createServer((req, res) => {
  	fs.readFile(__dirname + '/index.html', (err, data) => {
  		if (err) {
  			res.statusCode = 500;
  			res.end(String(err));
  		} else {
  			res.end(data);
  		}
  	})
  }).listen(8080);


 // > 使用gzip压缩的静态web服务器
  const http = require('http');
  const fs = require('fs');
  const zlib = require('zlib');

  http.createServer((req, res) => {
  	res.writeHead(200, {'content-encoding': 'gzip'});
  	fs.createReadStream(__dirname + '/index.html')
  		.pipe(zlib.createGzip())
  		.pipe(res);
  }).listen(8000);

  //... 流的错误处理
	//> 在流处理过程中捕获错误
	const fs = require('fs');
	const stream =  fs.createReadStream('not found');

	sream.on('error', err => {
		console.trace();
		console.error('Stack: '，err.stack);
		console.error('The error raised was: ', err);
	});


//... 第三方模块和流
	在Express中使用流
	const express = require('express');
	const app = express();

	app.get('', (req, res) => {
		res.send('hellow world');
	});

	app.listen(3000);

//	> 一个使用流的express应用
	const stream = require('stream');
	const util = require('util');
	const express = require('express');

	const app = express();

	util.inherits(StatStream, stream.Readalbe);

	function StatStream(limit) {
		stream.Readable.call(this);
		this.limit = limit;
	}	  

	StatStream.prototype._read = function(size) {
		if (this.limit === 0) {
			// Done
			this.push();
		} else {
			this.push(util.inspect(process.memoryUsage()));
			this.push('n');
			this.limit --;
		}
	}

	app.get('/', (req, res) {
		const statStream = new StatStream(10);
		statStream.pipe(res);
	});

	app.listen(3000);

//... 使用流基类
	//> 从stream.Readalbe基类继承
	const Readable = require('stream').Readable;

	function MyStream(options) {
		Readalbe.call(this, options);
	}

	MyStream.prototype = Object.create(Readable.prototype, {
		constructor: {value: MyStream}
	});

	/**
	 * @param: {Objecct} options
	 * highWaterMark: 停止读取底层数据源之前的内部缓冲数据的大小
	 * encoding: 触发缓冲数据自动编码。可能值包含utf8和ascii
	 * objectMode: 允许流是一个对象，而不是字节
	 */
	
	//> 实现一个可读流
	/**
	 * 当围绕一个所需要的底层数据而实现一个自定义stream.Readable类是很有用的。例如，我正在开发一个项目，客户端发
	 * 送了json文件，包含数百万行的数据。我决定写一个简单的stream.Readable类来读取一个缓冲区，当一个新行出现，
	 * 使用JSON.parse解析记录。
	 */
	const stream = require('stream');
	const util = require('util');
	const fs = require('fs');

	function JSONLineReader(source) {
		stream.Readable.call(this);
		this._source = source;
		this._foundLineEnd = false;
		this._buffer = '';

		source.on('readable', () => {
			this.read();
		});
	}

	util.inherits(JSONLineReader, stream.Readable);

	JSONLineReader.prototype._read = function(size) {
		let chunk, line, lineIndex, result;

		if (this._buffer.length === 0) {
			chunk = this._source.read();
			this.buffer += chunk;
		}

		lineIndex = this._buffer.indexOf('n');

		if (lineIndex !== -1) {
			line = this._buffer.slice(lineIndex + 1);
			if (line) {
				result = JSON.parse(line);
				this._buffer = this._buffer.slice(lineIndex + 1);
				this.emit('object', result);
				this.push(util.inpect(result));
			} else {
				this._buffer = this._buffer.slice(1);
			}
		}
	}

	const input = fs.createReadStream(__dirname + '/json-line.txt', {
		encoding: 'utf8'
	});

	const jsonLineReader = new JSONLineReader(input);

	jsonLineReader.on('object', obj => {
		console.log('pos:', obj.position, '-letter', obj.letter);
	});