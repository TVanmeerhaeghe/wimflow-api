const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const InvoiceTaskController = require("../../controllers/invoice/invoiceTaskController");

router.post("/:invoiceId/task", verifyToken, checkRole("admin"), InvoiceTaskController.createInvoiceTask);
router.get("/:invoiceId/tasks", verifyToken, checkRole("admin"), InvoiceTaskController.getTasksByInvoice);
router.put("/:invoiceId/task/:taskId", verifyToken, checkRole("admin"), InvoiceTaskController.updateInvoiceTask);

module.exports = router;
