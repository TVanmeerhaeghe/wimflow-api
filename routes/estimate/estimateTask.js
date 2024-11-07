const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const estimateTaskController = require("../../controllers/estimate/estimateTaskController");

router.post("/:estimateId/task", verifyToken, checkRole("admin"), estimateTaskController.createEstimateTask);
router.get("/:estimateId/tasks", verifyToken, checkRole("admin"), estimateTaskController.getTasksByEstimate);
router.put("/:estimateId/task/:taskId", verifyToken, checkRole("admin"), estimateTaskController.updateEstimateTask);

module.exports = router;
