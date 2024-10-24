const Note = require("./Maintenance/Note");
const Maintenance = require("./Maintenance/Maintenance");
const User = require("./User");
const Site = require("./Site");
const Client = require("./Client");
const Estimate = require("./Estimate/Estimate");
const EstimateTask = require("./Estimate/EstimateTask");
const Invoice = require("./Invoice/Invoice");
const InvoiceTask = require("./Invoice/InvoiceTask");

// Associations pour Site, Maintenance, Note, etc.
Site.hasMany(Maintenance, { foreignKey: "site_id" });
Maintenance.belongsTo(Site, { foreignKey: "site_id" });
Maintenance.hasMany(Note, { foreignKey: "maintenance_id" });
Note.belongsTo(Maintenance, { foreignKey: "maintenance_id" });
Note.belongsTo(User, { foreignKey: "user_id" });
Client.hasOne(Site, { foreignKey: "client_id" });
Site.belongsTo(Client, { foreignKey: "client_id" });

// Associations pour Estimate et EstimateTask
Estimate.belongsTo(Client, { foreignKey: "client_id" });
Estimate.belongsTo(User, { foreignKey: "commercial_contact_id", as: "CommercialContact" });
EstimateTask.belongsTo(Estimate, { foreignKey: "estimate_id" });
Estimate.hasMany(EstimateTask, { foreignKey: "estimate_id" });
Client.hasMany(Estimate, { foreignKey: "client_id" });

// Associations pour Invoice et InvoiceTask
Invoice.belongsTo(Client, { foreignKey: "client_id" });
Invoice.belongsTo(User, { foreignKey: "commercial_contact_id", as: "CommercialContact" });
InvoiceTask.belongsTo(Invoice, { foreignKey: "invoice_id" });
Invoice.hasMany(InvoiceTask, { foreignKey: "invoice_id" });
Client.hasMany(Invoice, { foreignKey: "client_id" });

module.exports = { Note, Maintenance, User, Site, Client, Estimate, EstimateTask, Invoice, InvoiceTask };

