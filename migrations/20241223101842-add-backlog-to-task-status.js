'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ProjectTasks', 'status', {
      type: Sequelize.ENUM("backlog", "to_do", "in_progress", "done"),
      allowNull: false,
      defaultValue: "backlog",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ProjectTasks', 'status', {
      type: Sequelize.ENUM("to_do", "in_progress", "done"),
      allowNull: false,
      defaultValue: "to_do",
    });
  }
};
