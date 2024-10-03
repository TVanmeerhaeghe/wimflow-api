const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Note = sequelize.define("Note", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Note;
