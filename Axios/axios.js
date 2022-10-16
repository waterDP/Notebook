/*
 * @Author: water.li
 * @Date: 2022-10-16 19:50:33
 * @Description: 
 * @FilePath: \note\Axios\axios.js
 */
const Axios = require('./core/Axios')
const mergeConfig = require('./core/mergeConfig')
const defaults = require('./defaults')
const bind = require('./helpers/bind')
const utils = require('./utils')

function createInstance(defaultConfig) {
  let context = new Axios(defaultConfig)
  
  // context is request this
  let instance = bind(Axios.prototype.request, context) 
 
  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context)

  // Copy context to instance 
  utils.extend(instance, context)

  instance.create = function(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig))
  }
  
  return instance
}

let axios = createInstance(defaults)


module.exports = axios
module.exports.default = axios