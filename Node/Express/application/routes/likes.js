const express = require('express');
const router = express.Router();
const { Likes, Course, User } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFound } = require('http-errors');

/**
 * 点赞，取消赞
 * POST /likes
 */
router.post('/', async function (req, res) {
  try {
    const userId = req.userId;
    const { courseId } = req.body;
    const course = await Course.findByPk(courseId);
    if (!course) {
      throw new NotFound(`ID: ${courseId}的课程未找到。`)
    }
    const like = await Likes.findOne({
      where: {
        userId,
        courseId
      }
    })
    if (!like) {
      await Likes.create({
        userId,
        courseId
      })
      await course.increment('likesCount')
      success(res, '点赞成功。')
    } else {
      await like.destroy()
      await course.decrement('likesCount')
      success(res, '取消赞成功。')
    }
  } catch (error) {
    failure(res, error);
  }
})

/**
 * 查询用户点赞的课程
 * GET /likes
 */
router.get('/', async function (req, res) {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 查询当前用户
    const user = await User.findByPk(req.userId);
    // 查询当前用户点赞过的课程
    const course = await user.getLikedCourses({
      joinTableAttributes: [],
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    })
    // 查询当前用户点赞过的课程的总数
    const count = await user.countLikedCourses();
    success(res, '查询用户点赞的课程成功。', {
      course,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })
  } catch (error) {
    failure(res, error);
  }
})

module.exports = router;