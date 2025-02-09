const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { Unauthorized } = require('http-errors');
const { success, failure } = require('../../utils/responses');

/**
 * 验证身份令牌
 * @param {*} req
 * @param {*} res
 */
module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      throw new Unauthorized('当前接口需要谁才能访问');
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const { userId } = decoded
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Unauthorized('用户不存在');
    }
    if (user.role !== 100) {
      throw new Unauthorized('您不是管理员，没有权限登录管理员后台');
    }
    req.user = user;
    next()
  } catch (error) {
    failure(res, error);
  }
}