const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Project = require("../models/Project/Project");

const forbiddenExtensions = [
    ".js", ".php", ".html", ".css", ".exe", ".sh",
    ".bat", ".py", ".java", ".c", ".cpp", ".rb", ".go",
];

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const projectId = req.params.projectId;
            const project = await Project.findByPk(projectId);
            if (!project) {
                return cb(new Error("Projet introuvable"), null);
            }

            const projectFolder = `uploads/projects/${project.name.replace(/\s+/g, '_')}`;
            if (!fs.existsSync(projectFolder)) {
                fs.mkdirSync(projectFolder, { recursive: true });
            }

            cb(null, projectFolder);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (forbiddenExtensions.includes(ext)) {
        cb(new Error("Ce type de fichier est interdit"), false);
    } else {
        cb(null, true);
    }
};

const uploadProjectFile = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter,
});

module.exports = uploadProjectFile;
