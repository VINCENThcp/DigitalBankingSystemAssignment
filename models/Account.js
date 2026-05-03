const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
       customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
    }, 
    accountNumber: {
        type: String, required: true, unique: true },
    accountName: {
        type: String, required: true },
    balance: {
        type: Number, default: 15000 },
    bankCode: {
        type: String, default: process.env.NIBSS_BANK_CODE },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);