
const Batch = require("../models/batchRegistration");
const BatchStatus = require("../models/application");

exports.getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const batch = await Batch.findById(applicationId);
    // console.log(batch);
    if (!batch) return res.status(404).json({ success: false, message: "Application not found" });

    let statusData = await BatchStatus.findOne({ batchId: applicationId });

    if (!statusData) {
      statusData = await BatchStatus.create({ batchId: applicationId });
    }

    return res.json({
      success: true,
      data: {
        ...batch._doc,
        remarks: statusData.remarks,
        status: statusData.status,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, remark } = req.body;

    let statusData = await BatchStatus.findOne({ batchId: applicationId });
    if (!statusData) statusData = await BatchStatus.create({ batchId: applicationId });

    const newRemark = {
      status,
      text: remark,
      timestamp: new Date()
    };

    statusData.status = status;
    statusData.remarks.unshift(newRemark);
    await statusData.save();

    return res.json({ success: true, message: "Status updated successfully", data: statusData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

