/*
	装饰者模式是一种结构模式，用来动态为现有对象添加一些额外行为。这和传统继承有所区别，因为这些额外的行为并不是添加到时同一对象上，而是仅仅添加到明确被装饰对象实例上。
 */
/*
	在实现方面，它和代理模式相似，但是它并不是增强和修改一个对象的现有方法，而是通过添新的功能来增强它。
 */

/*组合*/
/*使用组合，被装饰的对象被包装成一个新的对象，就像继承而来的一样*/
function decorate(component) {
	const proto = Object.getPrototypeOf(component);

	function Decorate(component) {
		this.component = component;
	}

	Decorator.prototype = Object.create(proto);

	// new method
	Decorator.prototype.greetings = function() {
		return 'Hi!'
	}

	// delegated method
	Decorator.prototype.hello = function() {
		return this.component.hello.apply(this.component, arguments);
	}

	return new Decorator(component);
}