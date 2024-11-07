const Note = require("../../models/Maintenance/Note");
const Maintenance = require("../../models/Maintenance/Maintenance");
const User = require("../../models/User");

const addNoteToMaintenance = async (req, res) => {
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
};

const getNotesByMaintenance = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { maintenance_id: req.params.maintenanceId },
      include: [{ model: Maintenance }, { model: User }],
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

module.exports = {
  addNoteToMaintenance,
  getNotesByMaintenance,
};
