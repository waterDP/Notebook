class Scope {
  constructor(options = {}) {
    // 作用域的名称
    this.name = options.name;
    // 父作用域
    this.parent = options.parent;
    // 此作用域中定义的变量
    this.names = options.names || [];
    // 表示这个作用域是不是一个块级作用域
    this.isBlock = !!options.isBlock;
  }
  add(name, isBlockDeclaration) {
    // 如果此变量不是块级变量var 并且当前作用域是块级作用域
    if (!isBlockDeclaration && this.isBlock) {
      this.parent.add(name, isBlockDeclaration);
    } else {
      this.names.push(name);
    }
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
