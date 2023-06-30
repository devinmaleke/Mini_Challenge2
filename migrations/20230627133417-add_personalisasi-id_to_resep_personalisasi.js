'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('resep_personalisasis', 'personalisasi_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'personalisasis',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('resep_personalisasis', 'personalisasi_id')
  }
};
