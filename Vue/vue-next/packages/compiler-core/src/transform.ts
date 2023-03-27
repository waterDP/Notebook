import { PatchFlags } from "packages/shared/src/patchFlags";
import { NodeType } from "./ast";
import { TO_DISPLAY_STRING, createCallExpression } from "./runtimeHelper";

function transformExpression(node, context) {
  if (node.type === NodeType.INTERPOLATION) {
    console.log("表达式", node);

    // 给表达式增加this指向
    node.content.content = `_ctx.${node.content.content}`;
  }
}

function transformElement(node, context) {
  if (node.type === NodeType.ELEMENT) {
    console.log("元素", node);
    return () => {
      // 退出函数
      console.log("元素的退出函数");
    };
  }
}

function isText(node) {
  return node.type === NodeType.INTERPOLATION || node.type === NodeType.TEXT;
}

function transformText(node, context) {
  if (node.type === NodeType.ROOT || node.type === NodeType.ELEMENT) {
    return () => {
      console.log("文本退出");
      let hasText = false;
      const children = context.children;
      let currentContainer;
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (isText(child)) {
          hasText = true;
          for (let j = i + 1; j < children.length; j++) {
            const nextNode = children[i];
            if (isText(nextNode)) {
              // 将两个节点合并到一起
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeType.COMPOUND_EXPRESSION, // 组合表达式
                  children: [child],
                };
              }
              currentContainer.children.push("+", nextNode);
              children.splice(j, 1);
              j--;
            } else {
              currentContainer = null;
              break; // 遇到了元素的时候 需要跳出
            }
          }
        }
      }
      if (!hasText || children.length == 1) {
        return;
      }
      // 对于文本 我们需要采用createTextNode来进行方法生成
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isText(child) || child.type === NodeType.COMPOUND_EXPRESSION) {
          const callArgs = [];
          callArgs.push(child);
          if (child.type !== NodeType.TEXT) {
            callArgs.push(PatchFlags.TEXT + "");
          }
          children[i] = {
            type: NodeType.TEXT_CALL,
            content: child,
            codegenNode: createCallExpression(context, callArgs),
          };
        }
      }
    };
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
  const exitsFns = [];
  for (let i = 0; i < transforms.length; i++) {
    const exitFn = transforms[i](node, context);
    if (exitFn) {
      exitsFns.push(exitFn);
    }
  }
  switch (node.type) {
    case NodeType.ROOT:
    case NodeType.ELEMENT:
      for (let i = 0; i < node.children.length; i++) {
        context.parent = node;
        traverseNode(node.children[i], context);
      }
      break;
    case NodeType.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
  }
  // 整个儿子执行完毕后，依次调用退出函数
  let len = exitsFns.length;
  context.currentNode = node;
  while (len--) {
    exitsFns[len]();
  }
}

export function transform(root) {
  const context = createTransformContext();
  traverseNode(root, context);
}
