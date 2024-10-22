const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Client = require("../Client");
const User = require("../User");
const InvoiceTask = require("./InvoiceTask");

const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  due_date: {
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
    type: DataTypes.ENUM("Brouillon", "Envoyée", "Payée", "Annulée"),
    defaultValue: "Brouillon",
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
  final_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Invoice.beforeCreate(async (invoice) => {
  const lastInvoice = await Invoice.findOne({
    order: [['id', 'DESC']]
  });

  if (lastInvoice) {
    const lastIdNumber = parseInt(lastInvoice.id.slice(1));
    const newIdNumber = String(lastIdNumber + 1).padStart(5, '0');
    invoice.id = `F${newIdNumber}`;
  } else {
    invoice.id = "F00001";
  }
});

Invoice.beforeSave(async (invoice) => {
    const tasks = await InvoiceTask.findAll({ where: { invoice_id: invoice.id } });
  
    const totalHT = tasks.reduce((total, task) => {
      return total + task.days * task.price_per_day;
    }, 0);
  
    const totalTVA = tasks.reduce((total, task) => {
      const taskTotalHT = task.days * task.price_per_day;
      const taskTVA = taskTotalHT * (task.tva / 100);
      return total + taskTVA;
    }, 0);
  
    invoice.total_ht = totalHT;
    invoice.total_tva = totalTVA;
});

module.exports = Invoice;
