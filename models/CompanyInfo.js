const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CompanyInfo = sequelize.define('CompanyInfo', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    vat_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    payment_info: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    general_sales_conditions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = CompanyInfo;
