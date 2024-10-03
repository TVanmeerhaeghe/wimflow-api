const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const { verifyToken, checkRole } = require("../middleware/auth");

// Créer un nouveau site
router.post("/create", verifyToken, checkRole("admin"), async (req, res) => {
  const { name, url } = req.body;
  try {
    const site = await Site.create({ name, url });
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ message: "Error creating site", error });
  }
});

// Récupérer tous les sites
router.get("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const sites = await Site.findAll();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sites", error });
  }
});

// Récupérer un site par ID
router.get("/:id", async (req, res) => {
  try {
    const site = await Site.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving site", error });
  }
});

// Modifier un site
router.put("/modify/:id", verifyToken, checkRole("admin"), async (req, res) => {
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
router.delete("/delete/:id", verifyToken, checkRole("admin"), async (req, res) => {
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

module.exports = router;
