const InvoiceTask = require("../../models/Invoice/InvoiceTask");

const createInvoiceTask = async (req, res) => {
  const { invoiceId } = req.params;
  const { designation, description, days, price_per_day } = req.body;

  try {
    const task = await InvoiceTask.create({
      invoice_id: invoiceId,
      designation,
      description,
      days,
      price_per_day,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice task", error });
  }
};

const getTasksByInvoice = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const tasks = await InvoiceTask.findAll({ where: { invoice_id: invoiceId } });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this invoice" });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

const updateInvoiceTask = async (req, res) => {
  const { invoiceId, taskId } = req.params;
  const { designation, description, days, price_per_day, tva } = req.body;

  try {
    const task = await InvoiceTask.findOne({ where: { id: taskId, invoice_id: invoiceId } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.update({ designation, description, days, price_per_day, tva });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

module.exports = {
  createInvoiceTask,
  getTasksByInvoice,
  updateInvoiceTask,
};
