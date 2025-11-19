
const BatchRegistration = require("../models/batchRegistration");
const BatchApplicationStatus = require("../models/application");

exports.getCollegeBatches = async (req, res) => {
  try {
    const { code } = req.params;
    console.log(req.params);

    const batches = await BatchRegistration.aggregate([
      { $match: {code } },

      {
        $lookup: {
          from: "batchapplicationstatuses", 
          localField: "_id",
          foreignField: "batchId",
          as: "statusData"
        }
      },

      {
        $addFields: {
          latestStatus: {
            $cond: [
              { $gt: [{ $size: "$statusData" }, 0] },
              { $arrayElemAt: ["$statusData", -1] },
              null
            ]
          }
        }
      },

      {
        $project: {
          programName: 1,
          programCode: 1,
          collegeName: 1,
          collegeCode: 1,
          submissionDate: 1,
          status: { $ifNull: ["$latestStatus.status", "Pending"] },
          remarks: { $ifNull: ["$latestStatus.remarks", []] }
        }
      }
    ]);

    res.json({ success: true, data: batches });
  } catch (err) {
    console.error("🔥 Error loading college batches:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};





// Get single batch/application
exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Application not found" });

    res.json({ success: true, data: batch });
  } catch (err) {
    console.log("Fetch batch error:", err);
    res.status(500).json({ error: "Server error fetching application" });
  }
};

// Update status and add remark
exports.updateStatus = async (req, res) => {
  try {
    const { status, remark } = req.body;
    if (!status || !remark)
      return res.status(400).json({ error: "Status & remark are required" });

    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ error: "Application not found" });

    const remarkObj = {
      status,
      text: remark,
      timestamp: new Date()
    };

    batch.status = status;
    batch.remarks.unshift(remarkObj);
    await batch.save();

    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.log("Status update error:", err);
    res.status(500).json({ error: "Server error updating status" });
  }
};
