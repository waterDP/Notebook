const url = require('url')

let request = { 
  get url() {
    return this.req.url
  },
  get path() {
    return url.parse(this.res.url).pathname
  },
  get query() {
    return url.parse(this.req.url).query
  }
}

// 导入request对象
module.exports = request