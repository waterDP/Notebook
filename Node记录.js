=>应用缓冲区、编码和解码二进制数据

	·创建缓冲区 
		let buf = new Buffer('Hello World!');

		如果缓冲区没有用具体内容初始化，则可以通过指定容量大小来创建缓冲区，以备将来容纳数据。可能通过指定长度创建新的缓冲区
		let buf = new Buffer(1024); //创建长度为1024字节的缓冲区

		可以通过查询缓冲区的length属性来获取其长度
		let buf = new Buffer(100);
		console.log(buf.length);

		复制缓冲区
		let buffer1 = new Buffer('this is the content of my buffer');
		let buffer2 = new Buffer(11);

		let target = 0, sourceStart = 8, sourceEnd = 19;

		buffer1.copy(buffer2, target, sourceStart, sourceEnd);

		缓冲区解码
		·缓冲区可以转换成一个UTF-8编码格式的字符串，如下所示：
		let str = buf.toString();

		·也可以将缓冲区转换成其他指定编码格式的字符串，例如，如果要将一个缓冲区转换成base64编码格式的字符串，可以这样写
		let str = buf.toString('base64');

=>使用事件发射器模式简化事件绑定

	let req = http.request(options, (res)=>{
		res.on('data', (data)=>{
			console.log("some  data from the response", data);
		});
		res.on('end', ()=>{
			console.log("response ended");
		})	
	});

	req.end();

	$ 事件发生器API
	任何实现了事件发生器的对象，都实现了如下所示的一组方法
	1. .addLinstener 或 .on : 为指定类型的事件添加事件监听器。
	2. .once : 为指定类型的事件绑定一个仅会被调用一次的事件监听器。
	3. .removeListener :  删除绑定到指定事件上的某个指定的事件监听器。
	4. .removeAllListeners : 删除绑定到指定事件上的所有事件监听器。

	.once方法的实现原理
	let EventEmitter = require('events').EventEmitter;

	EventEmitter.prototype.once = function(type, callback) {
		this.on(type, ()=>{
			this.removeListener(type, callback);
			callback();
		})
	}

	$ 创建事件发射器

	·从node事件发射器继承

	const util = require('util');
	const EventEmitter = require('events').EventEmitter;

	let MyClass = function () {

	}

	util.inherits(MyClass, EventEmitter);

	说明：util.inherits建立了一条原型链，使MyClass类实例能使用EventEmitter类的原型方法。

	·发射事件
	通过创建继承自EventEmitter的类，MyClass的类实例就可以发射事件了
	MyClass.prototype.someMethod = function() {
		this.emit('costom-event', 'argument1', 'argument2');
	}

	MyClass类实例的客户端可以监听'costom-event'事件

	let myInstance = new MyClass();

	myInstance.on('costom-event', (str1, str2)=> {
		//...
	});

	扩展事件发射器需要三步：
		1.创建类的构造器；
		2.继承事件发射器的行为；
		3.扩展这些行为；
	function Watcher(watchDir, processedDir) {
		this.watchDir = watchDir;
		this.processedDir = processedDir;
	}		

	接下来要添加继承事件发射器行为的代码：
	const events = require('events');
	const util = require('util');

	util.inherits(Watcher, events.EventEmitter);  // Watcher.prototype = new events.EventEmitter();

	扩展事件发射器功能
	const fs = require('fs');

	let watchDir = './watch';
	let processedDir = './done';

	Watch.prototype.watch = function() {
		fs.readdir(watchDir, (err, files) => {
			if (err) throw err;
			for (let index in files) {
				this.emit('process', files[index]);
			}
		});
	}

	Watch.prototype.start = function() {
		fs.watchFile(watchDir, () => {
			this.watch();
		});
	}

	定义好了Watcher对象，可以用下面的代码创建一个Watcher对象：
	let watcher = new Watcher(watchDir, processedDir);

	有了新创建的watcher对象，你可以用继承自事件发射器类on方法设定文件的处理逻辑：
	watch.on('process', (file) => {
		let watchFile = `${this.watchDir}/${file}`;
		let processedFile = `${this.processedDir}/${file.toLowerCase()}`

		fs.rename(watchFile, processedFile, (err) => {
			if (err) throw err;
		});
	});

	现在所有必要逻辑都已经就位了，可以用下面的这行代码启动对目录的监控：
	watch.start();

=>查询和读写文件
	
	·规范化路径
	let path = require('path');
	path.normalize('/foo/bar//baz/asdf/quux/..');
	// => '/foo/bar/baz/asdf/'

	·连接路径
	let path = require('path');
	path.join('/foo', 'bar', 'baz/asdf');
	// => '/foo/bar/baz/asdf/'
	如你所见，path.join()函数同时也对路径进行了规范化。

	·解析路径
	可以使用path.resolve()函数将多个路径解析为一个规范化的绝对路径，该函数的作用就好像是这些路径挨个进行cd操作，
	但与cd操作不同的是，这些路径可以是文件，并且可以不必实际存在--即它不会利用底层的文件系统来尝试判断路径是否
	存在，而只是对路径字符串进行处理。

	let path = require('path');
	path.resolve('/foo/bar', './baz');
	//=> /foo/bar/baz
	path.resolve('/foo/bar', '/tmp/file/');	
	//=> /tmp/FileReadStream(path, options);

	path.resolve() 返回的是一个绝对路径。
	如果解析的路径不是绝对路径，那么path.resolve()函数会将当前工作目录附加到解析结果的前面
	path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
	//如果当前的工作目录是/home/myself/node/,那么上面的语句将返回 
	//=> /home/myself/node/wwwroot/static_files/gif/image.gif
	
	$ path.dirname() 函数获取文件路径的目录部分，例如：
	let path = require('path');
	path.dirname('/foo/bar/baz/asdf/quux.txt');
	//=> /foo/bar/baz/asdf
	
	$ path.basename() 函数获取文件名，即文件路径的最后一个部分
	let path = require('path');
	path.basename('/foo/bar/baz/asdf/quux.html')
	//=>quux.html
	
	// 文件路径可能还包括一个扩展名，它通常是文件名中.字符（包含最后一个.字符）后面的那部分字符串
	// 可以将扩展名传递给path.basename函数，作为在第二个参数，以此在文件名中提取扩展名
	let path = require('path');
	path.basename('/foo/bar/baz/asdf/quux.html', '.html');
	//=> quux

	$ path.parse(path);
	path.parse()方法返回一个对象，对象的属性表示path元素。
	返回的对象有以下属性：
	1. dir 文件夹   除文件名的部分
		2. root 根文件 

	3. base 完整的文件名，包含文件名与后缀名
		4. name 文件名
		5. ext 后缀名（包括点号）

	$ path.exists(path, callback) 异步函数，判断当前路径是否存在
	let path = require('path');
	path.exists('/etc/password', (exists) => {
		console.log('exists', exists);
	});

	$ path.format(pathObject);

		pathObject <Object>
		dir <string>
			root <string>
		base <string>
			name <string>
			ext <string>
		返回: <string>
		path.format() 方法会从一个对象返回一个路径字符串。 与 path.parse() 相反。

		当 pathObject 提供的属性有组合时，有些属性的优先级比其他的高：

		如果提供了 pathObject.dir，则 pathObject.root 会被忽略
		如果提供了 pathObject.base 存在，则 pathObject.ext 和 pathObject.name 会被忽略

		path.format({
  		dir: 'C:\\path\\dir',
  		base: 'file.txt'
		});
		// 返回: 'C:\\path\\dir\\file.txt'

		$ path.isAbsolute(path)
		path.isAbsolute() 方法会判定 path 是否为一个绝对路径。
		如果给定的 path 是一个长度为零的字符串，则返回 false;

