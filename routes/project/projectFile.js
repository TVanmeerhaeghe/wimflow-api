const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const uploadProjectFile = require("../../middleware/uploadProjectFile");
const {
    uploadProjectFile: uploadProjectFileController,
    getProjectFiles,
    downloadProjectFile,
    deleteProjectFile,
} = require("../../controllers/project/ProjectFileController");

router.post("/:projectId/upload", verifyToken, checkRole("admin"), uploadProjectFile.single("file"), uploadProjectFileController);
router.get("/:projectId", verifyToken, getProjectFiles);
router.get("/download/:fileId", verifyToken, downloadProjectFile);
router.delete("/:fileId", verifyToken, checkRole("admin"), deleteProjectFile);

module.exports = router;

