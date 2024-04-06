/*
 * @Author: water.li
 * @Date: 2024-04-06 17:26:53
 * @Description:
 * @FilePath: \Notebook\WebRTC\server.js
 */
"use strict";

const http = require("http");
const https = require("https");
const fs = require("fs");
const express = require("express");
const serveIndex = require("serve-index");
const sqlite3 = require("sqlite3");
const log4js = require("log4js");

const logger = log4js.getLogger();
logger.level = "info";

const app = express();
app.use(serveIndex("./www"));
app.use(express.static("./www"));

// const options = {
//   key: fs.readFileSync("./ssl_server.key"),
//   cert: fs.readFileSync("./ssl_server.crt"),
// };

const httpServer = http.createServer(app).listen(80, "0.0.0.0");

// const httpsServer = https.createServer(options, app).listen(443, "0.0.0.0");

function handleError(e) {
  logger.info(e);
}

// 数据库操作
const db = new sqlite3.Database("rtc.db", (e) => {
  if (e) {
    handleError(e);
  } else {
    logger.info("create database successfully");
  }
});

db.serialize(() => {
  db.run(
    "create table if not exists users(id integer primary key autoincrement, " +
      "name char(50) unique, pwd char(200))",
    (e) => {
      if (e) {
        handleError(e);
      } else {
        logger.info("create table users successfully");
      }
    }
  );

  // let sql = 'insert into users(name, pwd) values("kkb", "123")';
  // db.exec(sql, (e) => {
  //   if (e) {
  //     haddleError(e);
  //   } else {
  //     logger.info("insert successfully");
  //   }
  // });

  let sql = "select * from users";
  db.all(sql, (e, rows) => {
    if (e) {
      handleError(e);
    } else {
      logger.info(rows);
    }
  });
});
