const fs = require('fs');

fs.rename('./a.txt', './rename.txt', (err)=>{
	if(err) throw err;
	fs.stat('./rename.txt', (err, stats) => {
		if(err) throw err;
		console.log(`文件属性：${JSON.stringify(stats)}`);
	})
})
