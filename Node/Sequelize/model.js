/*
 * @Author: water.li
 * @Date: 2022-06-15 22:36:25
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-15 23:34:18
 * @FilePath: \note\Sequelize\model.js
 */
const DB = require('sequelize')

const connect = new DB('dbtest1', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
})

connect.authenticate()

const User = connect.define('User', {
  id: {
    type: DB.INTEGER,
    autoIncrement: true, // 自增
    primaryKey: true  // 主键约束
  },
  firstname:{
    type: DB.STRING,
    field: 'fist_name'
  },
  lastname: {
    type: DB.STRING,
    allowNull: true, // 是否允许为空
    defaultValue: 'lastName', // 默认值
    unique: true, // 唯一性约束,
    field: 'last_name'
  },
  createTime: {
    type: DB.DATE,
    defaultValue: DB.NOW,
    field: 'create_time'
  },
  name: {
    type: DB.STRING,
    allowNull: false,
    get() {
      const title = this.getDataValue('title')
      const name = this.getDataValue('name')
      return `${name}(${title})`
    }
  },
  title: {
    type: DB.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue('title', val.toUpperCase())
    }
  }
}, {
  timestamps: false
})

connect.sync({
  force: true
}).then(() => {
  return User.create({
    firstname: 'huang',
    lastname: 'minshun'
  })
})

User.findById(21).then(project => {})

User.findOne({
  where: {title: 'aproid'},
  attributes: ['id', 'name', 'title']
}).then(project => {})

User.findOrCreate({
  where: {
    username: 'adepid'
  }
})
.spreed()

User.create({})