=>fs模块

	$ 查询文件的统计信息
	有时可能需要了解文件的一些特征，例如大小、创建时间或者权限，可以使用fs.stat()函数来查询文件或目录的元信息
	let fs = require('fs');

	fs.stat('/etc/password', (err, stats)=>{
		if(err) throw err;

		console.log(stats);
	}	
	
	stat实例中的函数

	1.stats.isFile() -- 如果是标准文件而不是目录、套接字、符号链接或都设备的话，返回true。
	2.stats.isDirectory() -- 如果目录，返回true。
	3.stats.isBlockDevice() -- 如果是块设备，返回true。
	4.stats.isCharacterDevice() -- 如果是字符设置，返回true。
	5.stats.isSymbolicLink() -- 如果是符号链接，返回true。
	6.stats.isFifo() -- 如果是FIFO，返回true。
	7.stats.isSocket() -- 如果UNIX套接字，返回true。

	fs.rename('/tmp/hello', '/tmp/world', (err)=>{
		if(err) throw err;
		fs.stat('/tmp/world', (err, stats) => {
			if(err) throw err;
			console.log(`文件属性：${JSON.stringify(stats)}`);
		})
	})

	$ fs.FSWatcher类
	从 fs.watch() 返回的对象是该类型。
	提供给 fs.watch() 的listener 回调会接收返回的FSWatcher的 change 事件。
	该对象本身可触发以下事件：
	1. change 事件
	
	@params
		~ eventType <string> fs变化的类型
		~ filename <string> | <Buffer>  变化的文件名（如果是相关的/可用的）

	2. error 事件 当错误发生时触发

=>读写数据流
	stream.pause(): 暂停流
	stream.resume(): 恢复流
	
	$ 创建文件系统流：

	->可读流
	let fs = require('fs');
	let rs = fs.createReadStream(path, options);

	=> options 是一个对象 
	·encoding--'data'事件发送的字符串的编码格式，如果想使用未经处理的缓冲区，该值为null。
	·fd--如果已经有了一个打开的文件描述符，则可以将其传入该选项，流会假定它的默认值为null。
	·bufferSize--要被读取的每个文件块的大小，单位为字节。默认为64KB。
	·start--文件中第一个被读取的字节位置，用来读取一定范围内的数据，而不是读取全部文件。
	·end--文件中最后一个被读取的字节位置，用来读取一定范围内的数据，而不是读取全部文件。

	->可写流
	let fs = require('fs');
	let ws = fs.createWriteStream(path, options);

	=> options 是一个对象
	·flags--选项包含用于打开文件的标志位，所以所有可被fs.open()函数接受的标志们均可用于此处。
	·mode--如果要创建文件的话，mode选项指定了打开文件的权限。
	·encoding--可以用encoding选项强制指定编码格式。

	&& 避免慢客户端问题
	let http = require('http');
	let fs = require('fs');

	http.createServer((req, res)=>{

		let rs = fs.createReadStream(path);

		rs.on('data', (data)=>{
			if(!res.write(data)){
				rs.pause();
			}
		});

		res.on('drain', ()=>{
			res.resume();
		});

		rs.on('end', ()=>{
			res.end();
		});

	}).listen(8080);

	=>应用stream.pipe()避免慢客户端问题与使用pipe集成可读流和可写流

		stream.pipe()命令是可读流接口的一部分--由传输源调用--并接受目标可写流作为其第一个参数
		如果在上面的例子中使用pipe命令，救命代码如下
		require('http').createServer((req, res)=>{
			let rs = fs.createReadStream(path);
			rs.pipe(res);
		}).listen(8080);

		默认情况下，end()会在可读流结束时，在可写流上被调用。为了避免这种情况，可以将 end:false 传入 pipe() 函数，作为其第二个参数，这个
		参数是option对象，如下所示：

		let http = require('http');
		let fs = require('fs');

		http.createServer((req, res)=>{
			let rs = fs.createReadStream(path);
			rs.pipe(res, {end: false});

			rs.on('end', ()=>{
				res.write("And that's all, folks!");
				res.end();
			});
		}).listen(8080);

=>构建TCP服务器
	
	创建TCP服务器
	let net = requrie('net');
	net.createServer((socket)=>{
		socket.on('data', (data)=>{
			//获取数据
		});

		socket.on('end', (data)=>{
			socket.write('Some string');
		});

		socket.write('Some string');
	}).listen(4001);

	.net Server发射以下事件
	- listening -- 当服务器在指定的端口和地址监听时。
	- connection -- 当有新的连接创建时。回调函数会接收对应的套接字对象，可以通过向net.createServer()函数传递一个回调函数
	绑定到该事件上，就像上面的例子中的那样。
	- close --当服务器被关闭时，即不再绑定到那个端口。
	- error --当在服务器层面出现错误时。例如当你尝试绑定一个已被占用的端口或者没有权限绑定的端口时，就会发生错误。

	let server = require('net').createServer();
	let port = 4001;

	server.on('listening', ()=>{
		console.log('Server is listening on port', port);
	});

	server.on('connection', (socket)=>{
		console.log('Server has a new connection');
		socket.end();
		server.close();
	});

	server.on('close', ()=>{
		console.log('Server is now closed');
	});

	server.on('error', (err)=>{
		console.log('Error occurred', err.message);
	});

	server.listen(port);

	当获取‘connection’事件时也获得了一个套接字对象作为回调函数的第一个参数，套接字对象既是可读流也是可写流，这意味着当它获得数据包时会
	发射‘data’事件，当连接关闭时，会发射‘end’事件。
	因为套接字对象也是一个可写流，这意味着可以应用 socket.write()函数向套接字写入缓冲区或者字符串。可以通过调用 socket.end() 函数告诉
	套接字当所有数据都被写入之后，应该终止连接。

	>>简单地重复TCP服务器
	const net = require('net');

	let server = net.createServer();

	server.listen(4001);

	server.on('connection', (socket) => {

		console.log('new connection');

		socket.setEncoding('utf8');

		socket.write('hello you can start typing. Type quit to exit. \n');

		socket.on('data', (data) => {
			console.log('got:', data.toString());

			if(data.trim().toLowerCase === 'quit') {
				socket.write('Bye bye!');
				return socket.end();
			}

			socket.write(data);
		});

		socket.on('end', () => {
			console.log('Client connection ended')
		});

	});

	>>>简单的TCP聊天服务器

	let net = require('net');
	let server = net.createServer();
	let sockets = [];

	server.on('connect', (socket)=>{
		console.log('got a new connection');

		sockets.push(socket);

		soket.on('data', (data)=>{
			console.log('got data: ', data);
			sockets.forEach((otherSocket)=>{
				if(otherSocket !== sokect) {
					otherSocket.write(data);
				}
			});
		});

		socket.on('close', ()=>{
			console.log('connect closed');

			let index = sockets.indexOf(socket);
			sockets.splice(index, 1);
		})

	});

	server.on('error', (err)=>{
		console.log('Server error:', err.message);
	});

	server.on('close', ()=>{
		console.log('Server closed')
	});

=>构建HTTP服务器
	
	const http = require('http');

	let server = http.createServer();

	server.on('request', (req, res)=>{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('Hello World');
		res.end();
	});

	server.listen(4000);


	>>req对象包含一些属性，这些属性包括url, method, headers:

	1.req.url：该属性包含一个字符串型形式的请求URL。它不包含模式、主机名或者端口，但包括URL中在上述内容之后的所有剩余部分。
	2.req.method：该属性包含在请求上用到的HTTP方法，例如，它有可能是POST, GET, DELETE或者PUT。
	3.req.headers：该属性包含一个对象，这个对象拥有请求所有的HTTP头。

	>>写入响应头
	为了写入响应头，可以使用 res.writeHead(status, headers) 函数，其中headers是一个可选参数，它是一个包含所有想要发送的响应头属性的对象

	require('http').createServer((req, res) => {
		res.writeHead(200, {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=3600'
		});

		res.end('Hello World!');
	}).listen(4000);

	>>修改或设置响应头

	通过下面的语句，可以修改已经设置的响应头或者设置一个新的响应头：
	res.setHeader(name, value);

	上面的语句只有在还没有用 res.write()或者res.end() 发送响应主体时才会起作用，如果已经在响应对象上使用了 res.writeHead()，上述语句也不会起作用，这是因为响应头已经被发送出去了。

	>>删除响应头

	通过调用 res.removeHeader并提供响应头名称，可以删除已设置的响应头：
	res.removeHeader('Cache-Control');

	再次提醒，上面的语句只会在响应头还未被发送出去时调用。

	res.statusCode属性：表示HTTP响应的状态码；在程序响应期间可以随时给这个属性赋值，只要是在第一次调用 res.write() 或 res.end() 之前。

	>>传送文件 

	const fs = require('fs');

	require('http').createServer((req, res) => {
		res.writeHead(200, {'Content-Type': 'video/mp4'});
		let rs = fs.createReadStream('test.mp4');
		rs.pipe(res);
	}).listen(4000);

	关闭服务器：server.close();

	[例 1]：构建提交静态文件的服务器
	在本例中将要构建一个提交静态文件的服务器，文件的路径是通过一个URL提供的：// http://localhost:4000/path/to/my/file.js

	const path = require('path'); 
	const	fs = require('fs');
  const http = require('http');

  let server = http.createServer();

  server.listen(4000);

  server.on('request', (req, res)=>{
  	let file = path.normalize('.' + req.url);
  	console.log('Trying to server', file);

  	function reportError(err) {
  		console.log(err);
  		res.writeHead(500);
  		res.end('Initernal Server Error');
  	}

  	path.exists(file, (exists)=>{
  		if(exists) {
  			fs.stat(file, (err, stat)=>{
  				let rs;

  				if(err) {
  					return reportError(err);
  				}

  				if(stat.isDirectory()) {
  					res.writeHead(403);
  					res.end('Forbidden');
  				} else {
  					rs = fs.createReadStream(file);

  					rs.on('error', reportError);

  					res.writeHead(200);

  					rs.pipe(res);
  				}
  			});
  		} else {
  			res.writeHead(404);
  			res.end('Not Found');
  		}
  	});

  });

  >>用 fs.stat() 实现先发缺人的错误处理
  let server = http.createServer((req, res) => {
  	let url = parse(req.url);
  	let path = join(root, url.pathname);

  	fs.stat(path, (err, stat) => {
  		if (err) {
  			if ('ENOENT' === err.code) {
  				res.statusCode = 404;
  				res.end('Not Found');
  			} else {
  				res.statusCode = 500;
  				res.end('Internal Server Error');
  			}
  		} else {
  			res.setHeader('Content-Type', stat.size);
  			let stream = fs.createReadStream(path);
  			stream.pipe(res);
  			stream.on('err', (err) => {
  				res.statusCode = 500;
  				res.end('Internal Server Error');
  			});
  		}
  	});
  });


=>创建HTTP请求

	>>创建GET请求
	const http = require('http');

	let options = {
		host: 'www.google.com',
		port: 80,
		path: '/index.html'
	}

	http.get(options, (res) => {
		console.log('Got response:' + res.statusCode);
	});

	>http.get是通用的http.request的快捷方式，其选项如下：
	1.host  想发送请求的主机名或者IP地址。
	2.port  远程服务器的TCP端口号。
	3.method  指定HTTP请求方法的字符串，其可能的值为GET（默认方法）, POST, PUT, DELETE, HEAD或者请求能够理解的其他方法。
	4.path   请求的路径，应该包括一个查询字符串和一个分隔符，例如，/index/?page=2
	5.headers  表示值-名称对的形式的请求头。

	http.request函数会返回一个http.ClientRequest对象，它是一个可写流，可以使用这个流发送数据，所发送的数据是请求主体数据的一部分，
	当完成向请求主体中写入数据时，要结束流来终止请求。

	下面的这个例子中将一些请求主体内容写到'http://my.server.com/upload'中：

	const http = require('http');

	let options = {
		host: 'www.google.com',
		port: 80,
		path: '/upload',
		method: 'POST'
	};

	let request = http.request(options, (res) => {
		console.log('STATUS', res.statusCode);
		console.log('HEADERS', res.headers);
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log('Body', chunk);
		});
	});

	request.write('This is a piece of data. \n');
	request.write('This is another piece of data. \n');
	request.end();

 	>>获取响应主体
 	响应主体并不会在请的response事件发生时出现，如果对响应主体感兴趣，就可以在response上注册"data"事件：
	http.request(option, (res)=>{
	 	res.setEncoding('utf8');

	 	res.on('data', (data)=>{
	 		console.log('I have a piece of the body here', data);
	 	})
  });

  >>以流的方式传送响应体
  HTTP响应是一个可读流，表示响应主体数据流。与任何可读流一样，可以将它传送到任意可写流，例如一个HTTP请求或者一个文件。例如，下面的
  例子展示了如何将响应主体传送到一个打开的文件：
  const http = require('http');
  const fs = require('fs');

  let option = {
  	host: 'www.google.com',
  	port: 80,
  	path: '/',
  	method: 'GET'
  };

  let file = fs.createWriteStream('/tmp/test.txt');

  http.request(options, (res) => {
  	res.pipe(file);
  }).end();

  >>>使用 HTTP.Agent维护套接字池
  
  在创建HTTP请求时，Node在内部使用了一个代理。代理是Node中的一个实体，该实体被用来为你创建请求，它负责维护一个活动套接字池，对指定
  的主机名和端口对，套接字池中包含已被打开但未被使用的连接。当出现新的HTTP请求时，代理要求连接保持活动状态。当请求结束，并且在套接
  字上没有额外的请求等待释放时，套接字就会被关闭。这意味着不必手动关闭HTTP客户端，并且TCP连接在Node负载较轻时易于重用。

  当创建了一个请求并选择了一个可用的套接字，或者为该请求创建了一个新的连接时，http.ClientRequest会发射socket事件。在请求之后，套接
  字会在发射close事件或agentRemove事件时从代理的套接字池中被删除。如果想让HTTP请求打开一段较长时间，可以将其从套接字池中删除，如下、
  所示：

  function handleResponseCallback(res) {
  	console.log('got response:', res);
  }

  let req = http.request(options, handleResponseCallback);

  req.on('socket', (socket) => {
  	socket.emit('agentRemove');
  });


  /*socket 案例*/
	  const http = require('http');
		const socketIo = require('socket.io');

		let server = http.createServer();
		let io = socketIo(server);
		let socket;

		server.on('request', (req, res) => {
		  let url = req.url;
		  if (url === '/restart') {
		    http.get('http://lumaops8.msxf.lotest/blaze/task/runBlazeJob');
		    setTimeout(() => {
		      socket.emit('data');
		      res.end();
		    }, 1000);
		  } else {
		    if(!socket) {
		      io.on('connection', (obj) => {
		        socket = obj;
		      });
		      res.end();
		    }
		  }
		});

		server.listen(4141);
		

