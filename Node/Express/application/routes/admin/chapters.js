/*
 * @Author: water.li
 * @Date: 2025-02-02 22:17:05
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\chapters.js
 */
const express = require('express');
const router = express.Router();
const { Chapter, Course } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');

router.get('/', async (req, res) => {
  try {
    const currentPage = Math.abs(Number(query.page)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize

    const query = req.query

    if (!query.courseId) {
      throw new NotFoundError('课程ID未找到')
    }
    const condition = {
      ...getCondition(),
      order: [['rank', 'ASC'], ['id', 'ASC']],
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

    const { count, rows } = await Chapter.findAndCountAll(condition)
    success(res, '获取章节列表成功', {
      chapters: rows,
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
    const chapter = await getChapter(req)
    success(res, '获取章节成功', {
      chapter
    })
  } catch (error) {
    failure(res, error)
  }
})

router.post('/', async (req, res) => {
  try {
    const body = filterBody(req)
    const chapter = await Chapter.create(body)
    success(res, '创建章节成功', {
      chapter
    }, 201)
  } catch (error) {
    failure(res, error)
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const chapter = await getChapter(req)
    chapter.destroy()
    success(res, '删除章节成功')
  } catch (error) {
    failure(res, error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const chapter = await getChapter(req)
    const body = filterBody(req)
    await chapter.update(body)
    res.json({
      status: true,
      messagge: '更新章节成功',
      data: chapter
    })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：获取章节
 * @param {*} req
 * @returns
 */
async function getChapter(req) {
  const { id } = req.params
  const condition = getCondition()
  const chapter = await Chapter.findByPk(id, condition)
  if (!chapter) {
    throw new NotFoundError(`ID: ${id}的章节未找到`)
  }
  return chapter
}

function getCondition() {
  return {
    attributes: {
      exclude: ['CourseId']
    },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'name']
      }
    ]
  }
}

/**
 * 公共方法：白名单过滤
 * @param {*} req
 * @returns
 */
function filterBody(req) {
  return {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank
  }
}

module.exports = router