const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema({
  universityName: { type: String, required: true },
  universityId: { type: String, required: true },
  collegeName: { type: String, required: true },
  collegeId: { type: String, required: true, unique: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });



module.exports = mongoose.model("College", CollegeSchema);