>>串行化流程控制
	const fs = require('fs');
	const request = require('request');
	const htmlparser = require('htmlparser');

	let configFilename = './rss_feeds.txt';

	//任务1：确保包含RSS预订源URL的文件
	function checkForRSSFile() {
		fs.exists(configFilename, (exists) => {
			if(!exists) {
				return next(new Error(`Missing RSS file: ${configFilename}`));
			}
			next(null, configFilename);
		});
	};

	//任务2：读取并解析包含预订源URL的文件
	function readRSSFile(configFilename) {
		fs.readFile(configFilename, (err, feedList) => {
			if (err) return next(err);

			feedList = feedList.toString().trim().split('\n');
			let random = Math.floor(Math.random()*feedList.length);
			next(null, feedList); 
		});
	}

	//任务3：向选定的预订源发送HTTP请求以获取数据：
	function downloadRSSFeed(feedUrl) {
		request({uri: feedUrl}, (err, res, body) => {
			if (err) return next(err);
			if (res.statusCode !== 200) {
				return next(new Error('Abnormal response status code'));
			}
			next(null, body);
		});
	}

	//任务4：将预订数据源解析到一个条目数组中
	function parseRSSFeed(rss) {
		let handler = new htmlparser.RssHandler();
		let parser = new htmlparser.Parser(handler);

		parser.parseComplete(rss);

		if (!handler.dom.items.length) {
			return next(new Error('No RSS items found'));
		}

		let item = handler.dom.items.shift();
		console.log(item.title);
		console.log(item.link);
	}

	//把要做的任务按顺序添加到一个数组中
	let tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];

	//如果任务出错了，则抛出异常，否则执行下一个任务
	function next(err, result) {
		if (err) throw err;
		let currentTask = tasks.shift();
		if(currentTask) {
			currentTask(result);
		}
	}

	//开始任务的串行执行
	next();

	<模式>
		function iterate(index) {
			if (index === tasks.length) {
				return finish();
			}
			const task = task[index];
			task(function () {
				iterate(index + 1);
			});
		}

		function finish() {
			// iteration complated
		}

		iterate(0);

>>并行化流程控制
	const fs = require('fs');

	let complateTasks = 0;
	let tasks = [];
	let wordCounts = {};

	let filesDie = './text';

	function checkIfComplete() {
		complateTasks++;
		//当所有任务全部完成后，列出文件中用到的每个单词以及用了多少次
		if (complateTasks === tasks.length) {
			for (let index in wordCounts) {
				console.log(`${index}:${wordCounts[index]}`);
			}
		}
	}

	function countWordsInText(text) {
		let words = text.toString().toLowerCase().split(/\W+/).sort();
		for (let index in words) {
			let word = words[index];
			// 对文本中的单词计数
			if (word) {
				wordCounts[word] =
					wordCounts[word] ? wordCounts[word] + 1 : 1;
			}
		}
	}

	fs.readdir(filesDir, (err, files) => {
		if (err) throw err;

		for (let index in files) {
			let task = (function(file) {
				// 定义处理每个文件的任务，每个任务中都会调用一个异步读取文件的函数并对文件中使用单词计数
				return function () {
					fs.readFile(file, (err, text) => {
						if (err) throw err;
						countWordsInText(text);
						checkIfComplete();
					});
				}
			})(`${filesDir}/${files[index]}`);
			// 把所有任务都添加到函数调用数组中
			tasks.push(task);
		}

		// 开始并执行所有任务
		for (let task in tasks) {
			tasks[task]();
		}
	});

	<模式>
	const tasks = [/* ... */];
	let completed = 0;
	tasks.forEach(task => {
		task(() => {
			if (++completed === tasks.length) {
				finish();
			}
		});
	});

	function finish() {
		// all the task completed
	}

