const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/customerController");

router.post("/register", (req, res, next) => {
  console.log("route hit");
  next();
}, register);

router.post("/login", login);

module.exports = router;