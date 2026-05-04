const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const nibss = require("../services/nibssService");
const  bcrypt = require("bcrypt");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, bvn, nin } = req.body;

    if (!bvn && !nin) {
      return res.status(400).json({ message: "BVN or NIN is required for verification" });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    let verificationResult;
    if (bvn) {
      verificationResult = await nibss.verifyBVN(bvn);
    } else {
      verificationResult = await nibss.verifyNIN(nin);
    }

    if (!verificationResult?.success) {
      return res.status(400).json({ message: "BVN/NIN verification unsuccessful" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      bvn,
      nin,
      isVerified: true,
      isOnboarded: true,
    });

    res.status(201).json({
      message: "Customer registered and verified successfully",
      token: generateToken(customer._id),
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
    });
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    console.log("customer found:", customer);
    console.log("password from request:", password);
    console.log("password in db:", customer?.password);
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

     const isMatch = await bcrypt.compare(password, customer.password);
     console.log("isMatch:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(customer._id),
      customer: {
        id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };