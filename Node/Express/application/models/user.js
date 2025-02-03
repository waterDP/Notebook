/*
 * @Author: water.li
 * @Date: 2025-02-03 16:02:22
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\models\user.js
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '邮箱必须填写。' },
        notEmpty: { msg: '邮箱不能为空。' },
        isEmail: { msg: '邮箱格式不正确。' },
        async isUnique(value) {
          const user = await User.findOne({ where: { email: value } })
          if (user) {
            throw new Error('邮箱已存在，请直接登录。');
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户名必须填写。' },
        notEmpty: { msg: '用户名不能为空。' },
        len: { args: [2, 45], msg: '用户名长度必须是2 ~ 45之间。' },
        async isUnique(value) {
          const user = await User.findOne({ where: { username: value } })
          if (user) {
            throw new Error('名称已存在，请选择其他名称。');
          }
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '密码必须填写。' },
        notEmpty: { msg: '密码不能为空。' },
        len: { args: [6, 45], msg: '密码长度必须是6 ~ 45之间。' }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '昵称必须填写。' },
        notEmpty: { msg: '昵称不能为空。' },
        len: { args: [2, 45], msg: '昵称长度必须是2 ~ 45之间。' }
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '性别必须填写。' },
        notEmpty: { msg: '性别不能为空。' },
        isIn: { args: [[0, 1, 2]], msg: '性别的值必须是，男性：0 女性：1 未选择：2。' }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '用户组必须选择。' },
        notEmpty: { msg: '用户组不能为空。' },
        isIn: { args: [[0, 100]], msg: '用户组的值必须是，普通用户：0 管理员：100。' }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { msg: '图片地址不正确。' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};