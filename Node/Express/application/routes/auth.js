/*
 * @Author: water.li
 * @Date: 2025-02-07 23:13:43
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\auth.js
 */

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { success, fail } = require('../utils/response');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

/**
 * 用户注册 
 */
router.post('/sign_up', async (req, res) => {
  try {
    const body = {
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname,
      sex: 2,
      role: 0
    }
    const user = await User.create(body)
    delete user.dataValues.password
    success(res, '注册成功。', { user }, 200)
  } catch (error) {
    fail(res, error)
  }
})

router.post('/sign_in', async (req, res) => {
  try {
    const { login, password } = req.body

    if (!login) {
      throw new BadRequestError('登录名不能为空。')
    }
    if (!password) {
      throw new BadRequestError('密码不能为空。')
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
      throw new NotFoundError('用户不存在。')
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedError('密码错误。')
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


