// controllers/paymentController.js
const Payment = require("../Models/PaymentBookModel");

// Add New Payment (Always POST)
exports.addPayment = async (req, res) => {
  try {
    const { paymentFor, amount, modeOfPayment, leadId, addedBy } = req.body;

    // Basic validation
    if (!paymentFor || !amount || !modeOfPayment || !leadId || !addedBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPayment = new Payment({
      paymentFor,
      amount,
      modeOfPayment,
      leadId,
      addedBy,
    });

    await newPayment.save();

    res.status(201).json({
      message: "Payment added successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Add Payment Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all payments of a lead
exports.getPaymentsByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const payments = await Payment.find({ leadId }).populate("addedBy", "name email");

    res.status(200).json(payments);
  } catch (error) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
