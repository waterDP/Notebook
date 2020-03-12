/* 
	call 的原理
*/
Function.prototype.call = function(context) {
	context = context ? Object(context) : window
	context.fn = this
	let args = []
	for (let i = 1; i < arguments.length; i++) {
		args.push('arguments['+i+']')
	}
	// 利用数组中的toString的特性
	let r = eval('context.fn('+args+')')
	delete context.fn
	return r
}