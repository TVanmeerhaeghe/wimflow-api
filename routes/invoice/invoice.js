const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../../middleware/auth");
const InvoiceController = require("../../controllers/invoice/invoiceController");

router.post("/create", verifyToken, checkRole("admin"), InvoiceController.createInvoice);
router.get("/", verifyToken, checkRole("admin"), InvoiceController.getAllInvoices);
router.get("/:id", verifyToken, checkRole("admin"), InvoiceController.getInvoiceById);
router.put("/:id", verifyToken, checkRole("admin"), InvoiceController.updateInvoice);
router.post("/send-email/:id", verifyToken, checkRole("admin"), InvoiceController.sendInvoiceEmail);

module.exports = router;
