const fs = require('fs');

fs.stat('./a.txt', (err, stats) => {
	if(err) throw err;
	console.log(`是否是文件：${JSON.stringify(stats.isFile())}`);
	console.log(`是否是文件夹：${JSON.stringify(stats.isDirectory())}`);
	console.log(stats);
});