/*
 * @Author: water.li
 * @Date: 2025-02-02 12:13:02
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\index.js
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Hello Node.js' });
});

module.exports = router;
