const express = require("express");
const router = express.Router();
const Estimate = require("../../models/Estimate/Estimate");
const { verifyToken, checkRole } = require("../../middleware/auth");

router.post("/create", verifyToken, checkRole("admin"), async (req, res) => {
    const {
      client_id,
      commercial_contact_id,
      margin_ht,
      object,
      status,
      admin_note,
      advance_payment,
      discount,
      final_note,
      general_sales_conditions,
    } = req.body;
  
    try {
      const estimate = await Estimate.create({
        client_id,
        commercial_contact_id,
        margin_ht,
        object,
        status,
        admin_note,
        advance_payment,
        discount,
        final_note,
        general_sales_conditions,
      });
  
      res.status(201).json(estimate);
    } catch (error) {
      res.status(500).json({ message: "Error creating estimate", error });
    }
});

// Obtenir tous les devis
router.get("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const estimates = await Estimate.findAll();
    res.json(estimates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching estimates", error });
  }
});

// Obtenir un devis par ID
router.get("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id);
    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }
    res.json(estimate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching estimate", error });
  }
});

module.exports = router;