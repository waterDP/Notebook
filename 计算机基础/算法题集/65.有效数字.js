/*
 * @lc app=leetcode.cn id=65 lang=javascript
 *
 * [65] 有效数字
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
/**
 * @param {string} s
 * @return {boolean}
 */
var isNumber = function (s) {
  const STATE_INITIAL = 'STATE_INITIAL', // 初始状态
    STATE_INT_SIGN = 'STATE_INT_SIGN', // 符号位
    STATE_INTEGER = 'STATE_INTEGER', // 整数部分
    STATE_POINT = 'STATE_POINT', // 小数点，有左侧整数的。
    STATE_POINT_WITHOUT_INT = 'STATE_POINT_WITHOUT_INT', // 小数点，没有左侧整数的那种
    STATE_FRACTION = 'STATE_FRACTION', // 小数部分，左边没整数的
    STATE_EXP = 'STATE_EXP', // 指数部分 的 e
    STATE_EXP_SIGN = 'STATE_EXP_SIGN', // 指数部分的 符号位
    STATE_EXP_NUMBER = 'STATE_EXP_NUMBER', // 指数部分的 整数
    STATE_END = 'STATE_END', // 结束

    CHAR_NUMBER = 'CHAR_NUMBER', // 数字 字符
    CHAR_EXP = 'CHAR_EXP', //指数 字符
    CHAR_POINT = 'CHAR_POINT', // 小数点 字符
    CHAR_SIGN = 'CHAR_SIGN', // 符号 字符
    CHAR_ILLEGAL = 'CHAR_ILLEGAL' // 非法 字符

  const getCharType = ch => {
    switch (ch) {
      case '+':
      case '-':
        return CHAR_SIGN;
      case '.':
        return CHAR_POINT;
      case 'e':
      case 'E':
        return CHAR_EXP;
      default:
        let code = ch.charCodeAt();
        if (code >= 48 && code <= 57) {
          return CHAR_NUMBER;
        } else {
          return CHAR_ILLEGAL;
        }
    }
  };

  // 状态转移规则
  const transfer = {
    // 初始状态时，下一个字符类型可以是：数字，小数点(左侧无整数)，符号位，
    STATE_INITIAL: {
      CHAR_NUMBER: STATE_INTEGER,
      CHAR_POINT: STATE_POINT_WITHOUT_INT,
      CHAR_SIGN: STATE_INT_SIGN,
    },
    // 当前是符号位时，下一个字符类型可以是：数字，小数点
    STATE_INT_SIGN: {
      CHAR_NUMBER: STATE_INTEGER,
      CHAR_POINT: STATE_POINT_WITHOUT_INT,
    },
    // 当前是数字状态时，下一个字符类型：整数，小数点，指数 e
    STATE_INTEGER: {
      CHAR_NUMBER: STATE_INTEGER,
      CHAR_POINT: STATE_POINT,
      CHAR_EXP: STATE_EXP,
    },
    // 当前状态小数点，下个字符类型：整数(小数的整数)，指数 e
    STATE_POINT: {
      CHAR_NUMBER: STATE_FRACTION,
      CHAR_EXP: STATE_EXP,
    },
    // 当前状态小数点(左侧无整数)，下个字符类型：整数(小数的整数)
    STATE_POINT_WITHOUT_INT: {
      CHAR_NUMBER: STATE_FRACTION,
    },
    // 当前状态小数部分(小数的整数)，下个字符类型：整数(小数的整数)，指数 e
    STATE_FRACTION: {
      CHAR_NUMBER: STATE_FRACTION,
      CHAR_EXP: STATE_EXP,
    },
    // 当前状态指数 e，下个字符类型：指数的符号，指数的整数，
    STATE_EXP: {
      CHAR_SIGN: STATE_EXP_SIGN,
      CHAR_NUMBER: STATE_EXP_NUMBER,
    },
    // 当前状态指数e的符号，下个字符类型：指数的整数部分
    STATE_EXP_SIGN: {
      CHAR_NUMBER: STATE_EXP_NUMBER,
    },
    // 当前状态指数e的整数，下个字符类型：指数的整数部分
    STATE_EXP_NUMBER: {
      CHAR_NUMBER: STATE_EXP_NUMBER,
    },
  }

  // st是记录参数字符的状态情况。
  let st = STATE_INITIAL;

  for (let i = 0; i < s.length; i++) {
    const charType = getCharType(s[i]);
    // 如果当前字符，是非法字符，或者不符合状态转移规则，则直接return false，结束遍历。
    if (charType === CHAR_ILLEGAL || !transfer[st][charType]) {
      return false;
    } else {
      st = transfer[st][charType];
    }
  }

  // 符合规则的结束情况。
  const finals = [
    STATE_INTEGER,
    STATE_POINT,
    STATE_FRACTION,
    STATE_EXP_NUMBER,
    STATE_END
  ]
  return finals.includes(st)
}
// @lc code=end

