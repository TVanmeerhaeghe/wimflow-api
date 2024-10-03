const Note = require("./Note");
const Maintenance = require("./Maintenance");
const User = require("./User");
const Site = require("./Site");


Site.hasMany(Maintenance, { foreignKey: "site_id" });
Maintenance.belongsTo(Site, { foreignKey: "site_id" });
Maintenance.hasMany(Note, { foreignKey: "maintenance_id" });
Note.belongsTo(Maintenance, { foreignKey: "maintenance_id" });
Note.belongsTo(User, { foreignKey: "user_id" });

module.exports = { Note, Maintenance, User };
