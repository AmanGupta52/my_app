const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  role: { type: String, default: "admin" }, // always admin
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
