const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    uploadTaskImage,
} = require("../../controllers/project/projectTaskController");

router.get("/:projectId/tasks", verifyToken, getTasksByProject);
router.post("/:projectId/tasks", verifyToken, checkRole("admin"), upload.single("image"), createTask);
router.put("/tasks/:taskId", verifyToken, checkRole("admin"), updateTask);
router.delete("/tasks/:taskId", verifyToken, checkRole("admin"), deleteTask);
router.post("/tasks/:taskId/upload-image", verifyToken, checkRole("admin"), upload.single("image"), uploadTaskImage);

module.exports = router;
