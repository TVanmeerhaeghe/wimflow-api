const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

module.exports = User;
