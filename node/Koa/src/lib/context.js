let context = {

}

function defineGetter(target, key) {
  context.__defineGetter__(key, function() {
    return this[target][key]
  })
}

function defineSetter(target, key) {
  context.__defineSetter(key, function(value) {
    this[target][key] = value
  })
}

defineGetter('request', 'url')
defineGetter('request', 'path')
defineGetter('request', 'query')
defineGetter('response', 'body')
// 导入context
module.exports = context