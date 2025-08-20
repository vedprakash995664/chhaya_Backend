// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  paymentFor: {
    type: String,
    enum: ["Medical", "Service"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  modeOfPayment: {
    type: String,
    enum: ["UPI", "Bank", "Cash"],
    required: true,
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientForm",
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CallingTeam",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentBook", PaymentSchema);
