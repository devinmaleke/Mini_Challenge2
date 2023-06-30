'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resep_alatmasak extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      resep_alatmasak.belongsTo(models.resep, {
        foreignKey: 'resep_id',
        targetKey: 'id'
      });
      resep_alatmasak.belongsTo(models.alatmasak, {
        foreignKey: 'alatmasak_id',
        targetKey: 'id'
      });
    }
  }
  resep_alatmasak.init({
    resep_id: DataTypes.INTEGER,
    alatmasak_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'resep_alatmasak',
  });
  return resep_alatmasak;
};