/*
 * @Author: water.li
 * @Date: 2022-12-22 20:54:59
 * @Description:
 * @FilePath: \Notebook\Node\Koa\middleware\koa-views.js
 */
const fs = require("fs").promise;
const path = require("path");

const render = (template, data) => {
  /* ... */
};

const views = (dirname, { map }) => {
  return async (ctx, next) => {
    ctx.render = async (filename, data) => {
      let str = await fs.readFile(
        path.join(dirname, filename) + ".html",
        "utf8"
      );
      ctx.body = render(str, data);
    };
    await next();
  };
};

module.exports = views;
