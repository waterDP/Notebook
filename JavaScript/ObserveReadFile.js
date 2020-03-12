/** 
 * 基于回调的方式来获取最获数据
 */
function after(times, callback) {
	let renderObj = {}
	return function (key, value) {
		renderObj[key] = value
		if (--times === 0) {
			callback(renderObj);
		}
	}
}

let out = after(2, function(renderObj) {
	console.log(renderObj)
})

fs.readFile('./age.txt', 'utf8', (error, data) => {
	out('age', data)
})

fs.readFile('./name.txt', 'utf8', (error, data) => {
	out('name', data)
})

/**
 * 基于发布-订阅的方式来获取数据
 */
const e = {
	_renderObj: {},
	_methods: [],
	on(callback) {
		this._methods.push(callback)
	},
	emit(key, value) {
		this._renderObj[key] = value;
		this._methods.forEach(method => method(this._renderObj))
	}
}

e.on((obj) => {
	if (Object.keys(obj).length === 2) {
		console.log(obj)
	}
})

fs.readFile('./age.txt', 'utf8', (error, data) => {
	e.emit('age', data)
})

fs.readFile('./name.txt', 'utf8', (error, data) => {
	e.emit('name', data)
})
