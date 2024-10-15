const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middleware/auth");

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
  