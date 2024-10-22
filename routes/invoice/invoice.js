const express = require("express");
const router = express.Router();
const Invoice = require("../../models/Invoice/Invoice");
const InvoiceTask = require("../../models/Invoice/InvoiceTask");
const Client = require("../../models/Client");
const { verifyToken, checkRole } = require("../../middleware/auth");
const sgMail = require("@sendgrid/mail");
const { emailLimiter } = require("../../middleware/emaillLimiter");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Route pour créer une facture
router.post("/create", verifyToken, checkRole("admin"), async (req, res) => {
  const {
    client_id,
    commercial_contact_id,
    margin_ht,
    object,
    status,
    final_note,
  } = req.body;

  try {
    const invoice = await Invoice.create({
      client_id,
      commercial_contact_id,
      margin_ht,
      object,
      status,
      final_note,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error });
  }
});

// Obtenir toutes les factures
router.get("/", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: Client,
          attributes: ['company'],
        },
      ],
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
});

// Obtenir une facture par ID avec les tâches associées
router.get("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: InvoiceTask,
          attributes: ['id', 'designation', 'description', 'days', 'price_per_day', 'tva'],
        },
        {
          model: Client,
          attributes: ['company'],
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error });
  }
});

// Mettre à jour une facture
router.put("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  const { client_id, commercial_contact_id, margin_ht, object, status, final_note } = req.body;

  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoice.update({ client_id, commercial_contact_id, margin_ht, object, status, final_note });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error });
  }
});

// Route pour envoyer une facture par email
router.post("/send-email/:id", emailLimiter, express.json({ limit: '10mb' }), async (req, res) => {
  const { pdfBase64 } = req.body;
  const invoiceId = req.params.id;

  try {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: {
        model: Client,
        attributes: ['email', 'company'],
      },
    });

    if (!invoice || !invoice.Client) {
      return res.status(404).json({ message: "Client ou facture non trouvé" });
    }

    const clientEmail = invoice.Client.email;
    const clientCompany = invoice.Client.company;

    const msg = {
      to: clientEmail,
      from: process.env.EMAIL_USER,
      subject: `Votre facture n°${invoiceId} de la société ${clientCompany}`,
      text: `Veuillez trouver ci-joint la facture n°${invoiceId} pour votre entreprise ${clientCompany}.`,
      attachments: [
        {
          filename: `Facture_${invoiceId}.pdf`,
          content: pdfBase64.split(",")[1],
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };

    try {
      await sgMail.send(msg);
      console.log(`Email envoyé à ${clientEmail} pour la facture ${invoiceId}`);
      res.status(200).json({ message: "Email envoyé avec succès" });
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email : ${error.message}`);
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: error.message });
    }
  } catch (error) {
    console.error(`Erreur lors du traitement de la facture ou du PDF : ${error.message}`);
    res.status(500).json({ message: "Erreur lors de l'envoi de la facture par email", error: error.message });
  }
});

module.exports = router;
