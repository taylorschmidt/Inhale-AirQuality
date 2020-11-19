'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.location.belongsTo(models.user)
      models.location.hasMany(models.journal)
    }
  };
  location.init({
    latitude: DataTypes.INTEGER,
    longitude: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    zips: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'location',
  });
  return location;
};