const Site = require("../models/Site");

const createSite = async (req, res) => {
  const { name, url, email_maintenance } = req.body;
  try {
    const site = await Site.create({ name, url, email_maintenance });
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ message: "Error creating site", error });
  }
};

const getAllSites = async (req, res) => {
  try {
    const sites = await Site.findAll();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sites", error });
  }
};

const getSiteById = async (req, res) => {
  try {
    const site = await Site.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving site", error });
  }
};

const updateSite = async (req, res) => {
  const { name, url, maintenance_status } = req.body;
  try {
    const site = await Site.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    await site.update({ name, url, maintenance_status });
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: "Error updating site", error });
  }
};

const deleteSite = async (req, res) => {
  try {
    const site = await Site.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    await site.destroy();
    res.json({ message: "Site deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting site", error });
  }
};

module.exports = {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deleteSite,
};
