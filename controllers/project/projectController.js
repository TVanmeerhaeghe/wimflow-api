const Client = require("../../models/Client");
const User = require("../../models/User");
const Project = require("../../models/Project/Project");
const ProjectMember = require("../../models/Project/ProjectMembers");

const createProject = async (req, res) => {
    const {
        name,
        billing_type,
        status,
        total_cost,
        estimated_hours,
        start_date,
        end_date,
        description,
        client_id,
        members
    } = req.body;

    try {
        const project = await Project.create({
            name,
            billing_type,
            status,
            total_cost,
            estimated_hours,
            start_date,
            end_date,
            description,
            client_id,
        });

        if (Array.isArray(members) && members.length > 0) {
            const projectMembers = members.map(userId => ({
                project_id: project.id,
                user_id: userId,
            }));
            await ProjectMember.bulkCreate(projectMembers);
        }

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error creating project", error });
    }
};



const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                { model: Client, attributes: ["id", "company"] },
                { model: User, through: { attributes: [] }, as: "Members", attributes: ["id", "username"] },
            ],
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                { model: Client, attributes: ["id", "company"] },
                { model: User, through: { attributes: [] }, as: "Members", attributes: ["id", "username"] },
            ],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Error fetching project", error });
    }
};

const updateProject = async (req, res) => {
    const { name, billing_type, status, total_cost, estimated_hours, start_date, end_date, description, client_id, members } = req.body;

    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.update({
            name,
            billing_type,
            status,
            total_cost,
            estimated_hours,
            start_date,
            end_date,
            description,
            client_id,
        });

        if (Array.isArray(members)) {
            await project.setMembers(members);
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Error updating project", error });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.destroy();
        res.json({ message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
};

const addProjectMember = async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;

    try {
        const project = await Project.findByPk(projectId);
        const user = await User.findByPk(userId);

        if (!project || !user) {
            return res.status(404).json({ message: "Project or user not found" });
        }

        await project.addMember(user);
        res.status(201).json({ message: "Member added to project" });
    } catch (error) {
        res.status(500).json({ message: "Error adding member to project", error });
    }
};

const removeProjectMember = async (req, res) => {
    const { projectId, userId } = req.params;

    try {
        const project = await Project.findByPk(projectId);
        const user = await User.findByPk(userId);

        if (!project || !user) {
            return res.status(404).json({ message: "Project or user not found" });
        }

        await project.removeMember(user);
        res.json({ message: "Member removed from project" });
    } catch (error) {
        res.status(500).json({ message: "Error removing member from project", error });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
};
