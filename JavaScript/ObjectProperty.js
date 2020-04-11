

/**
 * js对象的两类属性
 * 数据属性
 * 	1.value 属性的值
 * 	2.writable 决定属性能否被赋值
 *  3.enumerable 决定for in 能否枚举该属性
 * 	4.configurable 决定该属性能否被删除或者改变特征值
 * 访问器属性
 * 	1.getter 函数或undefined，在取属性时被调用
 *  2.setter 函数或undefined，在设置属性仁政时被调用
 *  3.enumerable 决定for in 能否枚举该属性
 *  4.configurable 决定该属性能否被删除或者改变特征值
 */

// 属性的属性值我们可以通过Object.getOwnPropertyDescriptor
var o = { a: 1 };
o.b = 2;
//a和b皆为数据属性
Object.getOwnPropertyDescriptor(o,"a") // {value: 1, writable: true, enumerable: true, configurable: true}
Object.getOwnPropertyDescriptor(o,"b") // {value: 2, writable: true, enumerable: true, configurable: true}