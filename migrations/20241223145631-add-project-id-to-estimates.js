"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Estimates", "project_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Projects",
        key: "id",
      },
      allowNull: true,
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Estimates", "project_id");
  },
};
