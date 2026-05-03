const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const nibss = require("../services/nibssService");
const { v4: uuidv4 } = require("uuid");

// POST /api/banking/name-enquiry
const nameEnquiry = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;
    const result = await nibss.nameEnquiry(accountNumber);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/banking/transfer/intra
const intraTransfer = async (req, res) => {
  try {
    const { recipientAccount, amount, narration } = req.body;

    const senderAccount = await Account.findOne({ customer: req.customer._id });
    if (!senderAccount) return res.status(404).json({ message: "Your account not found" });

    if (senderAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const recipientAccountDoc = await Account.findOne({ accountNumber: recipientAccount });
    if (!recipientAccountDoc) {
      return res.status(404).json({ message: "Recipient account not found" });
    }

    const reference = uuidv4();

    senderAccount.balance -= amount;
    recipientAccountDoc.balance += amount;
    await senderAccount.save();
    await recipientAccountDoc.save();

    const transaction = await Transaction.create({
      customer: req.customer._id,
      type: "intra-bank",
      amount,
      senderAccount: senderAccount.accountNumber,
      recipientAccount,
      recipientName: recipientAccountDoc.accountName,
      narration,
      status: "success",
      reference,
    });

    await Transaction.create({
      customer: recipientAccountDoc.customer,
      type: "credit",
      amount,
      senderAccount: senderAccount.accountNumber,
      recipientAccount,
      recipientName: recipientAccountDoc.accountName,
      narration,
      status: "success",
      reference: uuidv4(),
    });

    res.json({ message: "Intra-bank transfer successful", reference, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/banking/transfer/inter
const interTransfer = async (req, res) => {
  try {
    const { recipientAccount, recipientBankCode, amount, narration } = req.body;

    const senderAccount = await Account.findOne({ customer: req.customer._id });
    if (!senderAccount) return res.status(404).json({ message: "Your account not found" });

    if (senderAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const reference = uuidv4();

    const nibssResult = await nibss.interTransfer({
  amount,
  senderAccount: senderAccount.accountNumber,
  recipientAccount,
});

    if (nibssResult?.success) {
      senderAccount.balance -= amount;
      await senderAccount.save();
    }

    const transaction = await Transaction.create({
      customer: req.customer._id,
      type: "inter-bank",
      amount,
      senderAccount: senderAccount.accountNumber,
      recipientAccount,
      recipientBankCode,
      narration,
      status: nibssResult?.success ? "success" : "failed",
      reference,
      nibssResponse: nibssResult,
    });

    res.json({ message: "Inter-bank transfer initiated", reference, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/banking/status/:reference
const transactionStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    const result = await nibss.checkTransactionStatus(reference);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { nameEnquiry, intraTransfer, interTransfer, transactionStatus };