... 文件锁
	/**
	 * 文件锁在你需要协同多个进程同时访问一个文件并且要保证文件的完整必以及数据不能丢失的时候很有用
	 */
	> 使用独占标记创建锁文件
	/**
	 * fs 模块为所有需要打开的文件的方法（比如fs.writeFile/ fs.createWriteStream , 以及fs.open）
	 * 提供了一个xc标记。这告诉操作系统这个文件应该以独占模式打开(O_EXCL)。
	 * 当使用这个方法时，若这个文件存在，文件不能被打开。
	 */
	fs.open('config.lock' , 'wx', err => {
		if (err) return console.error(err); // 任何失败，包括文件已存在；
		// 安全地的修改config.json
	})

	/**
	 * 希望当前一个进程创建一个锁文件时，我们不能打开文件。因为我们不想在当其他进程正在修改这个文件时篡改这个
	 * 文件。所以说独占锁机制在这个情况下很有用。
	 * 但最好把当前进程写到这个锁文件中而不是写一个空文件，这样，当有异常发生时，我们知道最后拥有这个锁的进程
	 */
	fs.writeFile('config.lock', process.pid, {flag: 'wx'}, err => {
		if (err) return console.error(err);
	});

	> 通过mkdir创建锁文件
	/**
	 * 当锁文件在网络磁盘上时独占模式可能不能正常工作，因为一些系统在网络磁盘上并不识别O_EXCL这个标记。
	 * 要绕开这个问题，另外一个策略是把锁文件建成一个文件夹。mkdir是一个原子性的操作(没有并发),
	 * 很好的支持跨平台，并且在网络磁盘上也能很好地运行。当目录已经存在时mkdir方法会失败。这个情况下，
	 * PID可以写入这个目录中的一个文件。
	 */
	fs.mkdir('config.lock', err => {
		if (err) return console.log(err);
		fs.writeFile(`config.lock/${process.pid}`, err => {
			if (err) return console.error(err);
			// 安全的修改config.json
		})
	});

	/**
	 * 到现在为止，我们已经讨论了几个创建文件锁的方法，我们还需要一个方法在结束操作时删除它们。而且，作为一个
	 * 好的文件锁文件使用者，我们应该在进程退出时删除所有的锁文件。这此方法可以封装在一个简单的模块中。
	 */
	const fs = require('fs');

	let haslock = false;
	let lockDir = 'config.lock';

	exports.lock = function(cb) {
		if (haslock) return cb();

		fs.mkdir(lockDir, err => {
			if (err) return cb(err);
			haslock = true;
			return cb();
		});
	}

	exports.unlock = function(cb) {
		if (!haslock) return cb();

		fs.unlink(`${lockDir}/${process.pid}`, err => {
			if (err) return cb(err);
			fs.rmdir(lockDir, err => {
				if (err) return cb(err);
				haslock = false;
				cb();
			});
		});
	}

	process.on('exit', () => {
		if (haslock) {
			fs.unlickSync(lockDir + '/' + process.pid);   // 解除对目录的获取权限
			fs.rmdirSync(lockDir);
			console.log('removed lock');
		}
	});

... 递归文件操作
	/*同步*/
		const fs = require('fs');
		const join = require('path').join;

		exports.findSync = function(nameRe, startPath) {
			const results = [];

			function finder(path) {
				let files = fs.readDirSync(path);
				for (let i = 0; i < files.length; i++) {
					let fpath = join(path, files[i]);
					let stats = fs.statSync(fpath);
					if (stats.isDirectory()) finder(fpath);
					if (stats.isFile() && nameRe.text(file[i])) results.push(fpath);
				}
			}

			finder(startPath);
			return results;
		}

	/*异步*/
		const fs = require('fs');
		const join = require('join');

		exports.find = function (nameRe, startPath, cb) {
			const results = [];
			let asyncOps = 0;  // 救援队列
			let errored = false;

			function error (err) {
				if (!errored) cb(err);
				errored = true;
			}

			function finder (path) {
				asyncOps ++;
				fs.readdir(path, (err, files) => {
					if (err) return error(err);

					files.forEach(file => {
						let fpath =  join(path, file);

						asyncOps++;
						fs.stat(fpath, (err, stats) => {
							if (err) return error(err);

							if (stats.isDirectory()) finder(fpath);
							if (stats.isFile() && nameRe.test(file)) results.push(fpath);

							asyncOps--;
							if (asyncOps === 0) cb(null, results);
						});

						asyncOps--;
						if (asyncOps === 0) cb(null, results);
					})
				});
			}

			finder(startPath);
		}	

... 编写文件数据库
	/*API*/		
	const Database = require('./database');  // 加载我们的数据库模块
	const client = new Database('./test.db'); // 提供我们想加载或者创建的数据库文件的路径

	client.on('load', () => { // 当数据加载到内存中，load事件会被触发
		let foo = client.get('foo');  // 使用健foo来获取存储的值

		client.set('bar', 'my sweet value', err => {  // 为键boo设置一个值
			if (err) return console.error(err);  // 持久化到磁盘中可能产生错误
			console.log('write sucessful');
		});

		client.del('baz');  // 删除建baz.写入后的回调参数是可选的
	});

	/*实现*/
	const fs = require('fs');
	const EventEmitter = require('events').EventEmitter;

	const Database = function(path) {
		this.path = path; // 设置数据库存储的路径 

		this._records = Object.create(null);  // 创建一个仅用于添加模式的写入流来处理磁盘的写入。
		this._writeStream = fs.createWriteStream(this.path, {
			encoding: 'utf8',
			flags: 'a'
		});

		this._load();  // 加载数据库
	}

	Database.prototype = Object.create(EventEmitter.prototype); // 从EventEmitter继承而来

	Database.prototype._load = function () {
		const stream = fs.createReadStream(this.path, {encoding: 'utf8'});
		let data = '';

		stream.on('readable', () => {
			data += stread.read();  // 读取可用的数据
			let records = data.split('\n'); // 按行分割数据记录
			data = records.pop();  // 获得最后的一个可能未完成的记录

			for (let i = 0; i < records.length; i++) {
				try {
					let record = JSON.parse(records[i]);
					if (record.value === null) {  // 如果记录为null则删除该数据
						delete this._records[record.key];
					} else {
						this._records[record.key] = record.value;  // 否则，对于所有非null值，按照键来存储
					}
				} catch(e) {
					this.emit('error', 'found invalid record:', records[i]);
				}
			}
		});

		stream.on('end', () => {  // 当数据已经准备好可用时，触发一个load事件
			this.emit('load');
		});
	}

	/*获取数据*/
	Database.prototype.get =  function(key) {
		return this._records[key] || null;
	}

	/*更改数据*/
	Database.prototype.set = function(key, value, cb) {
		let toWrite = JSON.stringify({key: key, value: value}) + '\n'; // 把Json对象转成字符串，然后添加一个新地
		if (value === null) {
			delete this._records[key]; // 如果是删除，把记录从内存中移除
		} else{
			this._records[key] = value; // 否则，按照键值在内存中设置
		}

		this._writeStream(toWrite, cb); // 把记录写到磁盘中，如果有回调执行回调
	}

	/*删除*/
	Database.prototype.del = function(key, cb) {
		return this.set(key, null, cb);
	}


	
	
