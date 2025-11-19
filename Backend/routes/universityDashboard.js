const express = require("express");
const router = express.Router();
const { getUniversityDashboard } = require("../controller/universityDashboardController");
const collegeAuth=require("../middleware/universityAuth")

router.get("/university/dashboard",collegeAuth,getUniversityDashboard);

module.exports = router;