>>实现HTTP Basic认证的中间件组件
	function restrict(req, res, next) {
		let authorization = req.headers.authorization;

		if (!authorization) return next(new Error('Unauthorization'));

		let parts = authorization.split(' ');
		let scheme = parts[0];
		let auth = new Buffer(parts[1], 'base64').toString().split(':');
		let user = auth[0];
		let pass = auth[2];

		authenticateWithDatabase(user, pass, (err) => {
			if (err) return next(err);	
			next();
		});
	}	

>>创建可配置的中间件
	1.可配置的Connect中单件组件logger
	function setup(format) {
		let regexp = /:(\w+)/g;
		return function logger(req, res, next) {
			let str = format.replace(regexp, (match, property) => {
				return req[property];
			});

			console.log(str);
			next();	
		}
	}	

	module.exports = setup;

	/*use*/
	let logger = require('logger');
	let app = connet().use(logger(':method :url')).use(hello);

	2.构建路由中间件组件
	const connect = require('connet');
	const router = require('./middleware/router');

	let routes = {
		GET: {
			'/users': function(req, res) {
				res.end('tobi, loki, ferret');
			},
			'/user/:id': function(req, res, id) {
				res.end(`user ${id}`);
			}
		},
		DELETE: {
			'/user/:id': function(req, res, id) {
				res.end(`deleted user ${id}`);
			}
		}
	};

	connect()
		.use(router(routes))
		.listen(3000);

	/*简单的路由中间件*/	
	let parse = require('url').parse;
	module.exports = function route(obj) {
		return function(req, res, next) {
			if (!obj[req.method]) {
				next();
				return;
			}

			let routes = obj[req.method];
			let url = parse(req.url);
			let paths = Object.keys(routes);

			for (let i = 0; i < paths.length; i++) {
				let path = paths[i];
				let fn = routes[path];

				path = path
					.replace(/\//g, '\\/')
					.replace(/:(\w+)/g, '([^\\/]+)');

				let re = new RegExp(`^${path}$`);
				let captures = url.pathname.match(re);
				
				if (captures) {
					let args = [req, res].concat(captures.slice(1));
					fn.apply(null, args);
					return;
				}	
			}

			next();
		}
	};


>>构建一个重写URL的中间件组件
	下面这个小博客程序先用rewrite中间件组件基于缩略名重写URL，然后再将控制权转给showPost组件：
	const connect = require('connect');
	const url = require('url');

	let app = connect()
		.use(rewrite)
		.use(showPost)
		.listen(3000);

	基于缩略名重写请求URL的中间件：
	const path = url.parse(req.url).pathname;

	function rewrite(req, res,  next) {
		let match = path.match(/^\/blog\/posts\/(.+)/);
		if (match) {
			findPostIdSlug(match[1], (err, id) => {
				if (err) return next(err);
				if (!id) return next(new Error('User not found'));
				req.url = '/blog/posts'+id;
				next();
			});
		} else {
			next();
		}
	}	

=>Connect 自带的中间件
	>>cookieParser(): 解析HTTP cookie
	Connect的cookie解析支持常规cookie、签名cookie和特殊的JSON cookie。req.cookies默认用常规的未签名cookie组装而成的。如果你想使用 session()	中单件要求的签名cookie，在创建 cookieParser() 实例时，要传入一个加密用的字符串。
	
	【基本用法】
	const connect = require('connect');

	let app = connect().use(connect.cookieParser('tobi is a cool ferret'))
		.use((req, res) => {
			console.log(req.cookies);
			console.log(req.signedCookies);
			res.end('hello\n');
		})
		.listen(3000);
	设定以 req.cookies和 req.singedCookies属性上的对象是随请求头Cookie的解析结果。如果请求中没有cookie，这两个对象都是空的。
	
	【常规cookie】	
	如果你用 curl(1)向前面那个服务器发送不带Cookies请求头字段的HTTP请求，两个 console.log() 调用输出的都是空对象：
	http:// localhost:3000/
	现在试着了送一些cookie，你会看到这两个cookie都是 req.cookies的属性
	http:// localhost:3000/ -H 'Cookie: foo=bar, bar=baz'
	{foo: 'bar', bar: 'baz'}
	{}

	【设定出站cookie】
	cookieParser() 中间件没有提供任何通过Set-Cookie响应头向HTTP客户端写出站cookie的功能。但Connect可以通过res.setHeader()函数写入多个响应头。
	假定你想设定一个名为foo，值为字符串bar的cookie。调用res.setHeader()，connect让你用一行代码搞定。你还可以设定cookie的各种选项，比如有效期，像这里的第二个 setHeader()一样：
	const connect = require('connect');

	let app = connect();

	app.use((req, res) => {
		res.setHeader('Set-Cookie', 'foo=bar');
		res.setHeader('Set-Cookie', 'tobi=ferret;Expiress=Tue,08 Jun 2021 10:18:14 GMT');
		res.end();
	}).listen(3000);



>>> node js 硬实战
	<例子 1.1> 一个用于计数的可写流
		const Writable = require('stream').Writable;
		const util = require('util');

		module.exports = CountStream;

		util.inherits(CountStream, Writable);  // 继承可写流

		function CountStream(matchText, options) {
			Writable.call(this, options);
			this.count = 0;
			this.matcher = new RegExp(matchText, 'ig');
		}

		CountStream.prototype._write = function (chunk, encoding, callback) {
			let matches = chunk.toString().match(this.matcher);  // 把当前的数据转换成字符串并进行匹配
			if (matches) {
				this.count += matches.length;
			}
			callback();
		}

		CountStream.prototype.end = function () {
			this.emit('total', this.count);   // 当输入流结束时，触发total事件
		}

	<例子 1.2> 使用CountStream类
		const http = require('http');
		const CountStream = require('./countStream');

		let countStream = new CountStream();

		http.get('http://www.manning.com', (res) => {
			res.pipe(countStream);    // 从网站中以管道的方式把数据传给countStream用于文本计数
		});

		countStream.on('total', (count) => {
			console.log('Totol matches', count);
		});	

	<例子 1.3> 使用CountStream类
		const assert = require('asset');
		const CountStream = require('./countStream');
		const fs = require('fs');

		let countStream = new CountStream();
		let passed = 0;

		countStream.on('total', (count) => {  // 当流结束时，total事件将会被触发
			assert.equal(count, 1);    // 断言预计的计数
			passed++;
		});

		fs.createReadStream(__filename).pipe(countStream);  // 为当前文件创建一个可写流，并且把数据通过管道传给CountStream.

		process.on('exit', () => {
			console.log('Assertions passed:', passed);    // 在程序结束前，展示执行了断言的数量。
		});

	<例子 4.2> 从EventEmitter继承
		const util = require('util');
		const events = require(events);

		let AudioDevice = {
			play (trak) {
				// Stub: Trigger playback through
			},
			stop () {

			}
		};

		function MusicPlayer() {
			this.playing = false;
			events.EventEmitter.call(this);
		}

		util.inherits(MusicPlayer, events.EventEmitter);

		let musicPlayer = new MusicPlayer();

		musicPlayer.on('play', (trak) => {
			this.playing = true;
			AudioDevice.play(track);
		});

		musicPlayer.on('stop', () => {
			this.playing = false;
			AudioDevice.stop();
		});

		musicPlayer.emit('play', 'The Roots - The Fire');

		setTimeout(() => {
			musicPlayer.emit('stop');
		}, 1000);

		/*监听器也能被删除，emitter.removeListener(type, listener) 可以将一个监听器从一个指定的事件上删除。emitter.removeAllListeners() 可以删除全部的监听器。你需要将一个监听器保存在一个变量中，使它在被删除时能被引用到时，就像通过clearTimeout来删除timers一样。*/

		<例子 4.4> 删除监听器
			function play(track) { // 如果想要移除附上监听，那么一个监听的引用是不中或缺的
				this.playing = true;
			}

			musicPlayer.on('play', play);
			musicPlayer.removeListener('play', play);

		<例子 4.5> 混合EventEmitter
			const EventEmitter = require('events').EventEmitter;

			function MusicPlayer(track) {
				this.track = track;
				this.playing = false;

				for (let methodName in EventEmitter.prototype) {
					this[mehtodName] = EventEmitter.prototype[methodName];
				}
			}

			MusicPlayer.prototype = {
				toString() {
					if (this.playing) {
						return 'Now playing: ' + this.track;
					} else {
						return 'Stopped'
					}
				}
			}

			let musicPlayer = new MusicPlayer('Girl Talk - Still Here');

			musicPlayer.on('play', () => {
				this.playing = true;
				console.log(this.toString());
			});

			musicPlayer.emit('play');

	<例子 4.7> 基于事件的错误
		const util = require('util');
		const events = require('events');

		function MusicPlayer() {
			event.EventEmitter.call(this);
		}

		util.inherits(MusicPlayer, events.EventEmitter);

		let musicPlayer = new MusicPlayer();

		musicPlayer.on('play', (trach) => {
			this.emit('error', 'unable to play!');
		});

		musicPlayer.on('error', (err) => {
			console.log('Error', err);
		});

		setTimeout(() => {
			musicPlayer.emit('play', 'Little Comets - Jennifer');
		}, 1000);

	<例子 4.8> 通过domain管理异常
		const util = require('util');
		const domain = require('domain');
		const events = require('events');

		let audioDomain = domain.create();	// Domain模块必须被加载，然后方可以利用create方法创建一个相应的实例

		function AudioDevice() {
			events.EventEmitter.call(this);
			this.on('play', this.play.bind(this));
		}

		util.inherits(AudioDevice, events.EventEmitter);

		AudioDevice.prototype.play = function () {
			this.emit('error', 'not implemented yet')
		};

		function MusicPlayer() {
			events.EventEmitter.call(this);

			this.audioDevice = new AudioDevice();
			this.on('play', this.play.bind(this));

			this.emit('error', 'No audio tracks are available');   // 这个错误以及任何其它的错误都会同一个error处理方法所处理
		};

		audioDomain.on('error', (err) => {
			console.log('audioDomain.error:', err);
		});

		audioDomain.run(() => {                          // 任何在这个回调中导致错误的代码都会被domain覆盖到
			let musicPlayer = new MusicPlayer();
			musicPlayer.play();
		});

	<例子 4.9> 密切关注新的监听
		const util = require('util');
		const events = require('events');

		function EventTracker() {
			events.EventEmitter.call(this);
		}	

		util.inherits(EventTracker, events.EventEmitter);

		let eventTracker = new EventTracker();

		eventTracker.on('newListener', (name, listener) => {  // 一旦有监听器加入进来就开始追踪
			console.log('Event name added:', name);
		});

		eventTracker.on('a listener', () => {
			// this will cause 'newListener' to fire
		});

	<例子 4.10> 在有新建监听器事件中自动触发事件
		const util = require('util');
		const events = require('events');

		function Pulsar(speed, times) {
			events.EventEmitter.call(this);

			this.speed = speed;
			this.times = times;

			this.on('newListener', (eventName, listener) => {
				if (eventName === 'pulse') {
					this.start();
				} 
			});

			util.inherits(Pulsar, events.EventEmitter);

			Pulsar.prototype.start = function () {
				let id = setInterval(() => {
					this.emit('pulse');
					this.times--;
					if (this.times === 0) {
						clearInterval(id);
					}
				}, this.speed);
			}

			let pulsar = new Pulsar(500, 5);

			pulsar.on('pulse', () => {
				console.log('.');
			});

	<例子 4.11> 查询监听器
		Pulsar.prototype.stop = function () {
			if (this.listeners('pulse').length === 0) {
				throw new Error('No listeners have been added!');
			}
		}	

		let pulsar = new Palsar(500, 5);
		pulsar.stop();

	<例子 4.12> 在Express中复用EventEmitter
		const express = require('express');

		let app = express();

		app.on('hello-alert', () => {
			console.warn('Warning');
		});

		app.get('/', (req, res) => {
			res.app.emit('hello-alert');   // app对象在res.app也是可得的
			res.send('hello world');
		});

		app.listen(3000);

	<例子 4.14> 使用对象组织管理事件名称
		const util = require('util');
		const events = require('events');	

		function MusicPlayer() {
			events.EventEmitter.call(this);
			this.on(MusicPlayer.events.play, this.play.bind(this));
		};

		const e = MusicPlayer.events = {
			play: 'play',
			pause: 'pause',
			stop: 'stop',
			ff: 'ff',
			rw: 'rw',
			addTrack: 'add-track'
		};

		util.inherits(MusicPlayer, events.EventEmitter);

		MusicPlayer.prototype.play =  function () {
			this.playing = true;
		}

		let musicPlayer = new MusicPlayer();

		musicPlayer.on(e.play, () => {
			console.log('Now playing')
		});

		musicPlayer.emit(e.play);

	<例子 5.1> 一个使用流的简单的静态web服务器
		const http = require('http');
		const fs = require('fs');

		http.createService((req, res) => {
			fs.createReadStream(__dirname+'/index.html').pipe(res);
		}).listen(8080);

	<例子 5.2> 使用gzip压缩的静态web服务器
		const http = require('http');
		const fs = require('fs');
		const zlib = require('zlib');

		http.createServer((req, res) => {
			res.writeHead(200, {'content-encoding': 'gzip'});
			fs.createReadStream(__dirname+'/index.html')     // 设置头部以便让浏览器知道开启了gzip压缩
				.pipe(zlib.createGzip())                       // 两个管道的调用，分别用来压缩文件和把文件以流的方式输出到客户端
				.pipe(res);
		});	                                                                                                                   

	<例子 5.4> 一个使用流的Express应用
		const stream = require('stream');
		const util = require('util');
		const express = require('express');

		let app = express();

		util.inherits(StatStream, stream.Readable);  // 继承于stream.Readable来创建一个可读流，并且调用父类的构造函数

		function StatStream(limit) {
			stream.Readable.call(this);
			this.limit = limit;
		};

		StatStream.prototype._read = function (size) {
			if (this.limit === 0) {
				this.push();
			} else {
				this.push(util.inspect(process.memoryUsage()));  // 用一些数据来响应请求，这里是发送一个表示Node进程内在用量的字符串
				this.push('n');
				this.limit--;
			}
		}

		app.get('/', (req, res) => {
			let statStream = new StatStream(10);
			statStream.pipe(res);    // 使用标准的readable.pipe(writable)模式来把数据返回给浏览器
		});

		app.listen(3000);

	·选择一个流的基础类
		Readable：你想要使用流API来包装一个底层的I/O数据源；
		Writable：你想从一个程序中获取输出到其他地方使用，或者在程序中发送数据；
		Transform：你想用某种方式解析数据并修改它；
		Duplex：你想要包装一个数据源，从测试到分析都不修改它；
	
	<例子 5.5> 从 stream.Readable 基类继承
		const Readable = require('stream').Readable;

		function MyStream(options) {
			Readabled.call(this, options);
		}		

		MyStream.prototype = Object.create(Readable.prototype, {
			constructor: {value: MyStream}
		});

	<例子 5.6> 一个JSON行解析器
		const stream = require('stream');
		const util = require('util');
		const fs = require('fs');

		function JSONLineReader(source) {
			stream.Readable.call(this);                  // 通常要确保调用父类的构造函数
			this._source = source;
			this._foundLineEnd = false;
			this._buffer = '';

			source.on('readable', function() {           // 当数据源准备好可以触发之后的reads事件时调用read()
				this.read();
			}).bind(this);
		}	

		util.inherits(JSONLineReader, stream.Readable);   // 从stream.Readable继承来创建一个可定制的新类

		JSONLineReader.prototype._read = function(size) {  // 所有的定制stream.Readable类都必须实现_read()方法
			let chunk, line, lineIndex, result;

			if (this._buffer.length === 0) {                 // 当类准备好接收更多数据时，在源上调用read()
				chunk = this._source.read();
				this._buffer += chunk;
			}

			lineIndex = this._buffer.indexOf('n');

			if (lineIndex !== -1) {
				line = this._buffer.slice(0, lineIndex);
				if (line) {                                     // 从buffer的开始截取第一行来获取一些文本进行解析 
					result = JSON.parse(line);
					this._buffer = this._buffer.slice(lineIndex + 1);
					this.emit('object', result);
					this.push(util.inspect(result));              // 无论何时当一个JSON记录解析出来时，触发一个"object"事件，对这个类来说是唯一的，但不是必需的。
				} else {
					this._buffer = this._buffer.slice(1);   // 把解析好的JSON发送回内部队列
				}
			}
		};

		let input = fs.createReadStream(__dirname + '/json-lines.txt', {
			encoding: 'utf8'                              // 创建一个JSONLineReader的实例，传递一个文件流给它处理
		});

		let jsonLineReader = new jsonLineReader(input);

		jsonLineReader.on('object', (obj) => {
			console.log(`pos: ${obj.position} - letter: ${obj.letter}`);
		});

	<例子 5.8> 实现一个可写流的例子	
		const stream = require('stream');

		GreenStream.prototype = Object.create(stream.Writable.prototype, {
			constructor: {value: GreenStream}
		});

		function GreenStream(options) {
			stream.Writable.call(this, options);
		}

		GreenStream.prototype._write = function(chunk, encoding, callback) {
			process.stdout.write('u001b[32m'+chunk+'u001b[39m');
			callback();
		};

		process.stdin.pipe(new GreenStream());

	<异步读取文件>	
		const fs = require('fs');

		fs.readdFile('./config.js', (err, buf) => {
			if (err) throw err;                      // 当没有这个配置文件时应用无法运行，我们仅会抛出异常，Node进程会和打印跟踪磁浮磁浮堆栈
			let config = JSON.parse(buf.toString());   // 我们拿一个buffer，将其转为字符串，然后解析成为JSON
			doThisThing(config);
		});

	<同步版本>	
		const fs = require('fs');

		let config = JSON.parse(fs.readFileSync('./config.json').toString());   // 同步的方法如果有错误，会自动抛出
		doThisThing(config);

		const fs = require('fs');
		try {
			fs.readFileSync('./some-file');   // 同步的错误可以使用标准的try/catch块来捕获
		} catch (err) {
			console.error(err);      // 处理错误
		}

		/*锁文件*/
			fs.writeFile('config.lock', process.pid, {flags: 'wx'}, (err) => {  // 如果不存在锁文件的话，写入PID来锁住文件
				if (err) return console.error(err);               // 任何失败，包括文件已存在

				/*安全地修改config.json*/
			});

		/*通过mkdir创建锁文件*/
		fs.mkdir('config.json', (err) => {
			if (err) return console.error(err);    // 无法创建目录

			fs.writeFile('config.lock/'+process.pid, (err) => {   // 标识PID已经锁住以便进行调试。
				if (err) return console.error(err);

				/*安全地修改config.json*/
			});
		});

		/*创建一个锁文件模块*/
		const fs = require('fs');

		let hasLock = false;
		let lockDir = 'config.lock';

		exports.lock = function(cb) {   // 定义一个方法来获取一个锁
			if (hasLock) return cb();     // 已经获得了一个锁

			fs.mkdir(locDir, (err) => {
				if (err) return cb(err);    // 无法创建一个锁

				fs.writeFile(`${lockDir}/${process.pid}`, (err) => { // 把PID写入到时目录中以便调试
					if (err) console.error(err);                       // 如果无法写PID，并非世界末日：打印日志，然后继续运行

					hasLock = true;
					return cb();            // 锁创建了
				});
			});
		}

		exports.unlock = function(cb) {    // 定义一个方法来释放锁
			if (!hasLock) return cb();       // 没有需要解开的锁

			fs.unlink(`${lockDir}/${process.pid}`, (err) => {
				if (err) return cb(err);

				fs.rmdir(lockDir, (err) => {
					if (err) return cb(err);
					hasLock = false;
					cb();
				});
			});
		}

		process.on('exit', () => {
			if (hasLock) {
				fs.unlinkSync(`${lockDir}/${process.pid}`);  // 如果还有一个锁，在退出之前同步删除掉1
				fs.rmdirSync(lockDir);
				console.log('removed lock');
			}
		});

		/*使用*/
		const locker = require('./locker');

		locker.lock((err) => {   // 尝试获取一个锁
			if (err) throw err;
			/*在这里进行修改*/
			locker.unlock(() => {});  // 当完成后释放锁
		});

		/*findSync*/
		const fs = require('fs');
		const join = require('path').join;
		const _ = require('lodash');

		exports.findSync = function (nameRe, startPath) {   // 接收一个正则来从一开始的路径进行搜索。
			let results = [];                                 // 存储匹配项的集合

	 		function finder(path) {
	 			let files = fs.readdirSync(path);               // 读取文件列表（包括目录）

	 			_.forEach(files, (item) => {                    
	 				let fpath = join(path, item);                 // 获取当前文件路径
	 				let stats = fs.statSync(fpath);               // 获取当前文件状态

	 				if (stats.isDirectory()) {                    // 如果它是一个文件目录，继续使用新的路径调用finder
	 					finder(fpath);
	 				}
	 				if (stas.isFile() && nameRe.test(item)) {     // 如果它是一个文件，并且满足搜索的匹配，将其添加当结果中
	 					results.push(fpath);
	 				}
	 			});
	 		}

	 		finder(startPath);    // 初始化文件查找
	 		return results;       // 返回结果
		}

		const fineder = require('./finder');
		try {
			let results = finder.findSync(/file.*/, '/path/to/root');
			console.log(result);
		} catch(err) {
			console.error(err);
		}

		/*异步版本*/
		const fs = require('fs');
		const join = require('path').join;

		exports.find = function(nameRe, startPath, cb) {
			let result = [], asyncOps = 0, errored = false;

			function error(err) {
				if (!errored) cb(err);
				errored = true;
			}

			function finder(path) {
				asyncOps++;   // 在第一个异步操作之前计数器自增
				fs.readdir(path, (err, files) => {
					if (err) return error(err);

					files.forEach((file) => {
						let fpath = join(path, file);

						asyncOps++;
						fs.stat(fpath, (err, stats) => {
							if (err) return error(err);

							if (stats.isDirectory()) {
								finder(fpath)
							} 
							if (stats.isFile() && nameRe.test(file))  {
								results.push(fpath);
							}

							asyncOps--;
							if (asyncOps === 0) {
								cb(null, results);
							}
						});
					});

					asyncOps--;            // 在每一个异步操作已完成之后计数器自减
					if (asnycOps === 0) {   // 如果我们回到零了，那么已经完成并且没有错误，这时候可以在回调中返回结果
						cb(null, results);
					}

				});
			}

			finder(startPath);
		}

		const finder = require('finder');

		finder.find(/file.*/, '/path/to/root', (err, result) => {
			if (err) return console.error(err);
			console.log(resutls);
		});
		


		/*编写文件数据库*/
		const fs = require('fs');
		const EventEmitter = require('events').EventEmitter;
		const _ = require('lodash');

		let Database = function(path) {
			this.path = path;

			this._records = Object.create(null);
			this._writeStream = fs.createWriteSteram(this.path, {
				encoding: 'utf8',
				flags: 'a'
			});

			this._load();
		}

		Database.protected = Object.create(EventeEmitter.prototype);

		Database.prototype._load = function() {
			let stream = fs.createReadStream(this.path, {encoding: 'utf8'});
			let data = '';

			stream.on('readable', () => {
				data += stream.read();
				let records = data.split('\n');
				data = records.pop();

				_.forEach(records, (rec) => {
					try {
						let record = JSON.parse(rec);
						if (record.value == null) {
							delete this._records[record.key];
						} else {
							this._records[record.key] = record.value;
						}
					} catch(e) {
						this.emit('error', 'foun invalid record', rec);
					}
				});
			});

			stream.on('end', () => {
				this.emit('load');
			});
		}

	<例子 7.1> 一个简单的TCP服务器
		const net = require('net');

		let clients = 0;

		let server = net.createServer((client) => {
			clients++;
			let clientId = clients;
			console.log('Client disconnected:', clientId);

			client.on('end', () => {
				console.log('Client disconnected:', clientId);
			});

			client.write(`Welcome client: ${clientId} rn`);
			client.pipe(client);
		});

		server.listen(8000, () => {
			console.log('Server started on port 8000');
		});

	<例子 7.2 创建TCP客户端来测试服务器>	
		const assert = require('assert');
		const net = require('net');

		let clinets = 0;
		let expectedAssertions = 2;

		let server = net.createServer((client) => {
			clients++;
			let clientId = client;
			console.log('Client connected', clientId);

			client.on('end', () => {
				console.log(`Client disconnected: ${clientId}`);
			});

			client.write(`Welcome client: ${clientId} \r\n`);
		});

		server.listem(8000, () => {
			console.log('Server started on port 8000');

			runTest(1, () => {
				runTest(2, () => {
					console.log('Tests finished');
					assert.equal(0, expectedAssertions);
					server.close();
				});
			});
		});

		function runTest(expectedId, done) {
			let client = net.connect(8000);

			client.on('data', (data) => {
				let expected = `Welcome client: ${expectedId}\r\n`;
				assert.equal(data.toString(), expected);
				expectedAssertions--;
				client.end();
			});

			client.on('end', done);
		}

	<例子 7.4 UDP客户端和服务器>	
		const dgram = require('dgram');
		const fs = require('fs');

		let port = 41230;
		let defaultSize = 16;

		function Client(romateIp) {
			let inStream = fs.createReadStream(__filename);
			let socket = dgram.createSocket('udp4');

			inStream.on('readable', () => {
				sendData();
			});

			function sendData() {
				let message = inStreamRead(defaultSize);

				if (!message) {
					return socket.unref();
				}
			}

			socket.send(message, 0, message.length, port, remoteIP, (err, bytes) => {
				sendData();
			});
		}

		function Server() {
			let socket = dgram.createSocket('udp4');

			socket.on('message', (msg, rinfo) => {
				process.stdout.write(msg.toString());
			});

			socket.on('listening', () => {
				console.log('Server ready:', socket.address());
			});

			socket.bind(port);
		}

		if (process.argv[2] === 'client') {
			new Client(process.argv[3]);
		} else {
			new Server();
		}

	<例子 7.6> 一个简单的HTTP服务器
		const assert = require('assert');
		const http = require('http');

		let server = http.createServer((req, res) => {
			res.writeHead(200 , {'Content-Type': 'text/plain'});
			res.write('Hello, world.\r\n');
			res.end();
		});

		server.listen(8000, () => {
			console.log('Listening on port 8000');
		});

		let req = http.request({
			port: 8000
		}, (res) => {
			console.log('HTTP headers:', res.headers);
			res.on('data', (data) => {
				console.log('Body:', data.toString());
				assert.equal('Hello, world.\r\n', data.toString());
				assert.equal(200, res.statusCode);
				server.unref();
			});
		});

		req.end();

	<例子 7.7> 创建一个HTTP的GET请求来处理重定向
		const http = require('http');
		const https = require('https');	
		const url = require('url');

		function Request() {
			this.maxRedirects = 10;
			this.redirects = 0;
		}

		Request.prototype.get = function(href, callback) {
			let uri = url.parse(href);
			let options = {host: uri.host, path: uri.path};
			let httpGet = uri.protocol === 'http:' ? http.get : https.get;

			console.log(`GET:${href}`);

			function processResponse(response) {
				if (response.statusCode >= 300 && response.statusCode < 400) {
					if (this.redirects > this.maxRedirects) {
						this.error = new Error(`Too many redirects for: ${href}`);
					} else {
						this.redirects++;
						href = url.resolve(options.host, response.headers.location);
						return this.get(href, callback);
					}
				}

				response.url = href;
				response.redirects = this.redirects;

				console.log(`Redirected: ${href}`);

				function end() {
					console.log('Connect ended');
					callback(this.error, response);
				}

				response.on('data', (data) => {
					console.log(`Got data, length: ${data.length}`);
				});

				response.on('end', end.bind(this));
			}

			httpGet(options, processResponse.bind(this))
				.on('error', (err) => {
					callback(err);
				});
		};

		let request = new Request();

		request.get('http://google.com/', (err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`Fetch URL:`, res.url, 'with', res.redirects, 'redirects');
				process.exit();
			}
		});

	<例子 7.8> 使用http模块来创建代理
		const http = require('http');		
		const url = require('url');

		http.createService((req, res) => {
			cnosole.log('start request:', req.url);
			let options = url.parse(req.url);
			options.headers = req.headers;

			let proxyRequest = http.request(options, (proxyReponse) => {
				proxyRequest.on('data', (chunk) => {
					console.log('proxyResponse length:', chunk.length);
					res.write(chunk, 'binary');
				});
				proxyResponse.on('end' () => {
					console.log('proxy request ended');
					res.end();
				});

				res.writeHead(proxyRespnes.statusCode, proxyResponse.headers);
			});

			req.on('data', (chunk) => {
				console.log('in request length', chunk.length);
				proxyRequest.write(chunk, 'binary');
			});

			req.on('end', () =>{
				console.log('original request end');
				proxyRequest.end();
			});
		}).listen(8080);

	<例子 9.1>一个快速的静态的web服务器
		const connect = require('connect');
		connect.createServer(connect.static(__dirname)).listen(8080);

	<例子 9.3>使用cheerio来抓取web页面
		const cheerio = require('cheerio');
		const fs = require('fs');

		fs.readFile('./index.html', 'utf8', (err, html) => {
			let $ = cheerio.load(html);
			let releases = $('.Releases a strong');

			releases.each(function(i) {
				console.log('New release', this.text());
			});
		});

	<例子 9.8> 重新加载一个Node进程
		const fs = require('fs');
		const exec = require('child_process').exec;

		(function watch() {
			let child = exec('node server.js');   //开启web服务器进程
			let watcher = fs.watch(__dirname + '/server.js', (event) => {
				console.log('File changed, reloading.');
				child.kill();                 // 当文件修改时，关闭web服务器
				watcher.close();              // 关闭监听器
				watch();                      // 递归调用监测函数来再次开启服务器
			});
		})();

	在 Node.js中，可以使用 process.nextTick()来实现将同步转换成异步，它的作用是延迟一个函数的执行，直到下一次事件循环。它的功能非常简单，就是将回调作为参数，并将其捡到事件队列的顶部，在任何等待处理I/O事件之前返回。一旦事件循环再次运行，该回调将被执行。
	const fs = require('fs');
	const cache = {};

	function consistenReadAsync(filename, callback) {
		if (cache[filename]) {
			process.nextTick(() => callback(cache[filename]));
		} else {
			// asynchronous function 
			fs.readFile(filename, 'utf8', (err, data) => {
				cache[filename] = data;
				callback(data);
			});
		}
	} 	


