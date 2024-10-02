const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Site = require("./Site");

const Maintenance = sequelize.define("Maintenance", {
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Site,
      key: "id"
    }
  },
  status: {
    type: DataTypes.ENUM("to_do", "done"),
    defaultValue: "to_do"
  },
  next_maintenance: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  last_maintenance: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

Site.hasMany(Maintenance, { foreignKey: "site_id" });
Maintenance.belongsTo(Site, { foreignKey: "site_id" });

module.exports = Maintenance;
