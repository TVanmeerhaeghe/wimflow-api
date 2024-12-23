const ProjectTask = require("../../models/Project/ProjectTask");
const Project = require("../../models/Project/Project");
const { Op } = require("sequelize");

// Récupérer toutes les tâches d'un projet
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await ProjectTask.findAll({
            where: { project_id: req.params.projectId },
            order: [["id", "ASC"]],
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des tâches", error });
    }
};

// Créer une nouvelle tâche
const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    const { projectId } = req.params;

    console.log("Données reçues dans le body :", req.body);
    console.log("Fichier reçu :", req.file);

    try {
        const task = await ProjectTask.create({
            title,
            description,
            status,
            project_id: projectId
        });
        res.status(201).json(task);
    } catch (error) {
        console.error("Erreur lors de la création de la tâche :", error);
        res.status(500).json({ message: "Erreur lors de la création de la tâche", error });
    }
};


// Mettre à jour une tâche
const updateTask = async (req, res) => {
    try {
        const task = await ProjectTask.findByPk(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        const { title, description, status } = req.body;
        await task.update({ title, description, status });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche", error });
    }
};

// Supprimer une tâche
const deleteTask = async (req, res) => {
    try {
        const task = await ProjectTask.findByPk(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        await task.destroy();
        res.json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la tâche", error });
    }
};

// Upload d'une image pour une tâche
const uploadTaskImage = async (req, res) => {
    try {
        const task = await ProjectTask.findByPk(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        await task.update({ image_url: imageUrl });

        res.json({ message: "Image ajoutée avec succès", image_url: imageUrl });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'upload de l'image", error });
    }
};

module.exports = {
    getTasksByProject,
    createTask,
    updateTask,
    deleteTask,
    uploadTaskImage,
};
