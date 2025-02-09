/*
 * @Author: water.li
 * @Date: 2025-02-07 22:55:54
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\chapters.js
 */
const express = require('express');
const router = express.Router();
const { Course, Chapter } = require('../models');
const { success, failure } = require('../utils/responses');

router.get('/', async (req, res) => {
  try {
    const { id } = req.params
    const chapter = await Chapter.findByPk(id, {
      attributes: { exculde: ['CourseId'] }
    })
    if (!chapter) {
      throw new NotFound('章节不存在。')
    }

    const course = await chapter.getCourse({
      attributes: { exculde: ['id', 'name', 'userId'] }
    })

    const user = await course.getUser({
      attributes: { exculde: ['id', 'nickname', 'avatar', 'company'] }
    })

    const chapters = await Chapter.findAll({
      attributes: { exculde: ['CourseId', 'content'] },
      where: {
        CourseId: chapter.CourseId
      },
      order: [['rank', 'ASC'], ['id', 'DESC']]
    })
    success(res, '获取成功。', { chapter, course, user, chapters })
  } catch (error) {
    failure(res, error)
  }
})

module.exports = router;