'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  // todo 创建一个Axios实例
  var context = new Axios(defaultConfig);
  // 以下代码也可以这样实现let instance = Axios.prototype.request.bind(context)
  // 这样instance就指向了request方法，且上下文指向context，所以可以直接以instance(option)方法调用 
  // Axios.prototype.request内对第一个参数的数据类型判断，使我们能够以instance(url, option)方式调用
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  // todo: 把Axios.prototype上的方法扩展到instance对象上
  // 这样instance就有了get, post, put等方法
  // 并指定上下文为context,这样执行Axios原型链上的方法时，this也会指向context
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  // todo 把context对象上的自身属性和方法扩展到instance上
  // 注：因为extend内部使用的forEach方法对对象做for in遍历时，只遍历对象本身的属性，而不会遍历原型链上的属性
  // 这样，instance就有了 defaults interceptors属性
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
