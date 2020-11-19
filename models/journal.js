'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class journal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.journal.belongsTo(models.user)
      models.journal.belongsTo(models.location)
    }
  };
  journal.init({
    userId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    zips: DataTypes.TEXT,
    feeling: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'journal',
  });
  return journal;
};