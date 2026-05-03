const express = require("express");
const router = express.Router();
const { nameEnquiry, intraTransfer, interTransfer, transactionStatus } = require("../controllers/bankingController");
const { protect } = require("../middleware/AuthMiddlewear");

router.post("/name-enquiry", protect, nameEnquiry);
router.post("/transfer/intra", protect, intraTransfer);
router.post("/transfer/inter", protect, interTransfer);
router.get("/status/:reference", protect, transactionStatus);

module.exports = router;