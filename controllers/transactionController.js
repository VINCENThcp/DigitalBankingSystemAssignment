const Transaction = require("../models/Transaction");

// GET /api/transactions
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ customer: req.customer._id }).sort({
      createdAt: -1,
    });

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyTransactions };