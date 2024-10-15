const express = require("express");
const router = express.Router();
const EstimateTask = require("../../models/Estimate/EstimateTask");
const { verifyToken, checkRole } = require("../../middleware/auth");

router.post("/:estimateId/task", verifyToken, checkRole("admin"), async (req, res) => {
    const { estimateId } = req.params;
    const { designation, description, days, price_per_day } = req.body;
  
    try {
      const task = await EstimateTask.create({
        estimate_id: estimateId,
        designation,
        description,
        days,
        price_per_day,
      });
  
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error creating estimate task", error });
    }
});

module.exports = router;