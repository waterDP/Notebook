"use strict";

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./ssl_server.key"),
  cert: fs.readFileSync("./ssl_server.cert"),
};

const app = https
  .createServer(options, (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("hello https\n");
  })
  .listen(443, "0.0.0.0");
