/*
 * @Author: water.li
 * @Date: 2025-02-02 22:17:05
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\categorys.js
 */
const express = require('express');
const router = express.Router();
const { Category, Course } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../../utils/responses');
const { NotFound, Conflict } = require('http-errors');

router.get('/', async (req, res) => {
  try {
    const currentPage = Math.abs(Number(query.page)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize

    const query = req.query
    const condition = {
      order: [['rank', 'ASC'], ['id', 'ASC']],
      offset,
      limit: pageSize
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      }
    }

    const { count, rows } = await Category.findAndCountAll(condition)
    success(res, '获取分类列表成功', {
      categorys: rows,
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
    const category = await getCategory(req)
    success(res, '获取分类成功', {
      category
    })
  } catch (error) {
    failure(res, error)
  }
})

router.post('/', async (req, res) => {
  try {
    const body = filterBody(req)
    const category = await Category.create(body)
    success(res, '创建分类成功', {
      category
    }, 201)
  } catch (error) {
    failure(res, error)
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const category = await getCategory(req)
    const count = await Course.count({
      where: {
        categoryId: req.params.id
      }
    })
    if (count > 0) {
      throw new Conflict('该分类下有课程，无法删除。')
    }
    category.destroy()
    success(res, '删除分类成功')
  } catch (error) {
    failure(res, error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const category = await getCategory(req)
    const body = filterBody(req)
    await category.update(body)
    res.json({
      status: true,
      messagge: '更新分类成功',
      data: category
    })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：获取分类
 * @param {*} req
 * @returns
 */
async function getCategory(req) {
  const { id } = req.params
  const category = await Category.findByPk(id)
  if (!category) {
    throw new NotFound(`ID: ${id}的分类未找到`)
  }
  return category
}

/**
 * 公共方法：白名单过滤
 * @param {*} req
 * @returns
 */
function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank
  }
}

module.exports = router