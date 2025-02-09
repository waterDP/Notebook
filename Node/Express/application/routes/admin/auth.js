/*
 * @Author: water.li
 * @Date: 2025-02-07 20:30:39
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\auth.js
 */
const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const { BadRequest, Unauthorized, NotFound } = require('http-errors');
const { success, failure } = require('../../utils/responses');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
  try {
    const { login, password } = req.body

    if (!login) {
      throw new BadRequest('登录名不能为空。')
    }
    if (!password) {
      throw new BadRequest('密码不能为空。')
    }
    const condition = {
      where: {
        [Op.or]: [
          { username: login },
          { email: login }
        ]
      }
    }
    const user = await User.findOne(condition)
    if (!user) {
      throw new NotFound('用户不存在。')
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new Unauthorized('密码错误。')
    }
    if (user.role !== 100) {
      throw new Unauthorized('您不是管理员，没有权限登录管理员后台。')
    }
    // 生成身份令牌
    const token = jwt.sign({
      userId: user.id
    }, process.env.SECRET, { expiresIn: '30d'/* 有效期30天 */ })
    success(res, '登录成功。', { token });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;