'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Invoices', 'project_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Projects',
        key: 'id',
      },
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Invoices', 'project_id');
  }
};
