const express = require('express');
const router = express.Router();
const { Course, Chapter } = require('../models');
const { success, failure } = require('../utils/responses');

router.get('/', async (req, res) => {
  try {
    const { id } = req.params
    const condition = {
      attributes: { exculde: ['CourseId'] },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company']
            }
          ]
        }
      ]
    }
    const chapter = await Chapter.findByPk(id, condition)
    if (!chapter) {
      throw new NotFoundError('章节不存在。')
    }

    const chapters = await Chapter.findAll({
      attributes: { exculde: ['CourseId', 'content'] },
      where: {
        CourseId: chapter.CourseId
      },
      order: [['rank', 'ASC'], ['id', 'DESC']]
    }) 
    success(res, '获取成功。', { chapter, chapters })
  } catch (error) {
    failure(res, error)
  }
})

module.exports = router;