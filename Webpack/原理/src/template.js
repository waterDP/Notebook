!function(modules) {
  // 缓存
  const installModules = {}
  function __webpack_require__(moduleId) {
    // 是否缓存
    if (installModules[moduleId]) {
      return installModules[moduleId].exports
    }
    let modules = installModules[moduleId] = {
      exports: {}
    }
    modules[moduleId].call(modules.exports, module, exports, __webpack_require__)
    return module.exports
  }
  // 入口
  return __webpack_require__('__entry__')
}(__modules_content__)