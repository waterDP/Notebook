=> assert （断言）
	assert模块提供了一组简单的断言测试，可用于测试不变量。
	存在严格模式(strict)和遗留模式(legcy)，但建议使用严格模式。


	> assert.AssertError类
	Error 的子类，表明断言的失败。assert模块抛出的所有错误都是Assert类的实例。

	> new assert.AssertError(options)

	options<Object>
		. message<string> 如果提供，则将错误信息设置为此值。
		. actual <any> 错误的实例上的actual属性将包含此值。 在内部用于actual	错误输入，例如使用assert.strictEqual()。
		. expected <any> 错误的实例上的expected属性将包含此值。在内部用于expected错误输入，例如使用 assert.strictEqual()。
		. generatedMessage<boolean> 表明消信息是否是自动生成的。
		. code <string> 始终设置字符ERR_ASSERTION	以表明错误实际是断言错误。
		. operator <string> 设置为传入的运算符。

		const assert = require('assert');

		// 生成AssertError以便稍后比较错误的信息
		const {message} = new assert.AssertError({
			actual: 1,
			expected: 2,
			operator: 'strictEqual'
		});

		// 验证错误的输出
		try {
			assert.strictEqual(1, 2);
		} catch (err) {
			assert(err instanceof assert.AssertionError);
			assert.strictEqual(err.message, message);
			assert.strictEqual(err.name, 'AssertError [ERROR_ASSERTION]');
			assert.strictEqual(err.actual, 1);
			assert.strictEqual(err.expected, 2);
			assert.strictEqual(err.code, 'ERR_ASSERTION');
			assert.strictEqual(err.operator, 'strictEqual');
			assert.strictEqual(err.generatedMessage, true);
		}

=> Buffer (缓冲器)		