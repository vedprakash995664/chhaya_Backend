// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../Controller/PaymentBookController");

// Add new payment
router.post("/payment", paymentController.addPayment);

// Get all payments by leadId
router.get("/payment/:leadId", paymentController.getPaymentsByLead);

module.exports = router;
