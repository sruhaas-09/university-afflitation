const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    universityName: { type: String, required: true },
    universityCode: { type: String, required: true },
    collegeName: { type: String, required: true },
    collegeCode: { type: String, required: true },
    semester: { type: Number, required: true },
    submissionDate: { type: Date, required: true },

    programName: { type: String, required: true },
    branch: { type: String, required: true },
    programCode: { type: String, required: true },
    level: { type: String, required: true },
    duration: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalSemesters: { type: Number, required: true },
    maxIntake: { type: Number, required: true },
    registered: { type: Number, required: true },

    studentFile: { type: String, required: true },
    financialSignature: { type: String, required: true },
    academicSignature: { type: String, required: true },
    principalSignature: { type: String, required: true },
    authorizationCertificate: { type: String, required: true },

    contactName: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },

    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BatchRegistration", batchSchema);
