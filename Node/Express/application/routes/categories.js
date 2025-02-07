/*
 * @Author: water.li
 * @Date: 2025-02-02 12:13:02
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\categories.js
 */
const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { success, failure } = require('../utils/responses');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['rank', 'ASC'], ['id', 'DESC']]
    });
    success(res, '获取分类列表成功。', { categories });
  } catch(error) {
    failure(res, error)
  }
})

module.exports = router;