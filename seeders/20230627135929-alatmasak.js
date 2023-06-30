'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'alatmasaks',
      [
        {
          alat_masak: "pisau",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          alat_masak: "wajan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          alat_masak: "panci",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('alatmasaks', null, {})
  }
};
