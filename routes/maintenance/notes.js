const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/auth");
const NoteController = require("../../controllers/maintenance/noteController");

router.post("/maintenance/:maintenanceId/note", verifyToken, NoteController.addNoteToMaintenance);
router.get("/maintenance/:maintenanceId/notes", verifyToken, NoteController.getNotesByMaintenance);

module.exports = router;
