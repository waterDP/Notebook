/*
 * @Author: water.li
 * @Date: 2025-02-02 22:17:05
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\users.js
 */
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../../utils/responses');
const { NotFound } = require('http-errors');

router.get('/', async (req, res) => {
  try {
    const currentPage = Math.abs(Number(query.page)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize

    const query = req.query
    const condition = {
      order: [['id', 'DESC']],
      offset,
      limit: pageSize
    }

    if (query.email) {
      condition.where = {
        title: {
          [Op.eq]: query.email
        }
      }
    }

    if (query.username) {
      condition.where = {
        title: {
          [Op.eq]: query.username
        }
      }
    }
    if (query.nickname) {
      condition.where = {
        title: {
          [Op.like]: `%${query.nickname}%`
        }
      }
    }

    const { count, rows } = await User.findAndCountAll(condition)
    success(res, '获取用户列表成功', {
      users: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })
  } catch (error) {
    failure(res, error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user = await getUser(req)
    success(res, '获取用户成功', {
      user
    })
  } catch (error) {
    failure(res, error)
  }
})

router.post('/', async (req, res) => {
  try {
    const body = filterBody(req)
    const user = await User.create(body)
    success(res, '创建用户成功', {
      user
    }, 201)
  } catch (error) {
    failure(res, error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const user = await getUser(req)
    const body = filterBody(req)
    await user.update(body)
    res.json({
      status: true,
      messagge: '更新用户成功',
      data: user
    })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：获取用户
 * @param {*} req
 * @returns
 */
async function getUser(req) {
  const { id } = req.params
  const user = await User.findByPk(id)
  if (!user) {
    throw new NotFound(`ID: ${id}的用户未找到`)
  }
  return user
}

/**
 * 公共方法：白名单过滤
 * @param {*} req
 * @returns
 */
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content
  }
}

module.exports = router