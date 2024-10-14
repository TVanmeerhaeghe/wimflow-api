const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const Site = require("../models/Site");
const { verifyToken, checkRole } = require("../middleware/auth");

// Créer un nouveau client
router.post("/create", verifyToken, checkRole("admin"), async (req, res) => {
  const { first_name, last_name, company, address, city, postal_code, site_id } = req.body;
  try {
    const client = await Client.create({
      first_name,
      last_name,
      company,
      address,
      city,
      postal_code,
      site_id,
    });

    if (site_id) {
      await Site.update(
        { client_id: client.id },
        { where: { id: site_id } }
      );
    }
    
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
});

// Récupérer tous les clients
router.get("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [
        {
          model: Site,
          attributes: ["url", "name"],
        },
      ],
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
});

// Récupérer un client par ID
router.get("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving client", error });
  }
});

// Modifier un client
router.put("/modify/:id", verifyToken, checkRole("admin"), async (req, res) => {
  const { first_name, last_name, company, address, city, postal_code, site_id } = req.body;
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.update({ first_name, last_name, company, address, city, postal_code, site_id });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error });
  }
});

// Supprimer un client
router.delete("/delete/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.destroy();
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error });
  }
});

module.exports = router;
