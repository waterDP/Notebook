"use strict";

const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const serveIndex = require("serve-index");

const app = express();
app.use(serveIndex("./www"));
app.use(express.static("./www"));

const options = {
  key: fs.readFileSync("./ssl_server.key"),
  cert: fs.readFileSync("./ssl_server.crt"),
};

const httpServer = http.createServer(app).listen(80, "0.0.0.0");

const httpsServer = https.createServer(options, app).listen(443, "0.0.0.0");
