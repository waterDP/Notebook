/*
 * @Author: water.li
 * @Date: 2025-02-07 23:08:18
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\setting.js
 */
const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { success, failure } = require('../utils/responses');

/**
 * 查询系统信息
 * GET /settings
 */
router.get('/', async function (req, res) {
  try {
    const setting = await Setting.findOne();
    if (!setting) {
      throw new NotFoundError('未找到系统设置，请联系管理员。')
    }

    success(res, '查询系统信息成功。', { setting });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
