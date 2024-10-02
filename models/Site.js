const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Site = sequelize.define("Site", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maintenance_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = Site;
