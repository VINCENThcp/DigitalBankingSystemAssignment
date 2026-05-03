const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        type: String, minLength: 11, maxLength: 11 },
    nin: {
        type: String, minLength: 11, maxLength: 11 },
    isVerified: {
        type: Boolean, default: false },
    isOnboarded: {
        type: Boolean, default: false },
  },
  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Customer", customerSchema);