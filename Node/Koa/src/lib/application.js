/*
 * @Author: water.li
 * @Date: 2022-03-24 23:01:07
 * @Description:
 * @FilePath: \notebook\Node\Koa\src\lib\application.js
 */
const http = require("http");
const request = require("./request");
const response = require("./response");
const context = require("./context");
const EventEmitter = require("events");
const Stream = require("stream");

class Application extends EventEmitter {
  constructor() {
    super();
    this.handleRequest = this.handleRequest.bind(this);
    this.response = Object.create(response);
    this.request = Object.create(request);
    this.context = Object.create(context);

    this.middlewares = []; // 存放所有的use方法
  }
  use(callback) {
    this.middlewares.push(callback);
  }
  createContext(req, res) {
    // 每次请求的上下文是应该独立的
    let response = Object.create(this.response);
    let request = Object.create(this.request);
    let context = Object.create(this.context);

    context.request = request;
    context.response = response;
    context.request.req = context.req = req;
    context.response.res = context.res = res;

    return context;
  }
  compose(ctx) {
    let count = -1;
    // 默认将middlewares里的第一个执行
    const dispatch = (index) => {
      let middleware = this.middlewares[index];

      if (index === count) {
        return Promise.reject(new Error("next() called multiple times"));
      }

      count = index;

      if (index === this.middlewares.length) {
        return Promise.resolve();
      }
      // 如果执行完毕后 有可能返回的不是promise
      // 链式等待，默认先执行第一个 之后，如果用户调用了async-await
      try {
        return Promise.resolve(middleware(ctx, () => dispatch(index + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    };
    return dispatch(0);
  }
  handleRequest(req, res) {
    // 请示到来时，需要调用use方法
    // 通过请求+响应+自己封装的request和response组成一个当前请求的上下文
    let ctx = this.createContext(req, res);
    res.statusCode = 404;
    //组合多个函数
    this.compose(ctx)
      .then(() => {
        let body = ctx.body;
        // 默认是字符串或者buffer
        if (typeof body === "string" || Buffer.isBuffer(body)) {
          res.end(body);
        }
        // 流 需要下载此文件
        else if (body instanceof Stream) {
          // 下载头
          res.setHeader(
            "Content-Disposition",
            `attachment;filename=fileName.js`
          );
          body.pipe(res);
        }
        // 是一个对象
        else if (typeof body === "object") {
          res.end(JSON.stringify(body));
        }
        // 数字
        else if (typeof body === "number") {
          res.end(body + "");
        } else {
          res.end("Not Found");
        }
        res.end(ctx.body); // 最终拿到用户设置的结果 将结果返回即可
      })
      .catch((err) => {
        this.emit("error", err);
      });
  }
  listen(...args) {
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(...args);
  }
}

module.exports = Application;