=> 创建和使用EventEmitter
	const EventEmitter = require('events').EventEmitter;
	const fs = require('fs');

	function findPattern(files, regex) {
		const emitter = new EventEmitter();
		files.forEach((file) => {
			fs.readFile(file, 'uft8', (err,  content) => {
				if (err) {
					return emitter.emit('error', err);
				}

				emitter.emit('fileread', file);

				let match = content.match(regex);
				if(match) {
					mathch.forEach(elem => emitter.emit('found', file, elem));
				}
			});
		});

		return emitter;
	}

	findPattern(
		['fileA.txt', 'fielB.json'],
		/hello \w+/g
	)
		.on('fileread', file => console.log(file+'was read'))
		.on('found', (file, match) => console.log('Matched'+match+'in file'+file))
		.on('error', err => console.log('Error emitted:' + 'err.message'));

=> 继承EventEmitter
	const EventEmitter = require('events').EventEmitter;
	const fs = require('fs');

	class FindPattern extends EventEmitter {
		constructor (regex) {
			super();
			this.regex = regex;
			this.files = [];
		}

		addFile(file) {
			this.files.push(file);
			return this;
		}

		find() {
			this.files.forEach(file => {
				fs.readFile(file, 'utf8', (err, content) => {
					if (err) {
						return this.emit('error', err);
					}
					this.emit('fileread', file);

					let match = content.match(this.regex);
					if (match) {
						match.forEach(elem => this.emit('found', file, elem));
					}
				});
			});

			return this;
		}	
	}	

	let findPatternObject = new FindPatternObject(/hello \w+/);
	findPatternObject.addFile('fileA.txt')
		.addFile('fileB.txt')
		.find()
		.on('found', (file, match) => console.log(`Matched "${match}" in file ${file}`))
		.on('error', err => console.log(`Error emitter ${err.message}`))	

