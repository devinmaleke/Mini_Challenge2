'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('resep_alatmasaks', 'alatmasak_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'alatmasaks',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('resep_alatmasaks', 'alatmasak_id')
  }
};
