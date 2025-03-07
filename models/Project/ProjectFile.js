const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const ProjectFile = sequelize.define("ProjectFile", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Projects',
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = ProjectFile;
