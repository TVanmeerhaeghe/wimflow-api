const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Estimate = require("./Estimate");

const EstimateTask = sequelize.define("EstimateTask", {
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_per_day: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tva: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 20.00,
  },
  estimate_id: {
    type: DataTypes.STRING,
    references: {
      model: Estimate,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = EstimateTask;
