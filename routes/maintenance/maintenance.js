const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const MaintenanceController = require("../../controllers/maintenance/maintenanceController");

router.post("/:siteId", verifyToken, checkRole("admin"), MaintenanceController.createMaintenance);
router.get("/next", MaintenanceController.getNextMaintenance);
router.get("/", verifyToken, checkRole("admin"), MaintenanceController.getAllMaintenances);
router.get("/:id", verifyToken, checkRole("admin"), MaintenanceController.getMaintenanceById);
router.put("/modify/:id", verifyToken, checkRole("admin"), MaintenanceController.updateMaintenance);
router.get("/site/:siteId", verifyToken, checkRole("admin"), MaintenanceController.getMaintenancesBySite);

module.exports = router;
