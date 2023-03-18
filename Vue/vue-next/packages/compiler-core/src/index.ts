/*
 * @Author: water.li
 * @Date: 2023-03-15 22:38:17
 * @Description:
 * @FilePath: \Notebook\Vue\vue-next\packages\compiler-core\src\index.ts
 */

import { NodeType } from "./ast";

function createParserContext(template) {
  return {
    line: 1, // 行号
    column: 1, // 列号
    offset: 0, // 偏移量
    source: template, // 会不停的被截，直到字符串为空的时候
    originalSource: template,
  };
}

function getCursor(context) {
  let { line, column, offset } = context;
  return {
    line,
    column,
    offset,
  };
}

// 循环遍历模板的终止条件，如果为空说明遍历完毕
function isEnd(context) {
  const source = context.source;
  return !source;
}

function advancePositionWithMutation(context, source, endIndex) {
  let linesCount = 0; // 计算经过多少行
  let linePos = -1; // 遇到换行记录换行的开始位置
  for (let i = 0; i < endIndex; i++) {
    if (source[i].charCodeAt(0) === 10) {
      // 就是换行
      linesCount++;
      linePos = i;
    }
  }
  context.line += linesCount;
  context.offset = endIndex;
  context.column =
    linePos === -1 ? context.column + endIndex : endIndex - linePos;
}

function advanceBy(context, endIndex) {
  let source = context.source;
  advancePositionWithMutation(context, source, endIndex);
  context.source = source.slice(0, endIndex);
}

function parserTextData(context, endIndex) {
  const content = context.source.slice(0, endIndex);
  // 删除已经解析的内容
  advanceBy(context, endIndex);
  return content;
}

function parserText(context) {
  const endTokens = ["<", "{{"];
  const start = getCursor(context);
  let endIndex = context.source.length;
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i], 1);
    if (index > -1 && endIndex) {
      // 没到结束就遇到了{{ 或 <
      endIndex = index; // 用最近的作为结尾
    }
  }
  const content = parserTextData(context, endIndex);
  const end = getCursor(context);
  return {
    type: NodeType.TEXT,
    content,
    loc: getSelection(context, start, end),
  };
}

function getSelection(context, start, end) {
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset),
  };
}

function parseChildren(context) {
  const nodes = [];
  while (!isEnd(context)) {
    const s = context.source;
    let node;
    if (s[0] === "<") {
      // 可以对元素进行处理
      node = {};
    } else if (s.startsWith("{{")) {
      // 对表达式进行处理
      node = {};
    }
    if (!node) {
      // 文本
      node = parserText(context);
    }
    nodes.push(node);
    break;
  }
  return nodes;
}

function parser(template) {
  // 解析的时候 解析一点删除一点 解析的终止条件是模板的内容为空
  // 有限状态机
  const context = createParserContext(template);
  return parseChildren(context);
}

export function compile(template) {
  return parser(template);
}
