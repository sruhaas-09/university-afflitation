const BatchRegistration = require("../models/batchRegistration");
const BatchApplicationStatus = require("../models/application");
const mongoose = require("mongoose");

exports.getCollegeDashboard = async (req, res) => {
  try {
    const { collegeCode } = req.params;

    const batches = await BatchRegistration.find({ collegeCode });

    if (!batches.length) {
      return res.json({
        success: true,
        collegeName: "",
        stats: { pending: 0, onHold: 0, approved: 0, total: 0 },
        pendingApplications: [],
        notifications: []
      });
    }

    const collegeName = batches[0].collegeName;

    const batchIds = batches.map(b => b._id);

    const statuses = await BatchApplicationStatus.find({
      batchId: { $in: batchIds }
    });

    const statusMap = {};
    statuses.forEach(stat => {
      statusMap[stat.batchId.toString()] = stat;
    });

    let pending = 0, approved = 0, onHold = 0;

    batches.forEach(batch => {
      const s = statusMap[batch._id.toString()];
      const status = s ? s.status : "Pending";

      if (status === "Pending") pending++;
      if (status === "Approved") approved++;
      if (status === "Hold") onHold++;
    });

    const total = batches.length;

    const pendingApplications = batches
      .filter(b => {
        const s = statusMap[b._id.toString()];
        const status = s ? s.status : "Pending";
        return status === "Pending";
      })
      .map(b => ({
        _id: b._id,
        programName: b.programName,
        collegeName: b.collegeName,
        submittedOn: b.submissionDate
      }));

    let notifications = [];

    statuses.forEach(s => {
      if (s.remarks.length > 0) {
        const last = s.remarks[s.remarks.length - 1];
        notifications.push(
          `${last.status}: ${last.text}`
        );
      }
    });

    notifications = notifications.reverse().slice(0, 5); 

    res.json({
      success: true,
      collegeName,
      stats: { pending, onHold, approved, total },
      pendingApplications,
      notifications
    });

  } catch (err) {
    console.log("Dashboard error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
