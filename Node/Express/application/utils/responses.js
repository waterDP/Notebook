/*
 * @Author: water.li
 * @Date: 2025-02-02 23:15:33
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\utils\responses.js
 */


function success(res, message, data = {}, code = 200) {
  res.status(code).json({
    status: true,
    message,
    data,
  })
}

function failure(res, error) {

  if (error.name === 'BadRequestError') {
    return res.status(400).json({
      status: false,
      message: '请求参数错误',
      errors: [error.message]
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: [error.message]
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: [error.message]
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: false,
      message: '认证失败',
      errors: ['身份令牌已过期'] 
    }) 
  }

  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => err.message)
    return res.status(400).json({
      status: false,
      messagge: '请求参数错误',
      errors
    })
  }
  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      status: false,
      messagge: '资源不存在',
      errors: [error.message]
    })
  }
  res.status(500).json({
    status: false,
    messagge: '服务器错误',
    errors: [error.message]
  })
}

module.exports = {
  success,
  failure
}