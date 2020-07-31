/*
	策略模式允许一个称作上下文本的对象，将变量部分提取到独立的，可变换策略对象中，从而支持逻辑中的变化。上下文部分实现了一套算法的公共逻辑部分，而策略实现可变部分，允许上下文根据不同因素，通过系统配置或者用户选择来调整它的行为。策略通常是解决方案的一部分，并且实现了上下文所期望的相同接口。
 */
/*支持多种格式的配置对象*/
const fs = require('fs')
const objectPath = require('object-path')

/*通用部分*/
class Config {
	constructor(strategy) {
		this.data = {};
		this.strategy = strategy;
	}

	get(path) {
		return objectPath.get(this.data, path);
	}

	set(path, value) {
		return objectPath.set(this.data, path, value);
	}

	read(file) {
		console.log(`Deserializing from ${file}`);
		this.data = this.strategy.deserialize(fs.readFileSync(file, 'utf-8'));
	}

	save(file) {
		console.log('Derializing to ${file}');
		fs.writeFileSync(file, this.strategy.serialize(this.data));
	}
}

module.exports = Config;

/*策略部分*/
/*解析和序列化JSON数据*/
module.exports.json = {
	deserialize: data => JSON.parse(data),
	serialize: data => JSON.stringify(data, null, ' ')
}

/*类似地，创建支持INI文件格式的策略*/
const ini = require('ini');
module.exports.ini = {
	deserialize: data => ini.parse(data),
	serialize: data => ini.stringify(data)
}


/*应用*/
const Config = require('./config');
const strategies = require('./strategies');

const jsonConfig = new Config(strategies.json);
jsonConfig.read('samples/conf.ini');
jsonConfig.set('book.nodejs', 'design patterns');
jsonConfig.save('samples/conf_mod.json');

const iniConfig = new Config(strategies.ini);
iniConfig.read('samples/conf.ini');
iniConfig.set('book.nodejs', 'design pattern');
iniConfig.save('samples/conf_mod.ini')