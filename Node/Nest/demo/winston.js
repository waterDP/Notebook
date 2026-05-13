const winston = require('winston')
require('winston-daily-rotate-file')

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      // 指定日志文件的文件名模式
      filename: 'app-/%DATE%.log',
      // 指定日志文件的目录 
      dirname: 'logs',
      // 指定日期的格式
      datePattern: 'YYYY-MM-DD',
      // 指定日志的级别
      level: 'info',
      // 设置日志的最大的文件大小
      maxSize: '20m',
      // 设置日志文件的最大保存天数
      maxFiles: '14d', // 14天后自动删除
      zippedArchive: true // 指定是否对日志文件进行压缩
    })
  ]
})

logger.info('这是一条info日志')