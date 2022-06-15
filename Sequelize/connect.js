/*
 * @Author: water.li
 * @Date: 2022-06-15 21:52:56
 * @LastEditors: water.li
 * @LastEditTime: 2022-06-15 22:28:51
 * @FilePath: \note\Sequelize\connect.js
 */

const DB = require('sequelize')


const connect = new DB('dbtest1', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

(async () => {
  try {
    await connect.authenticate()
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const User = connect.define('User', {
  firstname: DB.STRING,
  lastname: {
    type: DB.STRING
  }
}, {
  timestramp: false
})

connect.sync({
  force: true
}).then(() => {
  return User.create({
    firstname: 'chen',
    lastname: 'Mingming'
  })
}).then(() => {
  return User.findOrCreate({
    where: {
      firstname: 'chen'
    }
  })
}).then(console.log)