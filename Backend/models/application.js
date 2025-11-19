const mongoose = require("mongoose");

const batchApplicationStatusSchema = new mongoose.Schema(
  {
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "BatchRegistration", required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Hold"], default: "Pending" },
    remarks: [
      {
        status: String,
        text: String,
        timestamp: { type: Date, default: Date.now },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("BatchApplicationStatus", batchApplicationStatusSchema);
