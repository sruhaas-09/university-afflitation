const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("University", universitySchema);
