'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class personalisasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      personalisasi.hasMany(models.resep_personalisasi, {
        foreignKey: "personalisasi_id",
        sourceKey: 'id'
      })
    }
  }
  personalisasi.init({
    nama_personalisasi: DataTypes.STRING,
    kode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'personalisasi',
  });
  return personalisasi;
};