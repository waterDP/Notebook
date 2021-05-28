/*
 * @Description: 
 * @Date: 2021-05-28 10:41:02
 * @Author: water.li
 */
// todo babel的API
/**
 * parse 阶段有@babel/parser,功能是把源码转成AST
 * transform 阶段有 @babel/traverse1，可以遍历AST，并调用visitor函数修改AST，修改ASR自然涉及到时AST的
 * 判断、创建、修改等，这时候就需要@babel/types了，当需要批量创建AST的时候可以使用@babel/template来简化AST创建逻辑
 * generate 阶段会把AST打印为目标代码字符串，同时生成sourcemap，需要@babel/generate包
 * 中途遇到错误想打印代码位置的时候，使用@babel/code-frame包
 * babel的整体功能通过@babel/core提供、基于上面的包完成babel整体的编译流程，并实现插件功能
 */

// ! @babel/parse
/**
 * parse和parseExpression两都都是把源码转成AST，不过parse返回的AST根节点是File(整个AST),  
 * parseExpression返回的AST根节点的Expression(表达式的AST), 粒度不同
 */

// ! @babel/traverse
/**
 * 如果 value 为函数，那么就相当于是 enter 时调用的函数。
 * 如果 value 为对象，则可以明确指定 enter 或者 exit 时的处理函数。
 */
visitor: {
  Identifier(path, state) { },
  StringLiteral: {
    enter(path, state) { },
    exit(path, state) { }
  }
}

// 进入 FunctionDeclaration 节点时调用
traverse(ast, {
  FunctionDeclaration: {
    enter(path, state) { }
  }
})

// 默认是进入节点时调用，和上面等价
traverse(ast, {
  FunctionDeclaration(path, state) { }
})

// 进入 FunctionDeclaration 和 VariableDeclaration 节点时调用
traverse(ast, {
  'FunctionDeclaration|VariableDeclaration'(path, state) { }
})

// 通过别名指定离开各种 Declaration 节点时调用
traverse(ast, {
  Declaration: {
    exit(path, state) { }
  }
})

/*
  ! path 是遍历过程中的路径，会保留上下文信息，有很多属性和方法，比如:

  path.node 指向当前 AST 节点
  path.get、path.set 获取和设置当前节点属性的 path
  path.parent 指向父级 AST 节点
  path.getSibling、path.getNextSibling、path.getPrevSibling 获取兄弟节点
  path.scope获取当前节点的作用域信息

  path.isXxx 判断当前节点是不是Xxx类型
  path.assetXxx 判断当前节点是不是Xxx类型，不是则抛出异常

  path.insertBefore path.insertAfter插入节点
  path.replaceWith path.replaceWithMultiple path.replaceWithSourceString 替换节点
  path.remove 删除节点

  path.skip跳过当前节点的子节点遍历
  path.shop结束后续遍历

  !state 
  则是遍历过程中在不同节点之间传递数据的机制，插件会通过state传递options和file信息，
  我们也可以通过state存储一点些遍历过程中的共享数据
 */
