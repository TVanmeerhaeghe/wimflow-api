const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const ProjectMember = sequelize.define("ProjectMember", {
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Projects",
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});

module.exports = ProjectMember;
