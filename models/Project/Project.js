const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Client = require("../Client");

const Project = sequelize.define("Project", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    billing_type: {
        type: DataTypes.ENUM("forfait", "horaire"),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    estimated_hours: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    description: {
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
});

module.exports = Project;
