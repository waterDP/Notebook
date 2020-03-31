function _instanceof (obj, Con) {
  Con = Con.prototype
  obj = obj.__proto__
  while(true) {
    if (obj === null) {
      return false
    }
    if (obj === Con) {
      return true
    }
    obj = obj.__proto__
  }
}

class ValidateStr {
  static [symbol.hasInstanceOf](x) {
    return typeof x === 'string'
  }
}

console.log('hello' instanceof ValidateStr)