const Estimate = require("../../models/Estimate/Estimate");
const EstimateTask = require("../../models/Estimate/EstimateTask");
const Client = require("../../models/Client");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createEstimate = async (req, res) => {
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
};

const getAllEstimates = async (req, res) => {
  try {
    const estimates = await Estimate.findAll({
      include: [{ model: Client, attributes: ['company'] }],
    });
    res.json(estimates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching estimates", error });
  }
};

const getEstimateById = async (req, res) => {
  try {
    const estimate = await Estimate.findByPk(req.params.id, {
      include: [
        { model: EstimateTask, attributes: ['id', 'designation', 'description', 'days', 'price_per_day', 'tva'] },
        { model: Client, attributes: ['company'] },
      ],
    });

    if (!estimate) {
      return res.status(404).json({ message: "Estimate not found" });
    }

    res.json(estimate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching estimate", error });
  }
};

const updateEstimate = async (req, res) => {
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
};

const updateEstimateTotals = async (req, res) => {
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
};

const sendEstimateEmail = async (req, res) => {
  const { pdfBase64 } = req.body;
  const estimateId = req.params.id;

  try {
    const estimate = await Estimate.findByPk(estimateId, {
      include: { model: Client, attributes: ['email', 'company'] },
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

    await sgMail.send(msg);
    res.status(200).json({ message: "Email envoyé avec succès" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

module.exports = {
  createEstimate,
  getAllEstimates,
  getEstimateById,
  updateEstimate,
  updateEstimateTotals,
  sendEstimateEmail,
};
