/*
 * @Author: water.li
 * @Date: 2022-06-15 21:52:56
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-15 22:48:42
 * @FilePath: \note\Sequelize\connect.js
 */

const DB = require('sequelize')


const connect = new DB('dbtest1', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
})

connect.authenticate()

const User = connect.define('User', {
  firstname: DB.STRING,
  lastname: {
    type: DB.STRING
  }
}, {
  timestamps: false
})

connect.sync({
  force: true
}).then(() => {
  return User.create({
    firstname: 'li',
    lastname: 'minshun'
  })
}).then(() => {
  return User.findOrCreate({
    where: {
      firstname: 'chen'
    }
  })
}).then(console.log)