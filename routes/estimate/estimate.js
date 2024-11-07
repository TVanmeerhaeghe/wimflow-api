const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const estimateController = require("../../controllers/estimate/estimateController");

router.post("/create", verifyToken, checkRole("admin"), estimateController.createEstimate);
router.get("/", verifyToken, checkRole("admin"), estimateController.getAllEstimates);
router.get("/:id", verifyToken, checkRole("admin"), estimateController.getEstimateById);
router.put("/:id", verifyToken, checkRole("admin"), estimateController.updateEstimate);
router.put("/:id/update-totals", verifyToken, checkRole("admin"), estimateController.updateEstimateTotals);
router.post("/send-email/:id", verifyToken, checkRole("admin"), estimateController.sendEstimateEmail);

module.exports = router;
