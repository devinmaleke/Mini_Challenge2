'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('resep_alatmasaks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('resep_alatmasaks');
  }
};
