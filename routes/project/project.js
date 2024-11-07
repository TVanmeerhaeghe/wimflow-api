const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
} = require("../../controllers/project/projectController");

// Routes pour les projets
router.post("/create", verifyToken, checkRole("admin"), createProject);
router.get("/", verifyToken, checkRole("admin"), getAllProjects);
router.get("/:id", verifyToken, checkRole("admin"), getProjectById);
router.put("/modify/:id", verifyToken, checkRole("admin"), updateProject);
router.delete("/delete/:id", verifyToken, checkRole("admin"), deleteProject);

// Gestion des membres du projet
router.post("/:projectId/members", verifyToken, checkRole("admin"), addProjectMember);
router.delete("/:projectId/members/:userId", verifyToken, checkRole("admin"), removeProjectMember);

module.exports = router;
