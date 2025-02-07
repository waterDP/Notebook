/*
 * @Author: water.li
 * @Date: 2025-02-05 22:56:00
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\charts.js
 */

const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../models')
const { Op } = require('sequelize');
const { NotFoundError, success, failure } = require('../../utils/response');

router.get('/sex', async (req, res) => {
  try {
    const male = await User.count({
      where: {
        gender: 0
      }
    })
    const female = await User.count({
      where: {
        gender: 1
      }
    })
    const unknown = await User.count({
      where: {
        gender: 2
      }
    })
    const data = [
      { value: male, name: '男' },
      { value: female, name: '女' },
      { value: unknown, name: '未知' }
    ]
    success(res, '获取用户性别比例成功', {
      data
    })
  } catch (error) {
    failure(res, error)
  }
})

router.get('/user', async (req, res) => {
  try {
    const results = await sequelize.query(
      `SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count
      FROM users
      GROUP BY month
      ORDER BY month ASC`
    )
    const data = {
      months: [],
      values: []
    }
    results.forEach(item => {
      data.months.push(item.month)
      data.values.push(item.count)
    })
    success(res, '查询每月用户数量成功', { data })
  } catch (error) {
    failure(res, error)
  }
})

module.exports = router;

