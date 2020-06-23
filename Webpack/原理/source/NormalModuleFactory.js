const NormalModule = require('./NormalModule')
class NormalModuleFactory {
  create(data) {
    return new NormalModule()
  }
}

module.exports = NormalModuleFactory