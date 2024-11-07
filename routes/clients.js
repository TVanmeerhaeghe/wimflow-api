const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/auth");
const ClientController = require("../controllers/clientController");

router.post("/create", verifyToken, checkRole("admin"), ClientController.createClient);
router.get("/", verifyToken, checkRole("admin"), ClientController.getAllClients);
router.get("/:id", verifyToken, checkRole("admin"), ClientController.getClientById);
router.put("/modify/:id", verifyToken, checkRole("admin"), ClientController.updateClient);
router.delete("/delete/:id", verifyToken, checkRole("admin"), ClientController.deleteClient);

module.exports = router;
