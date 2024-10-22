const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Invoice = require("./Invoice");

const InvoiceTask = sequelize.define("InvoiceTask", {
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
  invoice_id: {
    type: DataTypes.STRING,
    references: {
      model: Invoice,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = InvoiceTask;
