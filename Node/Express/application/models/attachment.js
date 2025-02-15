'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Attachment.belongsTo(models.Userm, { as: 'user' });
    }
  }
  Attachment.init({
    userId: DataTypes.INTEGER,
    originalname: DataTypes.STRING,
    filename: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.STRING,
    path: DataTypes.STRING,
    fullpath: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};