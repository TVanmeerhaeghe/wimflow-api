const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role === "admin" || req.user.id === parseInt(req.params.id)) {
      return res.json(user);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
};
