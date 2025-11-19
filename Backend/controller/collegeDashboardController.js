const College = require("../models/college");
const BatchRegistration = require("../models/batchRegistration");
const BatchApplicationStatus = require("../models/application");

exports.getCollegeDashboard = async (req, res) => {
  try {
    const collegeId = req.user?.collegeId;

    if (!collegeId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ⬅ Fetch college info
    const college = await College.findOne(
      { collegeId },
      { collegeName: 1, universityName: 1 }
    );

    // ⬅ Get all Batch registrations for this college
    const batches = await BatchRegistration.find({ collegeCode: collegeId });

    if (!batches.length) {
      return res.json({
        collegeName: college?.collegeName || "",
        stats: { pending: 0, onHold: 0, approved: 0, total: 0 },
        pendingApplications: [],
        notifications: []
      });
    }

    const batchIds = batches.map((b) => b._id);

    const statusDocs = await BatchApplicationStatus.find({
      batchId: { $in: batchIds }
    });

    const statusMap = {};
    statusDocs.forEach((doc) => {
      statusMap[doc.batchId.toString()] = doc;
    });

    let pending = 0, onHold = 0, approved = 0;

    batches.forEach((b) => {
      const s = statusMap[b._id];
      const status = s?.status || "Pending";

      if (status === "Pending") pending++;
      if (status === "Hold") onHold++;
      if (status === "Approved") approved++;
    });

    const total = batches.length;

    const pendingApplications = batches
      .filter((b) => {
        const s = statusMap[b._id];
        const st = s?.status || "Pending";
        return st === "Pending";
      })
      .map((b) => ({
        _id: b._id,
        collegeName: b.collegeName,
        submittedOn: b.submissionDate
      }));

    let notifications = [];

    statusDocs.forEach((status) => {
      if (status.remarks?.length > 0) {
        const last = status.remarks[status.remarks.length - 1];
        notifications.push(
          `${last.status}: ${last.text}`
        );
      }
    });

    notifications = notifications.reverse().slice(0, 5);

    res.json({
      collegeName: college?.collegeName,
      stats: { pending, onHold, approved, total },
      pendingApplications,
      notifications
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
