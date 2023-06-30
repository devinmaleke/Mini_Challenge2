'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tagbahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tagbahan.hasMany(models.bahan, {
        foreignKey: "tagbahan_id",
        sourceKey: 'id'
      })
    }
  }
  tagbahan.init({
    kode: DataTypes.STRING,
    nama_tag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tagbahan',
  });
  return tagbahan;
};