/*
 * @Author: water.li
 * @Date: 2025-02-03 16:08:42
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\models\chapter.js
 */
'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment');
moment.locale('zh-cn');

module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chapter.belongsTo(models.Course, { as: 'course' });
    }
  }
  Chapter.init({
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '课程ID必须填写。' },
        notEmpty: { msg: '课程ID不能为空。' },
        async isPresent(value) {
          const course = await sequelize.models.Course.findByPk(value)
          if (!course) {
            throw new Error(`ID为：${value} 的课程不存在。`);
          }
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '标题必须填写。' },
        notEmpty: { msg: '标题不能为空。' },
        len: { args: [2, 45], msg: '标题长度必须是2 ~ 45之间。' }
      }
    },
    content: DataTypes.TEXT,
    video: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { msg: '视频地址不正确。' }
      }
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写。' },
        notEmpty: { msg: '排序不能为空。' },
        isInt: { msg: '排序必须为整数。' },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必须是正整数。');
          }
        }
      }
    },
    createAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createAt')).format('LL');
      }
    },
    updateAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updateAt')).format('LL');
      }
    }
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};