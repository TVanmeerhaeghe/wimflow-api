const Note = require("./Maintenance/Note");
const Maintenance = require("./Maintenance/Maintenance");
const User = require("./User");
const Site = require("./Site");
const Client = require("./Client");
const Estimate = require("./Estimate/Estimate");
const EstimateTask = require("./Estimate/EstimateTask");


Site.hasMany(Maintenance, { foreignKey: "site_id" });
Maintenance.belongsTo(Site, { foreignKey: "site_id" });
Maintenance.hasMany(Note, { foreignKey: "maintenance_id" });
Note.belongsTo(Maintenance, { foreignKey: "maintenance_id" });
Note.belongsTo(User, { foreignKey: "user_id" });
Client.hasOne(Site, { foreignKey: "client_id" });
Site.belongsTo(Client, { foreignKey: "client_id" });
Estimate.belongsTo(Client, { foreignKey: "client_id" });
Estimate.belongsTo(User, { foreignKey: "commercial_contact_id", as: "CommercialContact" });
EstimateTask.belongsTo(Estimate, { foreignKey: "estimate_id" });
Estimate.hasMany(EstimateTask, { foreignKey: "estimate_id" });

module.exports = { Note, Maintenance, User, Site, Client };
