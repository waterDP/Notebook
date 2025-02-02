/*
 * @Author: water.li
 * @Date: 2025-02-02 21:57:45
 * @Description: 
 * @FilePath: \Notebook\Node\Express\application\models\article.js
 */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '文章标题不能为空'
        },
        notEmpty: {
          msg: '文章标题不能为空'
        },
        len: {
          args: [2, 45],
          msg: '文章标题长度必须在2到45之间'
        }
      }
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};