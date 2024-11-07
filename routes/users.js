const express = require("express");
const { getAllUsers, getUserById } = require("../controllers/userController");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, checkRole("admin"), getAllUsers);
router.get("/:id", verifyToken, getUserById);

module.exports = router;
