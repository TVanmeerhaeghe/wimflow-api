const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Client = require("../Client");
const User = require("../User");     

const Estimate = sequelize.define("Estimate", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `F${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  validity_date: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(new Date().setMonth(new Date().getMonth() + 1)),
  },
  margin_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  object: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Brouillon", "Envoyé", "Expiré", "Décliné", "Accepté"),
    defaultValue: "Brouillon",
  },
  admin_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  client_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Client,
      key: "id",
    },
    allowNull: false,
  },
  commercial_contact_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  advance_payment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  final_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  general_sales_conditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Estimate;
