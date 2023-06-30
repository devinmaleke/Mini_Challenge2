'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('bahans', 'resep_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'reseps',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('bahans', 'resep_id')
  }
};
