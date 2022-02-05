/*
 * @Description: 正则表达式 
 * @Date: 2021-08-03 09:36:22
 * @Author: water.li
 * 
 */

/*
 * 元字符
 *
 * 量词元字符
 * *       零到多次
 * +       一到多次
 * ?       零次或一次
 * {n}     出现n次
 * {n,}    出现n次到多次
 * {n, m}  出现n次到m次
 * 
 * 特殊元字符
 * \       转义字符
 * .       除\n(换行符)以外的任意字符
 * ^       以某一个为开始
 * $       以某一个为结束
 * \n      换行符
 * \d      0~9之间的数字
 * \D      非0~9之间的一个数字
 * \w      数字、字母、下划线中的任意一个字符
 * \s      一个空白符（包含空格、制表符、换页符等）
 * \t      一个制表符（一个TAB键：四个空格）
 * \b      匹配一个单词的边界
 * x|y     x或者y中的一个字符
 * [xyz]   x或者y或者z中的一个字符
 * [^xy]   除了x|y以外的任意字符
 * [a-z]   指定a到z这一个范围中的任意字符
 * [^a-z]  非a-z
 * ()      正则中的分组符号
 * (?:)    只匹配不捕获
 * (?=)    正向预查
 * (?!)    负向预查
 * 
 * []中出现的字符一般都代表本身的含义  \d在[]中还是代表0~9
 * 
 */

/*
 * 修饰符
 * i => ignoreCase   忽略单词大小写匹配
 * m => multiline    可以进行多行匹配
 * g => global       全局匹配
 */

/*
 * 常用表达式
 * 1.验证是否为有效数字
 * /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/
 * 2.汉字
 * /^[\u4E00-\u9FA5]$/
 */

/*
 * 正则的捕获
 * reg.lastIndex: 当前正则下一次匹配的起始索引位置
 * 懒惰性捕获的原因：默认情况下lastIndex的值不会实修改，每一次都是从字符串开始位置开始查找，所以记录只是第一个
 * 
 * 实现正则捕获的方法
 * 1.正则RegExp.prototype上的方法
 * exec
 * test
 * 2.字符串String.prototype上支持正则表达式处理的方法
 * replace
 * match
 * split
 * ...
 */
// 多次匹配的情况下，match只能把大正则匹配的内容获取到，小分组匹配的信息无法获取
let str = '{0}年{1}月{2}日'
let reg = /\{\d+\}/g
let aryBig = [], argSmall = [], res = reg.exec(str)
while (res) {
  let [big, small] = res
  aryBig.push(big)
  argSmall.push(small)
  res = reg.exec(str)
}

// 分组引用
let str = 'book'
let reg = /^[a-zA-Z]([a-zA-Z])\1[a-zA-Z]$/
// 分组引用就是通过"\数字"让其代表和对应分组出现一模一样的内容


// 正则捕获的贪婪性，默许情况下，正则捕获的时候，是按照当前正则所匹配的最长结果来获取的
const reg= /\d+?/ // ? 在量词元字符后面设置？，取消捕获时候贪婪性（按照正则匹配的最短的结果来获取）

/**
 * todo 问号在正则中的五大作用 
 * 问号左边是非量词元字符：本身代表量词元字符，出现零到一次
 * 问号左边是量词元字符：取消捕获时候的贪婪性
 * (?:)只匹配不捕获
 * (?=)正向预查
 * (?!)负向预查 
 */

let time = '2019-08-13'
// 变为 "2019年08月13"
let reg = /^(\d{4})-(\d{1,2})-(\d{2})$/g
time = time.replace(reg, `$1年$2月$3日`)

time.replace(reg, (big, $1, $2, $3)=> {
  return `${$1}年${$2}月${$3}日` 
})

// 单词首字母大写
let str = 'good good study, day day up!'
let reg = /\b([a-zA-Z])[a-zA-Z]*\b/g
str = str.replace(reg, (content, $1) => {
  return $1.toUpperCase() + content.substring(1)
})
console.log(str)

// 验证一个字符串中那个这字母出现的次数最多，多少次

// 方法一
let str = 'zhididishiwcniasiidhidfv'
let max = 0, maxChar = ''
let map = {}
Array.prototype.forEach.call(str, char => {
  if (map.hasOwnProperty(char)) {
    map[char]++
  } else {
    map[char] = 1
  }
  if (map[char] > max) {
    max = map[char]
    maxChar = char
  }
})

// 方法二
str = str.split('').sort((a, b) => a.localeCompare(b)).join('')
let reg = /[a-zA-Z]\1+/g
let arr = str.match(reg).sort((a, b) => b.length - a.length)

// ^数字格式化 正向预查
let f = '9999999999'.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
console.log(f) // '9,999,999,999'

// ^常用的正则表达式
/*
 * 有效数字
 * 规则分析
 * 1.可能出现+-号，也可能不出现
 * 2.一位0~9都可以，多位首位不能为0
 * 3.小数部分可能有也可能没有，一旦有后面必须有小数点+数字 
 */
let reg = /^[+-]?(\d|[1-9]\d+)(\.\d+)?$/


/*
 * 验证密码
 * 数字、字母、下划线 6~16位
 */
let reg = /^\w{6,16}$/

/* 
 * 汉字
 */
let reg = /^[\u4E00-\u9FA5]$/

/*
 * 验证邮箱
 */
let reg = /^\w((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
// => \w+((-\w+)|(\.\w+))* 
// 1 开头是数字 字母 下划线（1到多位）
// 2 还可以是-数字字母下划线 或者.数字字母下划线 整体0到多位
// 邮箱的名字由“数字、字母、下划线，- .”几部分组成，但是-与.不能连续出现，也不能开头
// => @[A-Za-z0-9]+
// 1，@后面紧跟着的是数字字母，0~多位
// => ((\.|-)[A-Za-z0-9]+)*
// 1. 对@后面名字的补充
// 多域名 .com.cn
// => \.[A-Za-z0-9]+
// xxx.com / xxx.cn 这个匹配的是最后的域名

/*
 * 身份证号码
 * 1 一共18位
 * 2 最后一位可能是X
 * 身份证前六位是省市县
 * 中间八位是出生年月日
 * 最后四位
 *   最后一位X或数字
 *   倒数第二位 偶数是女，奇数是男
 *   其余的是经过算法算出来的
 */
let reg = /^(\d{6})(\d{4})(\d{2})(\d{2})\d{2}(\d)(\d|X)$/