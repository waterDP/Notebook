const AxiosError = require("../core/AxiosError")

const validators = {}

const deprecatedWarnings = {}

['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type
  }
})

/**
 * Transitional option validater
 * @param {function|boolen} validator
 * @param {string} version
 * @param {string} message
 * @return {function}
 */
validators.transitional = function(validator, version, message) {
  function formatMessage(opt, desc) {
    message = message ? '. ' + message : ''
    return `[Axios v 0.27.2] Transitional option '${opt}'${desc}${message}`
  }
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? 'in' + version : '')),
        AxiosError.ERR_DEPRECATED
      )
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      )
    }

    return validator ? validator(value, opt, opts) : true
  }
}

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE)
  }
  const keys = Object.keys(options)
  let i = keys.length
  while (i-- > 0) {
    let opt = keys[i]
    let validator = schema[opt]
    if (validator) {
      let value = options[opt]
      let result = value === undefined || validator(value, opt, options)
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE)
      }
      continue
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option' + opt, AxiosError.ERR_BAD_OPTIONS)
    }
  }
}

module.exports = {
  assertOptions,
  validators
}