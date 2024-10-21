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

// Route pour obtenir les tâches d'un devis spécifique
router.get("/:estimateId/tasks", verifyToken, checkRole("admin"), async (req, res) => {
  const { estimateId } = req.params;

  try {
    const tasks = await EstimateTask.findAll({
      where: { estimate_id: estimateId },
    });

    if (!tasks) {
      return res.status(404).json({ message: "No tasks found for this estimate" });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Mettre à jour une tâche
router.put("/:estimateId/task/:taskId", verifyToken, checkRole("admin"), async (req, res) => {
  const { estimateId, taskId } = req.params;
  const { designation, description, days, price_per_day, tva } = req.body;

  try {
    const task = await EstimateTask.findOne({ where: { id: taskId, estimate_id: estimateId } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.update({
      designation,
      description,
      days,
      price_per_day,
      tva,
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

module.exports = router;