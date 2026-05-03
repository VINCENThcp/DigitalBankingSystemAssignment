const Account = require("../models/Account");

// Generate a 10-digit account number
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// POST /api/account/create
const createAccount = async (req, res) => {
  try {
    const customer = req.customer;

    if (!customer.isOnboarded) {
      return res.status(403).json({ message: "Customer is not fully onboarded" });
    }

    const existingAccount = await Account.findOne({ customer: customer._id });
    if (existingAccount) {
      return res.status(400).json({ message: "Customer already has an account" });
    }

    const account = await Account.create({
      customer: customer._id,
      accountNumber: generateAccountNumber(),
      accountName: `${customer.firstName} ${customer.lastName}`,
      balance: 15000,
      bankCode: process.env.NIBSS_BANK_CODE,
    });

    res.status(201).json({ message: "Account created successfully", account });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/account/balance
const getBalance = async (req, res) => {
  try {
    const account = await Account.findOne({ customer: req.customer._id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      balance: account.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAccount, getBalance };