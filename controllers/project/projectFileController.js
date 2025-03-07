const path = require("path");
const fs = require("fs");
const ProjectFile = require("../../models/Project/ProjectFile");
const Project = require("../../models/Project/Project")

const uploadProjectFile = async (req, res) => {
    try {
        const { projectId } = req.params;

        const file = await ProjectFile.create({
            project_id: projectId,
            filename: req.file.originalname,
            filepath: req.file.filename,
        });

        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du fichier", error });
    }
};

const getProjectFiles = async (req, res) => {
    try {
        const files = await ProjectFile.findAll({
            where: { project_id: req.params.projectId },
            order: [["uploaded_at", "DESC"]],
        });

        res.json(files);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des fichiers", error });
    }
};

const downloadProjectFile = async (req, res) => {
    try {
        const file = await ProjectFile.findByPk(req.params.fileId, {
            include: [{ model: Project, as: "project", attributes: ["name"] }],
        });

        if (!file) {
            return res.status(404).json({ message: "Fichier introuvable dans la base de données." });
        }

        if (!file.project || !file.project.name) {
            return res.status(500).json({ message: "Le projet associé n'a pas de nom valide." });
        }

        const projectFolder = file.project.name.replace(/\s+/g, "_");
        const filePath = path.join(__dirname, "../../uploads/projects", projectFolder, file.filepath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: `Fichier non trouvé sur le serveur : ${filePath}` });
        }

        res.download(filePath, file.filename);
    } catch (error) {
        console.error("Erreur lors du téléchargement du fichier :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
};

const deleteProjectFile = async (req, res) => {
    try {
        const file = await ProjectFile.findByPk(req.params.fileId, {
            include: [{ model: Project, as: "project", attributes: ["name"] }],
        });

        if (!file) {
            return res.status(404).json({ message: "Fichier introuvable dans la base de données." });
        }

        if (!file.project || !file.project.name) {
            return res.status(500).json({ message: "Projet associé introuvable." });
        }

        const projectFolder = file.project.name.replace(/\s+/g, "_");
        const filePath = path.join(__dirname, "../../uploads/projects", projectFolder, file.filepath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Fichier supprimé du serveur : ${filePath}`);
        } else {
            console.warn(`Le fichier à supprimer est introuvable : ${filePath}`);
        }

        await file.destroy();

        res.status(200).json({ message: "Fichier supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du fichier :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
};

module.exports = {
    uploadProjectFile,
    getProjectFiles,
    downloadProjectFile,
    deleteProjectFile,
};
