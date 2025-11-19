const BatchRegistration = require("../models/batchRegistration");

exports.getCourses = async (req, res) => {
  try {
    const collegeCode = req.user.collegeId;

    const batches = await BatchRegistration.find({ collegeCode })
      .select(
        "programName branch programCode startDate endDate duration maxIntake registered status studentFile"
      )
      .sort({ createdAt: -1 });

    res.json({ success: true, data: batches });

  } catch (err) {
    console.log("Error fetching courses:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await BatchRegistration.findById(batchId).select("students");

    if (!batch || !batch.students) {
      return res.json({ success: true, data: [] });
    }

    res.json({ success: true, data: batch.students });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
