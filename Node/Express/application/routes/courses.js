/*
 * @Author: water.li
 * @Date: 2025-02-02 12:13:02
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\courses.js
 */
const express = require('express');
const router = express.Router();
const { Course, Category, Chapter, User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFound, BadRequest } = require('http-errors');

router.get('/', async (req, res) => {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(query.page)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize
    if (!query.categoryId) {
      throw new BadRequest('分类ID不能为空。')
    }
    const condition = {
      attribues: { exclude: ['CategoryId', 'UserId', 'content'] },
      where: {
        categoryId: query.categoryId
      },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset
    }
    const { count, rows } = await Course.findAndCountAll(condition)
    success(res, '获取课程列表成功。', {
      data: rows,
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
    const { id } = req.params
    const condition = {
      attribues: { exclude: ['CategoryId', 'UserId'] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Chapter,
          as: 'chapters',
          attributes: ['id', 'title', 'rank', 'createAt'],
          order: [['rank', 'ASC'], ['id', 'DESC']]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar', 'company']
        }
      ]
    }
    const courses = await Course.findByPk(id, condition)
    if (!courses) {
      throw new NotFound('课程不存在。')
    }
    success(res, '获取课程详情成功。', { courses })
  } catch (error) {
    failure(res, error)
  }
})

module.exports = router;