const Invoice = require("../../models/Invoice/Invoice");
const InvoiceTask = require("../../models/Invoice/InvoiceTask");
const Client = require("../../models/Client");
const Project = require("../../models/Project/Project");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createInvoice = async (req, res) => {
  const { client_id, commercial_contact_id, margin_ht, object, status, final_note, project_id } = req.body;

  try {
    const invoice = await Invoice.create({
      client_id,
      commercial_contact_id,
      margin_ht,
      object,
      status,
      final_note,
      project_id
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [{ model: Client, attributes: ['company'] }],
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: InvoiceTask, attributes: ['id', 'designation', 'description', 'days', 'price_per_day', 'tva'] },
        { model: Client, attributes: ['company'] },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error });
  }
};

const updateInvoice = async (req, res) => {
  const { client_id, commercial_contact_id, margin_ht, object, status, final_note, project_id } = req.body;

  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoice.update({ client_id, commercial_contact_id, margin_ht, object, status, final_note, project_id });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error });
  }
};

const sendInvoiceEmail = async (req, res) => {
  const { pdfBase64 } = req.body;
  const invoiceId = req.params.id;

  try {
    const invoice = await Invoice.findByPk(invoiceId, {
      include: { model: Client, attributes: ['email', 'company'] },
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

    await sgMail.send(msg);
    res.status(200).json({ message: "Email envoyé avec succès" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

const updateInvoiceTotals = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findByPk(id, {
      include: { model: InvoiceTask },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const totalHT = invoice.InvoiceTasks.reduce(
      (total, task) => total + task.days * task.price_per_day,
      0
    );

    const totalTVA = invoice.InvoiceTasks.reduce(
      (total, task) => {
        const taskTotalHT = task.days * task.price_per_day;
        return total + taskTotalHT * (task.tva / 100);
      },
      0
    );

    await invoice.update({
      total_ht: totalHT,
      total_tva: totalTVA,
    });

    res.status(200).json({ message: "Invoice totals updated successfully", invoice });
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice totals", error });
  }
};

const getInvoicesByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const invoices = await Invoice.findAll({
      where: { project_id: projectId },
      include: [
        { model: Client, attributes: ['company'] },
        { model: Project, attributes: ['name'] },
      ],
    });

    if (!invoices.length) {
      return res.status(404).json({ message: "No invoices found for this project" });
    }

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices for project", error });
  }
};


module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  sendInvoiceEmail,
  updateInvoiceTotals,
  getInvoicesByProject
};
