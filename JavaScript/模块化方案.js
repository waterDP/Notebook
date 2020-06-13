// ! Commonjs
/**
 * node.js是commonjs规范的主要实践者，它有四个重要的的环境变量为模块的实现提供支持：module/exports/
 * require/global。实际使用时，用module.exports定义当前模块对外输出的接口（不推荐使用exports）
 * 用require加载模块!!
 */
// 定义模块math.js
let basicNum = 0
function add(a, b) {
  return a + b
}
module.exports = {
  add,
  basicName
}// 

// 引用定义的模块时，参数包含路径，可省略.js
const math = require('./math')
math.add(2, 3)

// 引用核心模块时，不需要带路径
const http = require('http')
http.createServer().listen(3000)

/**
 * commonjs用同步的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样会有问题。
 * 但是在浏览器端，限于网络原因，更合适的方案是使用异步加载 
 */

// ! AMD和require.js
/**
 * AMD采用了异步加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中
 * 等到加载完成之后，这个回调函数才会运行。
 * 这里介绍用require.js实现AMD规范的模块化：用require.config()指定引用路径等。用define定义模块
 * 用require()加载樲模块
 */
// 引入require.js   ...
require.config({
  baseUrl: 'js/lib',
  paths: {
    jquery: 'jquery.min',
    underscore: 'underscore.min'
  }
})

// 执行基本操作
require(['jquery', 'underscore', function($, _) {
  // some code here
}])

/* 
  引用模块的时候，我们将模块名放在[]中作为require()的第一个参数；如果我们定义的模块本身也依赖其他模块
  那就需要将它们放在[]中作为define的第一个参数
*/
// 定义main.js模块
defined(function() {
  let basicNum = 0
  let add = function(x, y) {
    return x + y
  }
  return {
    add,
    basicNum
  }
})

// 定义一个依赖underscore.js的模块
defined(['underscore'], function(_) {
  let classify = function(list) {
    _.countBy(list, num => num > 30 ? 'old' : 'young')
  }
  return {
    classify
  }
})

// 引用模块，将模块放到[]中
require(['jquery', 'math'], function($, math) {
  let sum = math.add(10, 20)
  $('#sum').html(sum)
})

// ! CDM和sea.js
/**
 * CDM是另一种js模块化方案，它与AMD很类似，不同点在于：AMD推崇依赖前置，提前执行。
 * CDM推崇依赖就近、延迟执行。此规范其实是在sea.js推广过程中产生的
 */
/* AMD写法 */
define(['a', 'b', 'c', 'd'], function(a, b, c, d) {
  // 等于在最前面声明并初始化了要用到的所有模块
  d.doSomething()
  if (false) {
    // 即使没用到某个模块b, 但b还是提前执行了
    b.doSomething()
  }
})

/* CMD写法 */
define(function(require, exports, module) {
  let a = require('a') // 在需要时声明
  a.doSomething()
  if (false) {
    let b = require('b')
    b.doSomething()
  }
})

/* sea.js */
// 定义模块main.js
define(function(require, exports, module) {
  let $ = require('jquery.js')
  let add = function(a, b) {
    return a + b
  }
  exports.add = add
})
// 加载模块
seajs.use(['math.js'], function(math) {
  let sum = math.add(1, 2)
})

// ! ES6 Module
/**
 * es6在语法标准层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块方案
 * 其模块功能由两个命令构成export和import。
 * export命令用于规定模块对外接口，
 * import命令用于输入其他模块功能 
 */
/* 定义math.js */
let basicNum = 0
let add = (a, b) => a + b
export {basicNum, add}

/* 引入 */
import {basicNum, add} from './math'
function test(ele) {
  ele.textContent = add(99, basicName)
}

// ! ES6模块与CommonJS模块的差异
/** 
 * todo CommonJs模块输出的是一个值的拷贝，ES6模块输出的是值的引用
 * CommonJS模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值
 * ES6模块的运行机制与CommonJS不一样。JS引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用
 * 换句话说，ES6的import有点像Unix系统的‘符号连接’，原始值变了，import加载的值也会跟着变。因此，ES6模块是动态引用的
 * 并且不会缓存，模块里面的变量绑定其所有的模块 
 */
/** 
 * todo CommonJS模块是运行时加载，ES6模块是编译时输出接口
 * 运行时加载：CommonJS模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上读取方法，这种方式叫做“运行时加载”
 * 编译时加载：ES6模块不是对象，而是通过export命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值
 * 而不是加载整个模块，这种加载称为“编译时加载”
 */
