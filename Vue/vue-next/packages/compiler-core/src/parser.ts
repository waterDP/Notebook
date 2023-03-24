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
  if (source.startsWith("</")) {
    return true;
  }
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
  context.source = source.slice(endIndex);
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

function parserInterpolation(context) {
  const start = getCursor(context); // 表达式的开始信息
  const closeIndex = context.source.indexOf("}}", 2);
  advanceBy(context, 2); // 删除了{{
  const innerStart = getCursor(context);
  const rawContentEndIndex = closeIndex - 2;
  // 获取去空格之前的内容
  const preTrimContent = parserTextData(context, rawContentEndIndex);
  const innerEnd = getCursor(context);
  const content = preTrimContent.trim();
  advanceBy(context, 2); // 删除了}}
  const end = getCursor(context);
  return {
    type: NodeType.INTERPOLATION,
    content: {
      type: NodeType.SIMPLE_EXPRESSION,
      isStatic: false,
      content, // ! 内容
      loc: getSelection(context, innerStart, innerEnd),
    },
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

function advanceBySpaces(context) {
  const match = /^[\t\r\n]+/.exec(context.source);
  if (match) {
    advanceBy(context, match[0].length); // 删除所有空格
  }
}

function parseAttributeValue(context) {
  // 必须要有引号
  const quote = context.source[0];
  const isQuoted = quote === "'" || quote === '"';
  let content;
  if (isQuoted) {
    advanceBy(context, 1);
    const endIndex = context.source.indexOf(quote);
    content = parserTextData(context, endIndex);
    advanceBy(context, 1);
  }
  return content;
}

function parseAttribute(context) {
  const start = getCursor(context);

  const match = /^[\t\r\n\f />][^\t\r\n\f />=]*/;
  const name = match[0]; // 获取属性名
  advanceBy(context, name.length);
  let value;
  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    advanceBySpaces(context);
    advanceBy(context, 1);
    advanceBySpaces(context);
    value = parseAttributeValue(context);
  }
  const end = getCursor(context);
  return {
    type: NodeType.ATTRIBUTE,
    name,
    value: {
      content: value,
    },
    loc: getSelection(context, start, end),
  };
}

/**
 * 解析属性
 * @param context
 */
function parseAttributes(context) {
  // 解析属性
  const props = [];

  while (!context.source.startsWith(">")) {
    // 遇到>就停止循环
    const prop = parseAttribute(context);
    props.push(prop);
    advanceBySpaces(context);
  }

  return props;
}

function parserTag(context) {
  const start = getCursor(context);
  const match = /^<\/?([a-z][^\t\r\n/>]*)/.exec(context.source);
  const tag = match[1]; // 'div'
  advanceBy(context, match[0].length);
  advanceBySpaces(context);

  // 处理元素上的属性
  let props = parseAttributes(context);

  let isSelfClosing = context.source.startsWith("/>");
  advanceBy(context, isSelfClosing ? 2 : 1);
  const end = getCursor(context);
  return {
    type: NodeType.ELEMENT,
    isSelfClosing,
    tag,
    props,
    loc: getSelection(context, start, end),
  };
}

function parserElement(context) {
  let node = parserTag(context);
  (node as any).children = parseChildren(context);

  if (context.source.startsWith("</")) {
    parserTag(context); // 删除标签的闭合标签 没有收集
  }
  const end = getCursor(context);
  node.loc = getSelection(context, node.loc.start, end);
  return node;
}

function parseChildren(context) {
  const nodes = [];
  while (!isEnd(context)) {
    const s = context.source;
    let node;
    if (s[0] === "<") {
      // 可以对元素进行处理
      node = parserElement(context);
    } else if (s.startsWith("{{")) {
      // 对表达式进行处理
      node = parserInterpolation(context);
    }
    if (!node) {
      // 文本
      node = parserText(context);
    }
    nodes.push(node);
  }
  // 如处理后的节点 如果是文本 多个空格应该合并成一个
  // 如果解析后的结果是纯空格 则直接移除就即可
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === NodeType.TEXT) {
      if (!/[\t\r\n\f ]/.test(node.content)) {
        nodes[i] = null;
      } else {
        node.content = node.content.replace(/[\t\r\n\f    ]+/g, " ");
      }
    }
  }
  return nodes.filter(Boolean);
}

function createRoot(children, loc) {
  return {
    type: NodeType.ROOT,
    children,
    loc,
  };
}

export function parser(template) {
  // 解析的时候 解析一点删除一点 解析的终止条件是模板的内容为空
  // 有限状态机
  const context = createParserContext(template);
  const start = getCursor(context);
  const children = parseChildren(context);
  const end = getCursor(context);
  const loc = getSelection(context, start, end);
  return createRoot(children, loc);
}
