/*
 * @Author: water.li
 * @Date: 2025-02-07 23:08:18
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\setting.js
 */
const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const { NotFound } = require('http-errors');
const { success, failure } = require('../utils/responses');
const { setKey, getKey } = require('../utils/redis');

/**
 * 查询系统信息
 * GET /settings
 */
router.get('/', async function (req, res) {
  try {
    const cacheKey = 'setting';

    let setting = await getKey(cacheKey);

    if (!setting) {
      setting = await Setting.findOne();
      if (!setting) {
        throw new NotFound('系统信息不存在。');
      }
      // 将设置信息存入缓存
      await setKey(cacheKey, setting);
    }

    success(res, '查询系统信息成功。', { setting });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
