'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alatmasak extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      alatmasak.hasMany(models.resep_alatmasak, {
        foreignKey: "alatmasak_id",
        sourceKey: 'id'
      })
    }
  }
  alatmasak.init({
    alat_masak: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'alatmasak',
  });
  return alatmasak;
};