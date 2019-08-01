const stream = require('stream');

class SimpleReadStream extends stream.Readable {
	constructor(options) {
		super(options)
		this.count = 1;
	}

	_read(size) {
		while (this.count++ < 10) {
			this.push('1234')
		}
	}
}

const simpleStream = new SimpleReadStream();

simpleStream.on('readable', () => {
	simpleStream.read()
});

simpleStream.on('data', chunk => {
	console.log(chunk + '\n');
});
