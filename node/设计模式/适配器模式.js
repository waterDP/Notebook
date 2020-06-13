/*
	适配器模式允许我们通过一个不同的接口去使用原有对象的方法。顾名思义，它适配一个对象，以便该对象能被拥有不同接口的组件使用。
 */
const path = require('path');

module.exports = function createFsAdapter(db) {
	const fs = {};

	fs.readFile = (filename, options, callback) => {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		} else if (typeof options === 'string') {
			options = {encoding: options};
		}

		db.get(
			path.resolve(filename), 
			{valueEncoding: options.encoding},
			(err, value) => { 
				if (err) {
					if (err.type === 'NotFoundError') {
						err = new Error(`ENOENT, open "${filename}"`);
						err.code = 'ENOENT';
						err.errno = 34;
						err.path = filename;
					}
					return callback && callback(err);
				}
				callback && callback(null, value);
			}
		);
	}

	/*
		在上面的代码中，我们需要完成一些额外的工作来确保新的函数尽可能和原始的fs.readFil()方法完成保持一致。以下是该函数的几个实现步骤。
			1.使用filename作为关键词来调用db.get()方法以便从db中检索获取一个文件，确保使用文件的全路径（使用path.resolve()方法）。将数据库使用的valueEncoding设置为输入值的真正编码方法。
			2.如果在数据库中没有找到对应的文件，抛出错误，使用和fs模块中一致的的ENOENT作为错误码，来表示未找到要查找的文件。其他类型的错误都直接传递给callback函数返回(在这个例子中，我们只适配最常见的错误情况)
			3.如果数据库中检索到了相应的键/值对，将通过callback回调函数返回具体的值。
 	*/
 	
 	fs.writeFile = (filename, contents, options, callback) => {
 		if (typeof options === 'function') {
 			callback = options;
 			options = {};
 		} else if (typeof options === 'string') {
 			options = {encoding: options}
 		}
 		db.put(path.resolve(filename), contents, {
 			valueEnncoding: options.encoding
 		}, callback);
 	}

 	return fs;
}