>> 救援队列
	class TaskQueue {
		constructor(concurrency) {
			this.concurrency = concurrency;
			this.running = 0;
			this.queue = [];
		}

		pushTask(task) {
			this.queue.push(task);
			this.next();
		}

		next() {
			while (this.running < this.concurrency && this.queue.length) {
				const task = this.queue.shift();
				this.running++;   // 有新的异步操作时，先做自增
				task(() => {
					this.running--;  // 异步操作完成时，做自减
					this.next();
				});
			}
		}
	};

=> Node.js风格函数的promise化
	module.exports.promisify = function(callbackBaseApi) {
		return function promisified() {
			const args = [].slice.call(arguments);
			return new Promise((resolve, reject) => {
				args.push((err, result) => {
					if (err) {
						return reject(err);
					}
					if (arguments.length < = 2) {
						resolve(result);
					} else {
						resolve([].slice.call(arguments, 1));
					} 

					callbackBaseApi.apply(null, args);

				});
			});
		}
	}	
	

	const utilities = require('./utilities');
	const request = utilities.promisify(require('request'));
	const mkdirp = utilities.promisify(require('mkdirp'));
	const fs = require('fs');
	const readFile = utilities.promisify(fs.readFile);
	const writeFile = utilities.promisify(fs.writeFile);

	function download(url, filename) {
		console.log(`Downloading ${url}`);
		let body;
		return request(url)
			.then(response => {
				body = response.body;
				return mkdirp(path.dirname(filename));
			})
			.then(() => {writeFile(filename, body)})
			.then(() => {
				console.log(`Downloaded and saved: ${url}`);
				return body;
			});
	}

