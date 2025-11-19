const University = require("../models/university");
const College = require("../models/college");

exports.getUniversityDashboard = async (req, res) => {
  try {
    const university = await University.findById(req.user.id).select("name uid");
    if (!university) return res.status(404).json({ error: "University not found" });

    const colleges = await College.find(
      { universityId: university.uid },
      { collegeName: 1, collegeId: 1 }
    );

    res.json({
      universityName: university.name,
      colleges
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
