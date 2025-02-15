/*
 * @Author: water.li
 * @Date: 2025-02-09 22:27:36
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\routes\uploads.js
 */
const express = require('express')
const router = express.Router()
const { BadRequest } = require('http-errors')
const { success, failure } = require('../utils/response')
const { config, client, singleFileUpload } = require('../utils/aliyun')
const { Attachment } = require('../models')

/**
 * 上传文件
 * POST /uploads
 */
/**
 * 阿里去oss客户端上传
 * POST /uploads/aliyun
 */
router.post('/aliyun', (req, res) => {
  try {
    singleFileUpload(req, res, async (err) => {
      if (err) {
        return failure(res, err)
      }
      if (!req.file) {
        return failure(res, new BadRequest('上传文件不能为空。'))
      }
      // 记录附件信息
      await Attachment.create({
        ...req.file,
        userId: req.user.id,
        fullPath: req.file.path + '/' + req.file.filename,
      })
      success(res, '上传成功。', { file: req.file.url })
    })
  } catch (error) {
    failure(res, error)
  }
})

module.exports = router