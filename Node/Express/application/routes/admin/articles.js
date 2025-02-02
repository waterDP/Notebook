/*
 * @Author: water.li
 * @Date: 2025-02-02 22:17:05
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\articles.js
 */
const express = require('express');
const router = express.Router();
const { Article } = require('../models');
const e = require('express');

router.get('/', async (req, res) => {
  try {
    const condition = {
      order: [['id', 'DESC']]
    }
    const articles = await Article.findAll(condition)
    res.json({
      status: true,
      messagge: '获取文章列表成功',
      data: {
        articles
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      messagge: '获取文章列表失败',
      errors: [error.message]
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const article = await Article.findByPk(id)
    if (article) {
      res.json({
        status: true,
        messagge: '获取文章成功',
        data: {
          article
        }
      })
    } else {
      res.status(404).json({
        status: false,
        messagge: '获取文章失败',
        errors: ['文章不存在']
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      messagge: '获取文章失败',
      errors: [error.message]
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const article = await Article.create(req.body)
    res.status(201).json({
      status: true,
      messagge: '创建文章成功',
      data: article 
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      messagge: '创建文章失败',
      errors: [error.message]
    })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const article = await Article.findByPk(id)
    if (article) {
      await article.destroy() 
      res.json({
        status: true,
        messagge: '删除文章成功',
        data: article
      })
    } else {
      res.status(404).json({
        status: false,
        messagge: '删除文章失败',
        errors: ['文章不存在']
      })
    } 
  } catch (error) {
    res.status(500).json({
      status: false,
      messagge: '删除文章失败',
      errors: [error.message]
    })
  }
})

module.exports = router