<顺序迭代之模式>	
	let tasks = [ /*...*/ ];
	let promise = Promise.resolve();
	tasks.forEach(task => {
		promise = promise.then(() => {
			return task();
		});
	});

	promise.then(() => {
		// All tasks completed
	});

	forEach()循环的替代方法是使用 reduce()函数，其代码会更加简捷
	let tasks = [/* .... */];
	let promise = tasks.reduce((prev, task) => {
		return prev.then(() => {
			return task();
		});
	}, Promise.resolve());

	promise.then(() => {
		// All tasks completed
	});

<并行执行>
	function spiderLinks(currentUrl, body, nesting) {
		if (nesting === 0) {
			return Promise.resolve();
		}
		const links = utiltities.getPageLinks(currentUrl, body);
		const promises = links.map(link => spider(link, nesting-1));
		return Promise.all(promises);
	}
	/*
		这里的模式包括在elements.map()循环中一次性启动spider()任务，该循环也收集所有的promise。这一次，在循环中，我们不用等待前一个下载完成再开始新的下载，所有的下载任务一次性在循环中启动。之后，利用promise.all()方法返回一个新的promise， 当数组中的所有promise被履行时，该pomise也将被履行，这正是我们所想要的。
	*/

=> generator异步控制流
	function asyncFlow(generatorFunction) {
	  function callback(err) {
	    if (err) {
	      return generator.throw(err);
	    }
	    const results = [].slice.call(arguments, 1);
	    generator.next(results.length > 1 ? results : results[0]);
	  }
	  const generator = generatorFunction(callback);
	  generator.next();
	}

	const fs = require('fs');

	asyncFlow(function * (callback) {
	  const fileName = 'rxlib.js';
	  const myself = yield fs.readFile(fileName, 'utf8', callback);
	  yield fs.writeFile(`clone_of_${fileName}`, myself, callback);
	  console.log('Clone created');
	});

