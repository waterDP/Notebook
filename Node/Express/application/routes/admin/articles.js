/*
 * @Author: water.li
 * @Date: 2025-02-02 22:17:05
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\articles.js
 */
const express = require('express');
const router = express.Router();
const { Article } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');

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

    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`
        }
      }
    }

    const { count, rows } = await Article.findAndCountAll(condition)
    success(res, '获取文章列表成功', {
      articles: rows,
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
    const article = await getArticle(req)
    success(res, '获取文章成功', {
      article
    })
  } catch (error) {
    failure(res, error)
  }
})

router.post('/', async (req, res) => {
  try {
    const body = filterBody(req)
    const article = await Article.create(body)
    success(res, '创建文章成功', {
      article
    }, 201)
  } catch (error) {
    failure(res, error)
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const article = await getArticle(req)
    article.destroy()
    success(res, '删除文章成功')
  } catch (error) {
    failure(res, error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const article = await getArticle(req)
    const body = filterBody(req)
    await article.update(body)
    res.json({
      status: true,
      messagge: '更新文章成功',
      data: article
    })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：获取文章
 * @param {*} req
 * @returns
 */
async function getArticle(req) {
  const { id } = req.params
  const article = await Article.findByPk(id)
  if (!article) {
    throw new NotFoundError(`ID: ${id}的文章未找到`)
  }
  return article
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