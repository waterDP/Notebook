/*
 * @Author: water.li
 * @Date: 2025-02-02 12:13:02
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\index.js
 */
const express = require('express');
const router = express.Router();
const { Course, Category, User, Chapter } = require('../models');
const { success, failure } = require('../utils/responses');

router.get('/', async (req, res) => {
  try {
    const recommendedCourses = await Course.findAll({
      attributes: { exculde: ['CategoryId', 'UserId', 'content'] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        },
        {
          model: User,
          as: 'user',
          attributes: [ 'id','username', 'nickname', 'avatar', 'company']
        },
      ],
      where: {
        recommended: true
      },
      order: [['id', 'DESC']],
      limit: 10
    })
    const likedCourses = await Course.findAll({
      attributes: { exculde: ['CategoryId', 'UserId', 'content'] },
      order: [['likesCount', 'DESC'], ['id' , 'DESC']],
      limit: 10
    })
    const introductoryCourses = await Course.findAll({
      attributes: { exculde: ['CategoryId', 'UserId', 'content'] },
      where: {
        introductory: true
      },
      order: [['id', 'DESC']],
      limit: 10
    })
    success(res, '获取成功。', {
      recommendedCourses,
      likedCourses,
      introductoryCourses
    })
  } catch(error) {
    failure(res, error)
  }
})

module.exports = router;