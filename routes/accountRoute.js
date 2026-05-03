const express = require("express");
const router = express.Router();
const { createAccount, getBalance } = require("../controllers/accountController");
const { protect } = require("../middleware/AuthMiddlewear");

router.post("/create", protect, createAccount);
router.get("/balance", protect, getBalance);

module.exports = router;