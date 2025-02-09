/*
 * @Author: water.li
 * @Date: 2025-02-02 22:17:05
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\courses.js
 */
const express = require('express');
const router = express.Router();
const { Course, Category, User, Chapter } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../../utils/responses');
const { NotFound, Conflict } = require('http-errors');

router.get('/', async (req, res) => {
  try {
    const currentPage = Math.abs(Number(query.page)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10

    const offset = (currentPage - 1) * pageSize

    const query = req.query
    const condition = {
      ...getCondition(),
      order: [['id', 'DESC']],
      offset,
      limit: pageSize
    }

    if (query.categoryId) {
      condition.where = {
        categoryId: {
          [Op.eq]: query.categoryId
        }
      };
    }

    if (query.userId) {
      condition.where = {
        userId: {
          [Op.eq]: query.userId
        }
      };
    }

    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      };
    }

    if (query.recommended) {
      condition.where = {
        recommended: {
          // 需要转布尔值
          [Op.eq]: query.recommended === 'true'
        }
      };
    }

    if (query.introductory) {
      condition.where = {
        introductory: {
          [Op.eq]: query.introductory === 'true'
        }
      };
    }

    const { count, rows } = await Course.findAndCountAll(condition)
    success(res, '获取课程列表成功', {
      articles: rows,
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
    const course = await getCourse(req)
    success(res, '获取课程成功', {
      course
    })
  } catch (error) {
    failure(res, error)
  }
})

router.post('/', async (req, res) => {
  try {
    const body = filterBody(req)
    body.userId = req.user.id
    const course = await Course.create(body)
    success(res, '创建课程成功', {
      course
    }, 201)
  } catch (error) {
    failure(res, error)
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const course = await getCourse(req)
    const count = await Chapter.count({
      where: {
        courseId: req.params.id
      }
    })
    if (count > 0) {
      throw new Conflict('该课程下有章节，不能删除')
    }
    course.destroy()
    success(res, '删除课程成功')
  } catch (error) {
    failure(res, error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const course = await getCourse(req)
    const body = filterBody(req)
    await course.update(body)
    res.json({
      status: true,
      messagge: '更新课程成功',
      data: course
    })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：获取课程
 * @param {*} req
 * @returns
 */
async function getCourse(req) {
  const { id } = req.params
  const condition = getCondition()
  const course = await Course.findByPk(id, condition)
  if (!course) {
    throw new NotFound(`ID: ${id}的课程未找到`)
  }
  return course
}

function getCondition() {
  return {
    attributes: {
      exclude: ['CategoryId', 'userId']
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
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
    categoryId: req.body.categoryId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content
  }
}

module.exports = router