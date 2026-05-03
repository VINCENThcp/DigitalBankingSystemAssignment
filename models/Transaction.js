const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    type: {
      type: String,
      enum: ["intra-bank", "inter-bank", "credit"],
      required: true,
    },
    amount: { 
      type: Number, required: true },
    senderAccount: { 
      type: String, required: true },
    recipientAccount: { 
      type: String, required: true },
    recipientName: { 
      type: String },
    recipientBankCode: { 
      type: String },
    narration: { 
      type: String },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    reference: { 
      type: String, unique: true },
    nibssResponse: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);