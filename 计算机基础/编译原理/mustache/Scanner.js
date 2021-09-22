/*
 * @Description: 扫描器类
 * @Date: 2021-07-22 12:00:41
 * @Author: water.li
 */
export default class Scanner {
  constructor(templateStr) {
    this.pos = 0
    this.templateStr = templateStr
    this.tail = templateStr
  } 
  // 就是走过指定内容，没有返回值
  scan(tag) {
    while (this.tail.indexOf(tag) === 0) {
      // tag有多长，比如{{的长度是2，就让指针后移多少位
      this.pos += tag.length
      this.tail = this.templateStr.substring(this.pos)
    }
  }
  // 让指针进行扫描，直到遇见指定内容结束，并且能够返回结束之前路过的文字
  scanUntil(stopTag) { 
    // 记录执行本方法的时候pos的值
    const pos_backup = this.pos
    while (!this.eos() && this.tail.indexOf(stopTag) !== 0) {
      this.pos++
      // 改变尾巴为当前指针这个字符开始，到最后的全部字符
      this.tail = this.templateStr.slice(this.pos)
    }
    return this.templateStr.substring(pos_backup, this.pos)
  }

  eos() {
    return this.pos >= this.templateStr.length
  }
}
