const Site = require("../../models/Site");
const Maintenance = require("../../models/Maintenance/Maintenance");

const createMaintenance = async (req, res) => {
  const { next_maintenance } = req.body;
  try {
    const maintenance = await Maintenance.create({
      site_id: req.params.siteId,
      next_maintenance,
    });
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: "Error creating maintenance", error });
  }
};

const getNextMaintenance = async (req, res) => {
  try {
    const maintenances = await Maintenance.findAll({
      where: { active: true },
      include: [Site],
      order: [["next_maintenance", "ASC"]],
    });

    const upcomingMaintenance = maintenances.find((maintenance) => {
      const nextDate = new Date(maintenance.next_maintenance);
      return nextDate > new Date() && maintenance.Site.maintenance_status;
    });

    if (!upcomingMaintenance) {
      return res.json({ message: "Aucune maintenance à venir" });
    }

    return res.json({
      siteName: upcomingMaintenance.Site.name,
      date: upcomingMaintenance.next_maintenance,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la prochaine maintenance" });
  }
};

const getAllMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.findAll({ include: Site });
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching maintenances", error });
  }
};

const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id, {
      include: Site,
    });

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching maintenance details", error });
  }
};

const updateMaintenance = async (req, res) => {
  const { status } = req.body;
  try {
    const maintenance = await Maintenance.findByPk(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    if (status === "done") {
      maintenance.last_maintenance = new Date();
      maintenance.next_maintenance = new Date(maintenance.last_maintenance.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    await maintenance.update({
      status,
      last_maintenance: maintenance.last_maintenance,
      next_maintenance: maintenance.next_maintenance,
    });

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: "Error updating maintenance", error });
  }
};

const getMaintenancesBySite = async (req, res) => {
  try {
    const maintenances = await Maintenance.findAll({ where: { site_id: req.params.siteId } });
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching maintenance", error });
  }
};

module.exports = {
  createMaintenance,
  getNextMaintenance,
  getAllMaintenances,
  getMaintenanceById,
  updateMaintenance,
  getMaintenancesBySite,
};
