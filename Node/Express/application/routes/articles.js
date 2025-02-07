/*
 * @Author: water.li
 * @Date: 2025-02-07 23:05:56
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\articles.js
 */
const express = require('express');
const router = express.Router();
const { Article } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询文章列表
 * GET /articles
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      attributes: { exclude: ['content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    };

    const { count, rows } = await Article.findAndCountAll(condition);
    success(res, '查询文章列表成功。', {
      articles: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    });
  } catch (error) {
    failure(res, error);
  }
});

router.get('/:id', async function (req, res) {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);
    if (!article) {
      throw new NotFoundError(`ID: ${ id }的文章未找到。`)
    }

    success(res, '查询文章成功。', { article });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
