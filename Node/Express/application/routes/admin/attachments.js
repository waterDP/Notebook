/*
 * @Author: water.li
 * @Date: 2025-02-15 18:12:33
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\admin\attachments.js
 */
const express = require('express')
const router = express.Router()
const { success, failure } = require('../utils/response')
const { Attachment, User } = require('../models')
const { NotFound } = require('http-errors')
const { success, failure } = require('../utils/response')
const { client } = require('../utils/aliyun')

/**
 * 附件列表
 * GET /admin/attachments
 */
router.get('/', async (req, res, next) => {
  try {
    const query = req.query
    const currentPage = parseInt(query.currentPage) || 1
    const pageSize = parseInt(query.pageSize) || 10
    const offset = (currentPage - 1) * pageSize
    const condition = {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'avatar']
      }],
      order: [['id', 'DESC']],
      limit: pageSize,
      offset
    }
    const { count, rows } = await Attachment.findAndCountAll(condition)
    success(res, '查询附件列表成功', {
      currentPage,
      pageSize,
      total: count,
      list: rows
    })
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 删除附件
 * DELETE /admin/attachments/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const attachment = await getAttachment(req)
    // 删除阿里云oss中的文件
    await client.delete(attachment.fullpath)
    // 删除数据库中的记录
    await attachment.destroy()
    success(res, '删除附件成功')
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 公共方法：查询当前附件 
 */
async function getAttachment(req) {
  const { id } = req.params

  const attachment = await Attachment.findByPk(id)
  if (!attachment) {
    throw new NotFound('附件不存在')
  }
  return attachment
}

module.exports = router