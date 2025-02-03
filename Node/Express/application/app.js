/*
 * @Author: water.li
 * @Date: 2025-02-02 12:13:02
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\app.js
 */
/*
 * @Author: water.li
 * @Date: 2025-02-02 12:13:02
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\app.js
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 引入后台路由
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoryRouter = require('./routes/admin/categorys');
const adminSettingRouter = require('./routes/admin/settings');
const adminUserRouter = require('./routes/admin/users');

app.use('/admin/articles', adminArticlesRouter);
app.use('/admin/categories', adminCategoryRouter);
app.use('/admin/settings', adminSettingRouter);
app.use('/admin/users', adminUserRouter);

module.exports = app;
