const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Client = require("../Client");
const User = require("../User");
const EstimateTask = require("./EstimateTask");     

const Estimate = sequelize.define("Estimate", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
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
  total_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total_tva: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
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

Estimate.beforeCreate(async (estimate) => {
  const lastEstimate = await Estimate.findOne({
    order: [['id', 'DESC']]
  });

  if (lastEstimate) {
    const lastIdNumber = parseInt(lastEstimate.id.slice(1));
    const newIdNumber = String(lastIdNumber + 1).padStart(5, '0');
    estimate.id = `D${newIdNumber}`;
  } else {
    estimate.id = "D00001";
  }
});

Estimate.beforeSave(async (estimate) => {
  const tasks = await EstimateTask.findAll({ where: { estimate_id: estimate.id } });

  const totalHT = tasks.reduce((total, task) => {
    return total + task.days * task.price_per_day;
  }, 0);

  const totalTVA = tasks.reduce((total, task) => {
    const taskTotalHT = task.days * task.price_per_day;
    const taskTVA = taskTotalHT * (task.tva / 100);
    return total + taskTVA;
  }, 0);

  estimate.total_ht = totalHT;
  estimate.total_tva = totalTVA;
});

module.exports = Estimate;
