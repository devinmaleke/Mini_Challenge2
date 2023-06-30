'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resep_personalisasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      resep_personalisasi.belongsTo(models.resep, {
        foreignKey: 'resep_id',
        targetKey: 'id'
      });
      resep_personalisasi.belongsTo(models.personalisasi, {
        foreignKey: 'personalisasi_id',
        targetKey: 'id'
      });
    }
  }
  resep_personalisasi.init({
    resep_id: DataTypes.INTEGER,
    personalisasi_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'resep_personalisasi',
  });
  return resep_personalisasi;
};