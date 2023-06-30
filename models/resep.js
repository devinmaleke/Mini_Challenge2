'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      resep.hasMany(models.bahan, {
        foreignKey: "resep_id",
        sourceKey: 'id'
      });
      resep.hasMany(models.resep_personalisasi, {
        foreignKey: 'resep_id',
        sourceKey: 'id'
      });
      resep.hasMany(models.resep_alatmasak, {
        foreignKey: 'resep_id',
        sourceKey: 'id'
      })
    }
  }
  resep.init({
    nama_resep: DataTypes.STRING,
    saran_penyajian: DataTypes.INTEGER,
    langkah_masak: DataTypes.STRING,
    estimasi: DataTypes.INTEGER,
    jml_alat: DataTypes.INTEGER,
    image: DataTypes.STRING,
    image_steps: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'resep',
  });
  return resep;
};