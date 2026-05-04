const mongoose = require("mongoose");


const customerSchema = new mongoose.Schema(
  {
    firstName: {
        type: String, required: true, trim: true },
    lastName: {
        type: String, required: true, trim: true },
    email: {
        type: String, required: true, unique: true, lowercase: true },
    phone: {
        type: String, required: true },
    password: {
        type: String, required: true },
    bvn: {
        type: String,  },
    nin: {
        type: String,  },
    isVerified: {
        type: Boolean, default: false },
    isOnboarded: {
        type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);