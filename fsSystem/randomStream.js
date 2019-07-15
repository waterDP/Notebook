const stream = require('stream');
const Chance = require('chancejs'); // 一个用来生成各种随机值的模块
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

	const randomStream = new RandomStream();

	randomStream.on('readable', () => {
		let chunk;
		while ((chunk = randomStream.read()) !== null) {
			console.log(`Chunk received: ${chunk.toString()}`);
		}
	});