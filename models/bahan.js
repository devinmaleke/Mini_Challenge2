'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bahan.belongsTo(models.tagbahan, {
        foreignKey: 'tagbahan_id',
        targetKey: 'id'
      })
      bahan.belongsTo(models.resep, {
        foreignKey: 'resep_id',
        targetKey: 'id'
      })
    }
  }
  bahan.init({
    jumlah: DataTypes.INTEGER,
    satuan: DataTypes.STRING,
    tipe_bahan: DataTypes.INTEGER,
    tagbahan_id: DataTypes.INTEGER,
    resep_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'bahan',
  });
  return bahan;
};