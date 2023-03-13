const babel = require("@babel/core");
const types = require("@babel/types");

const code = `
  const sum = (a, b) => {
    console.log(this)
    return a + b
  }
  const sum1 = (a, b) => a + b
`;
const transformArrow = {
  visitor: {
    ArrowFunctionExpression(path) {
      const { node } = path;
      hoistFunctionEnvironment(path);
      node.type = "FunctionExpression";
      const { body } = node;
      // 处理直接返回的箭头函数
      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)]);
      }
    },
  },
};

function hoistFunctionEnvironment(path) {
  // 确定当前箭头函数要使用哪个this
  // 原理是从当前的节点向上查找，查找到一个不是箭头函数的函数，或者是根节点
  const thisEnv = path.findParent((parent) => {
    return (
      (parent.isFunction() && !path.isArrowFunction()) || parent.isProgram()
    );
  });
  let thisBindings = "_this";
  let thisPaths = getThisPath(path);
  if (thisPaths.length > 0) {
    thisEnv.scope.push({
      id: types.identifier(thisBindings), // 用来生成一些节点 生成标识符节点
      init: types.thisExpression(), // 生成this节点
    });
  }
  thisPaths.forEach((thisPath) => {
    // this => _this
    thisPath.replaceWith(types.identifier(thisBindings));
  });
}

function getThisPath(path) {
  let thisPaths = [];
  path.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    },
  });
  return thisPaths;
}

const result = babel.transform(code, {
  plugins: [transformArrow],
});

console.log(result.code);
