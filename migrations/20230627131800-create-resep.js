'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reseps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_resep: {
        type: Sequelize.STRING
      },
      saran_penyajian: {
        type: Sequelize.INTEGER
      },
      langkah_masak: {
        type: Sequelize.STRING
      },
      estimasi: {
        type: Sequelize.INTEGER
      },
      jml_alat: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      image_steps: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reseps');
  }
};