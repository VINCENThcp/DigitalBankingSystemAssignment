const express = require("express");
const router = express.Router();
const { getMyTransactions } = require("../controllers/transactionController");
const { protect } = require("../middleware/AuthMiddlewear");

router.get("/", protect, getMyTransactions);

module.exports = router;