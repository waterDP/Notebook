const stream = require('stream');
const Chance = require('./chancejs'); // 一个用来生成各种随机值的模块
const chance = new Chance();

require('http').createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	while (chance.bool({likelihook: 95})) {
		res.write(chance.string() + '\n');
	}

	res.end('\nThe end ... \n');
	res.on('finish', () => console.log('All data was sent'));
}).listen(8080, () => console.log('Listening on http://localhost: 8080'))