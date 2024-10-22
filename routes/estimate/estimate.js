const express = require("express");
const router = express.Router();
const Estimate = require("../../models/Estimate/Estimate");
const EstimateTask = require("../../models/Estimate/EstimateTask");
const Client = require("../../models/Client");
const { verifyToken, checkRole } = require("../../middleware/auth");
const sgMail = require("@sendgrid/mail");
const { emailLimiter } = require("../../middleware/emaillLimiter")

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    const estimates = await Estimate.findAll({
      include: [
        {
          model: Client,
          attributes: ['company'],
        },
      ],
    });
    res.json(estimates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching estimates", error });
  }
});

// Obtenir un devis par ID avec les tâches associées
router.get("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id, {
      include: [
        {
          model: EstimateTask,
          attributes: ['id', 'designation', 'description', 'days', 'price_per_day', 'tva'],
        },
        {
          model: Client,
          attributes: ['company'],
        },
      ],
    });

    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    res.json(estimate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching estimate", error });
  }
});

// Mettre à jour un devis
router.put("/:id", verifyToken, checkRole("admin"), async (req, res) => {
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
    const estimate = await Estimate.findByPk(req.params.id);
    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    await estimate.update({
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

    res.json(estimate);
  } catch (error) {
    res.status(500).json({ message: "Error updating estimate", error });
  }
});

// Route pour update le total TTC et HT
router.put("/:id/update-totals", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id);
    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    const tasks = await EstimateTask.findAll({ where: { estimate_id: estimate.id } });

    const totalHT = tasks.reduce((total, task) => total + task.days * task.price_per_day, 0);
    const totalTVA = tasks.reduce((total, task) => {
      const taskTotalHT = task.days * task.price_per_day;
      return total + taskTotalHT * (task.tva / 100);
    }, 0);

    await estimate.update({
      total_ht: totalHT,
      total_tva: totalTVA,
    });

    res.json(estimate);
  } catch (error) {
    console.error("Error updating totals:", error);
    res.status(500).json({ message: "Error updating totals", error });
  }
});

// Route pour envoyer un devis par email
router.post("/send-email/:id", emailLimiter, express.json({ limit: '10mb' }), async (req, res) => {
  const { pdfBase64 } = req.body;
  const estimateId = req.params.id;

  try {
    const estimate = await Estimate.findByPk(estimateId, {
      include: {
        model: Client,
        attributes: ['email', 'company'],
      },
    });

    if (!estimate || !estimate.Client) {
      return res.status(404).json({ message: "Client ou devis non trouvé" });
    }

    const clientEmail = estimate.Client.email;
    const clientCompany = estimate.Client.company;

    const msg = {
      to: clientEmail,
      from: process.env.EMAIL_USER,
      subject: `Votre devis n°${estimateId} de la société ${clientCompany}`,
      text: `Veuillez trouver ci-joint le devis n°${estimateId} pour votre entreprise ${clientCompany}.`,
      attachments: [
        {
          filename: `Devis_${estimateId}.pdf`,
          content: pdfBase64.split(",")[1],
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    try {
      await sgMail.send(msg);
      console.log(`Email envoyé à ${clientEmail} pour le devis ${estimateId}`);
      res.status(200).json({ message: "Email envoyé avec succès" });
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email : ${error.message}`);
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: error.message });
    }
  } catch (error) {
    console.error(`Erreur lors du traitement du devis ou du PDF : ${error.message}`);
    res.status(500).json({ message: "Erreur lors de l'envoi du devis par email", error: error.message });
  }
});

module.exports = router;