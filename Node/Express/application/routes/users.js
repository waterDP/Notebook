/*
 * @Author: water.li
 * @Date: 2025-02-09 10:15:30
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\users.js
 */
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFound } = require('http-errors');

/**
 * 查询当前登录用户详情
 * GET /users/me
 */
router.get('/me', async function (req, res) {
  try {
    const user = await getUser(req);
    success(res, '查询当前用户信息成功。', { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 公共方法：查询当前用户
 */
async function getUser(req, showPassword = false) {
  const id = req.userId;

  let condition = {}

  if (!showPassword) {
    condition = {
      attribultes: {
        exclude: ['password']
      }
    }
  }

  const user = await User.findByPk(id, condition);

  if (!user) {
    throw new NotFound(`ID: ${id}的用户未找到。`)
  }

  return user;
}

/**
 * 更新用户信息
 * PUT /users/me
 */
router.put('/info', async function (req, res) {
  try {
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar
    }
    const user = await getUser(req);
    await user.update(body);
    success(res, '更新用户信息成功。', { user });
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 理析账号信息
 * PUT /users/account 
 */
router.put('/account', async function (req, res) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      currentPassword: req.body.currentPassword,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    }
    if (!body.currentPassword) {
      throw new BadRequest('请输入当前密码。')
    }
    if (body.password !== body.passwordConfirmation) {
      throw new BadRequest('两次输入的密码不一致。')
    }
    // 加上true参数，可以查询到加密后的密码
    const user = await getUser(req, true);
    // 验证密码
    const isPasswordValid = bcrypt.compareSync(body.currentPassword, user.password)
    if (!isPasswordValid) {
      throw new BadRequest('当前密码不正确。')
    }
    await user.update(body)
    // 密码不回显
    delete user.dataValues.password
    success(res, '更新用户信息成功。', { user });
  } catch (error) {
    failure(res, error)
  }
})

module.exports = router;
