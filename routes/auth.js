const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/auth");
const AuthController = require("../controllers/authController");

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/profile", verifyToken, AuthController.getProfile);
router.get("/admin", verifyToken, checkRole("admin"), AuthController.adminOnlyRoute);

module.exports = router;
