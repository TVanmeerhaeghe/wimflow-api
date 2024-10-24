'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Invoices', 'validity_date', 'due_date');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Invoices', 'due_date', 'validity_date');
  }
};

