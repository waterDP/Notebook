const fs = require('fs');
const split = require('split');
const request = require('request');
const ParallelStream = require('./ParallelStream');

fs.createReadStream(process.argv[2])
	.pipe(split())
	.pipe(new ParallelStream((url, enc, push, done) => {
		if (!url) return done();
		request.head(url, (err, response) => {
			push(`${url} is ${err ? 'down' : 'up'}\n`);
			done();
		});
	}))
	.pipe(fs.createWriteStream('result.txt'))
	.on('finish', () => console.log('All urls were checked'));