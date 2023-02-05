class Scope {
  constructor(options = {}) {
    // 作用域的名称
    this.name = options.name;
    // 父作用域
    this.parent = options.parent;
    // 此作用域中定义的变量
    this.names = options.names || [];
  }
  add(name) {
    this.names.push(name);
  }
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this;
    }
    if (this.parent) {
      // 向上查找作用域
      return this.parent.findDefiningScope(name);
    }
    return null;
  }
}

module.exports = Scope;
