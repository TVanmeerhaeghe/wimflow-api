const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const Maintenance = require("../models/Maintenance");
const { verifyToken } = require("../middleware/auth");

// Ajouter une note à une maintenance
router.post("/maintenance/:maintenanceId/note", verifyToken, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const maintenance = await Maintenance.findByPk(req.params.maintenanceId);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    const note = await Note.create({
      content,
      maintenance_id: maintenance.id,
      user_id: userId,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error adding note", error });
  }
});

// Récupérer les notes d'une maintenance
router.get("/maintenance/:maintenanceId/notes", verifyToken, async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { maintenance_id: req.params.maintenanceId },
      include: [{ model: Maintenance }, { model: User }],
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
});

module.exports = router;
