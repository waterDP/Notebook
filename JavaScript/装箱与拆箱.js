/**
 * ! 装箱
 * 所谓的装箱，是指将基本数据类型转换为对应的引用类型的操作，它包括了String, Number和Boolean。
 * 装箱又可分为隐式装箱和显式装箱
 */

// 隐式装箱
let s1 = 'call_me_R'
let s2 = s1.substring(2)
/* 
  上面的操作其实是这样的
  1.创建String类型的一个实例
  2.在实例中调用制定的方法
  3.销毁这个实例
*/

// 显示装箱
// 装箱另一种方式是显示装箱，这个就比较好理解了，这是通过基本包装类型对象对基本类型进行显示装箱，如下：
let name = new String('call_me_R')

// 显示装箱的操纵可以对new出来的对象进行属性和方法的添加，因为通过new操作符创建的引用类型的实例，在执行流离开当前作用域之前一直保留在内在之中
let objStr = new String('call_me_R')
objStr.job = 'frontend engineer'
objStr.sayHi = function () {
  console.log('hello kitty')
}

console.log(objStr.job)
objStr.sayHi()

/**
 * ! 拆箱
 */
/* 
  拆箱与装箱相反，把对象转变为基本类型的值。拆箱过程内部调用了抽象操作 ToPrimitive。
  该操作接受两个参数，第一个参数是要转变的对象，第二个参数 PreferredType 是对象被期待转成的类型。
  第二个参数不是必须的，默认该参数为 number，即对象被期待转为数字类型。有些操作如 String(obj) 会传入 PreferredType 参数。
  有些操作如 obj + " " 不会传入 PreferredType。

  具体转换过程是这样的。默认情况下，ToPrimitive 先检查对象是否有 valueOf 方法，如果有则再检查 valueOf 方法是否有基本类型的返回值。
  如果没有 valueOf 方法或 valueOf 方法没有返回值，则调用 toString 方法。如果 toString 方法也没有返回值，产生 TypeError 错误。

  PreferredType 影响 valueOf 与 toString 的调用顺序。如果 PreferrenType 的值为 string。则先调用 toString ,再调用 valueOf。

*/
let objNum = new Number(64)
let objStr = new String('64')
console.log(typeof objNum) // object
console.log(typeof objStr) // object

// 拆箱
console.log(typeof objNum.valueOf()) // number基本的数值类型
console.log(typeof objNum.toString()) // string 基本的字符类型
console.log(typeof objStr.valueOf()) // string 基本的字符类型
console.log(typeof objStr.toString()) // string 基本的字符类型