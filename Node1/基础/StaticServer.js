// http-server
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const {
  createReadStream,
  createWriteStream,
  readFileSync,

} = require('fs');

// 第三方模块
const mime = require('mime');
const chalk = require('chalk');
const nunjucks = require('nunjucks')

// let templateStr = readFileSync(path.resolve(__dirname,'template.html'),'utf8');

class Server {
  constructor(config) {
    this.port = config.port;
    this.dir = config.dir;
    // this.templateStr = templateStr; // 把模板的字符串 挂载到当前的实例上
  }
  /**
   * 处理请求的方法
   */
  async handleRequest(req, res) { // 1) 通过箭头函数修改this  bind更改this
    // this
    let {
      pathname
    } = url.parse(req.url);
    pathname = decodeURIComponent(pathname)
    // if(pathname === '/favicon.ico') return res.end(`Not Found`);
    let absPath = path.join(this.dir, pathname);
    try {
      let statObj = await fs.stat(absPath);
      if (statObj.isFile()) {
        this.sendFile(absPath, req, res, statObj);
      } else {
        // 需要列出所有文件夹的内容
        // 列出文件夹内容

        let children = await fs.readdir(absPath);
        // 数据  + 模板引擎 ejs nunjucks
        // a b c
        children = children.map(item => {
          return {
            current: item,
            parent: path.join(pathname, item) // 将自己的当前的路径 和 文件名进行拼接 组成一个新的连接
          }
        });
        console.log(path.resolve(__dirname, 'template.html'))
        let templateStr = nunjucks.render(path.resolve(__dirname, 'template.html'), {
          items: children
        });
        res.setHeader('Content-Type', 'text/html;charset=utf8');
        res.end(templateStr);
      }
    } catch (e) {
      console.log(e);
      this.sendError(e, res);
    }
  }
  hasCache(currentPath, req, res, statObj) {
    // 静态服务的功能 ，尽可能全部缓存  http-server -c-1

    // 缓存的页面 首屏有很多数据 很多接口
    // 模板 + 数据进行渲染 =》 客e户端  rdis

    // spa => ssr + 预渲染 + loading  + 合并接口 + cdn加载资源 

    // 加一次缓存
    // 强制缓存
    res.setHeader('Cache-Control', 'max-age=10');
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());
    // 对比缓存
    let ctime = statObj.ctime.toGMTString()
    res.setHeader('Last-Modified', ctime);
    let content = readFileSync(currentPath, 'utf8');
    let etag = require('crypto').createHash('md5').update(content).digest('base64');
    res.setHeader('Etag', etag)

    // 第二次访问的时候 取值
    let ifModifiedSince = req.headers['if-modified-since'];
    let ifNoneMatch = req.headers['if-none-match'];
    // 可能一秒内 改变了多次
    if (ifModifiedSince !== ctime) { // 如果当前用户传递过来的 和 当前状态不一样说明没有缓存
      return false;
    }
    // 在比较内容
    if (etag !== ifNoneMatch) {
      return false;
    }
    return true;
  }
  sendFile(currentPath, req, res, statObj) {
    if (this.hasCache(currentPath, req, res, statObj)) {
      res.statusCode = 304;
      return res.end();
    }
    res.setHeader('Content-Type', mime.getType(currentPath) + ';charset=utf8');
    createReadStream(currentPath).pipe(res);
  }
  sendError(err, res) { // 发射错误
    res.statusCode = 404;
    res.end(`Not Found`)
  }
  start() {
    // 发布订阅 
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(
        `
          ${chalk.yellow('Starting up http-server, serving')}./${this.dir.split('\\').pop()}
          Available on:
          http://127.0.0.1:${chalk.green(this.port)}
          Hit CTRL-C to stop the server
        `
      );
    })
  }
}

module.exports = Server;
