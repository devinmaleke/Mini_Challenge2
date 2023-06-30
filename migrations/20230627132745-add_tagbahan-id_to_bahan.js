'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('bahans', 'tagbahan_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'tagbahans',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('bahans', 'tagbahan_id')
  }
};
