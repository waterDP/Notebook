const alias = {
  js: "application/javascript",
  css: "text/css",
  html: "text/html",
  json: "appliction/json",
};

function send(req, res, content, type) {
  res.setHeader("Content-Type", alias[type]);
  res.statusCode = 200;
  return res.end(content);
}
module.exports = send;
