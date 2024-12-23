const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Project = require("../Project/Project");

const ProjectTask = sequelize.define("ProjectTask", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("backlog", "to_do", "in_progress", "done"),
        allowNull: false,
        defaultValue: "backlog",
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    project_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Project,
            key: "id",
        },
        allowNull: false,
    },
});

module.exports = ProjectTask;
