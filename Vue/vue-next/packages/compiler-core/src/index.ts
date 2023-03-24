/*
 * @Author: water.li
 * @Date: 2023-03-15 22:38:17
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\compiler-core\src\index.ts
 */
import { NodeType } from "./ast";
import { parser } from "./parser";

function transformExpression(node, context) {
  if (node.type === NodeType.INTERPOLATION) {
    console.log("表达式", node);
  }
}

function transformElement(node, context) {
  if (node.type === NodeType.ELEMENT) {
    console.log("元素", node);
  }
}

function transformText(node, context) {
  if (node.type === NodeType.TEXT || node.type === NodeType.INTERPOLATION) {
    console.log("文本", node);
  }
}

function createTransformContext() {
  const context = {
    currentNode: null,
    parent: null,
    helpers: new Map(), // 用于存储用到的方法
    helper(name) {
      const count = context.helpers.get(name) || 0;
      context.helpers.set(name, count + 1);
      return name;
    },
    removeHelper(name) {
      const count = context.helpers.get(name);
      const currentCount = count - 1;
      if (!currentCount) {
        context.helpers.delete(name);
      } else {
        context.helpers.set(name, currentCount);
      }
    },
    nodeTransform: [
      // 稍后我会遍历树，拿到节点调用这些转换方法进转换
      transformExpression,
      transformElement,
      transformText,
    ],
  };
  return context;
}

function traverseNode(node, context) {
  context.currentNode = node;
  const transforms = context.nodeTransform; // 获取所有的转换方法
  for (let i = 0; i < transforms.length; i++) {
    transforms[i](node, context);
  }
  switch (node.type) {
    case NodeType.ROOT:
    case NodeType.ELEMENT:
      for (let i = 0; i < node.children.length; i++) {
        context.parent = node;
        traverseNode(node.children[i], context);
      }
  }
}

function transform(root) {
  const context = createTransformContext();
  traverseNode(root, context);
}

export function compile(template) {
  const ast = parser(template); // 对模板AST生产
  transform(ast);
}
