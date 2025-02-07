/*
 * @Author: water.li
 * @Date: 2025-02-07 23:22:51
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\middlewares\user-auth.js
 */
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { UnauthorizedError } = require('../../utils/errors');
const { failure } = require('../../utils/responses');

/**
 * 验证身份令牌
 * @param {*} req
 * @param {*} res
 */
module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      throw new UnauthorizedError('当前接口需要谁才能访问');
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const { userId } = decoded
    const user = await User.findByPk(userId);
    if (!user) {
      throw new UnauthorizedError('用户不存在');
    }
    req.userId = userId;
    next()
  } catch (error) {
    failure(res, error);
  }
}