<生产者-消费者模式>
	class TaskQueue {
		constructor(concurreny) {
			this.concurrency = concurrency;
			this.running = 0;
			this.taskQueue = [];
			this.consumerQueue = [];
			this.spawnWorks(concurrency);
		}
		pushTask(task) {
			if (this.consumerQueue.length !== 0) {
				this.consumerQueue.shift()(null, task);
			} else {
				this.taskQueue.push(task);
			}
		}
		spawnWorks(concurrency) {
			const self = this;
			for (let i = 0; i < concurrency; i++) {
				co(function* () {
					while (true) {
						const task = yield self.nextTask();
						yield task;
					}
				})
			}
		}
		nextTask() {
			return callback => {
				if (this.taskQueue.length !== 0) {
					return callback(null, this.taskQueue.shift());
				}
				this.consumerQueue.push(callback);
			}
		}
	}

<通过缓存实现Gzip>	
	&& node gzip <path to file>

	const fs = require('fs');
	const zlib = require('zlib');

	const file = process.argv[2];

	fs.readFile(file, (err, buffer) => {
		zlib.gzip(buffer, (err, buffer) => {
			fs.writeFile(file+'.gz', buffer, (err) => {
				console.log('File successfully compressed');
			});
		});
	});

<通过流实现Gzip> 想要修改Gzip程序使其能够处理大文件，最简单的方式就是使用流。
	const fs = require('fs');
	const zlib = require('zlib');
	const file = process.argv[2];

	fs.createReadStream(file)
		.pipe(zlib.createGzip())
		.pipe(fs.createWriteStream(file+'.gz'))
		.on('finish', () => {console.log('File successful compressed')});	


	const http = require('http');
	const fs = require('fs');
	const zlib = require('zlib');

	const server = http.createServer((req, res) => {
		const filename = req.headers.filename;
		console.log('File request received:'+filename);
		req.pipe(zlib.createGunzip())
			.pipe(fs.createWriteStream(filename))
			.on('finish', () => {
				res.writeHead(201, {'Content-Type': 'text/plain'});
				res.end(`that's it\n`);
				console.log(`File saved: ${filename}`);
			});
	});

	server.listen(3000, () => console.log('Listening'));

	创建一个 gzipSend.js 文件作为应用程序的客户端模块
	const fs = require('fs');
	const zlib = require('zlib');
	const http = require('http');
	const path = require('path');

	const file = process.argv[2];
	const server = process.argv[3];   // localhost

	const options = {
		hostname: server,
		port; 3000,
		path: '/',
		method: 'PUT',
		headers: {
			filename: path.basename(file),
			'Content-Type': 'application/octet-stream',
			'Content-Encoding': 'gzip'
		}
	};

	const req = http.request(options, res => {
		console.log('Server response: '+res.statusCode);
	});

	fs.createReadStream(file)
		.pipe(zlib.createGzip())
		.pipe(req)
		.on('finish', () => {
			console.log('File successfully sent');
		});

<实现可读流>
	const stream = require('stream');
	const Chance = require('chance');
	const chance = new Chance();

	class RandomStream extends stream.Readable {
		constructor(options) {
			super(options);
		}

		_read(size) {
			const chunk = chance.string();
			console.log(`Pushing chunk of size: ${chunk.length}`);
			this.push(chunk, 'utf8'); 
			if (chance.bool({likelihook: 5})) {
				this.push(null);
			}
		}
	}

	module.exports = RandomStream;

<写入流的背压机制>	
	const Chance = require('chance');
	const chance = new Chance();

	require('http').createServer((req, res) => {
		res.writeHead(200, {'Content-Type', 'text/plain'});

		function generatorMore() {
			while (chance.bool({likelihook: 95})) {
				let shouldContinue = res.write(chance.string({length: (16 * 1024) - 1}));

				if (!shouldContinue) {
					console.log('Backpressure');
					return res.once('drain', generateMore);
				}
			}

			res.end('\nThe end...n', () => console.log('All data was sent'));
		}
		generatorMore();
 	}).listen(8080, () => console.log('Listening on http://localhost:8080'));

<实现变换流>	
 	const stream = require('stream');

	class ReplaceStream extends stream.Transform {
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

			this.push(pieces.join(this.repliceString));
			callback();
		}

		_flush(callback) {
			this.push(this.tailPiece);
			callback();
		}
	}

	process.openStdin()
		.pipe(new ReplaceStream(process.argv[2], process.argv[3]))
		.pipe(process.stdout);

<流的顺序执行>
	const fromArray = require('from2-array');
	const through = require('through');
	const fs = require('fs');

	function cancatFiles(destination, files, callback) {
		const destStream = fs.createWriteStream(destination);
		fromArray.obj(files) 
			.pipe(through.obj((file, enc, done) => {
				const src = fs.createReadStream(file);
				src.pipe(destStream, {end: false});
				src.on('end', done)
			}))
			.on('finish', () => {
				destStream.end();
				callback();
			});
	}

	module.exports = concatFiles;


process.nextTick(): 它的作用是延迟一个函数的执行，直到下一次事件循环;

<获取目录下所有的文件名>
	const fs = require('fs');

	function getAllFileFromPath(path) {
		fs.readdir(path, (err, res) => {
			for (let subPath of res) {
				// 这里使用同步方法而非异步
				let statObj = fs.statSync(path + '/' + subPath);
				if (statObj.isDirectory()) {  // 判断是否是目录
					console.log('Dir:', subPath);
					// 如果是文件夹，递归获取子目录中的文件列表
					getAllFileFromPath(path + '/' + subPath);
				} else {
					console.log('File:', subPath);
				}
			}
		});
	} 

	getAllFileFromPath(__dirname);


>>> 使用async模块简化回调
	const async = require('async');
	1.async.series([], callback)： 方法接收一个数组和一个回调函数，回调函数的第二个参数是一个数组，包含了全部异步操作的返回结果，结果集中的顺序和series参数数组的顺序是对应的；
	2.async.parallel([], callback)：所有的方法是并行执行的，执行时间由耗时最长的调用决定。parallel方法在数组中的某个异步调用结束之后并没有立刻返回，而是将结果暂存起来，等所有的异步操作完成之后，再根据调用顺序将结果组装成调用顺序的结果集返回。
	3.async.waterfall([], callback)：同样是顺序执行异步操作，和前两个方法的区别是每一个异步操作都会把结果传递给下一个调用。
