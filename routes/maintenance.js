const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const Maintenance = require("../models/Maintenance");
const { verifyToken, checkRole } = require("../middleware/auth");

// Créer un nouveau site
router.post("/site", verifyToken, checkRole("admin"), async (req, res) => {
  const { name, url } = req.body;
  try {
    const site = await Site.create({ name, url });
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ message: "Error creating site", error });
  }
});

// Récupérer tous les sites
router.get("/sites", verifyToken, checkRole("admin"), async (req, res) => {
    try {
      const sites = await Site.findAll();
      res.json(sites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sites", error });
    }
});

// Modifier un site
router.put("/site/:id", verifyToken, checkRole("admin"), async (req, res) => {
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
});

// Supprimer un site
router.delete("/site/:id", verifyToken, checkRole("admin"), async (req, res) => {
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
});

// Créer une maintenance pour un site
router.post("/maintenance/:siteId", verifyToken, checkRole("admin"), async (req, res) => {
  const { next_maintenance } = req.body;
  try {
    const maintenance = await Maintenance.create({
      site_id: req.params.siteId,
      next_maintenance
    });
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: "Error creating maintenance", error });
  }
});

router.get("/", verifyToken, checkRole("admin"), async (req, res) => {
    try {
      const maintenances = await Maintenance.findAll({
        include: Site,
      });
      res.json(maintenances);
    } catch (error) {
      res.status(500).json({ message: "Error fetching maintenances", error });
    }
});

// Mettre à jour une maintenance (to_do ou done)
router.put("/maintenance/:id", verifyToken, checkRole("admin"), async (req, res) => {
  const { status } = req.body;
  try {
    const maintenance = await Maintenance.findByPk(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    if (status === "done") {
      maintenance.last_maintenance = new Date();
      maintenance.next_maintenance = new Date(maintenance.last_maintenance.getTime() + 30 * 24 * 60 * 60 * 1000); // Ajoute un mois
    }

    await maintenance.update({ status });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: "Error updating maintenance", error });
  }
});

// Liste des maintenances d'un site
router.get("/site/:siteId", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const maintenances = await Maintenance.findAll({
      where: { site_id: req.params.siteId }
    });
    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching maintenance", error });
  }
});

module.exports = router;
