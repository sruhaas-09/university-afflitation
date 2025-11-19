const express = require("express");
const {
  getApplicationDetails,
  updateApplicationStatus,
} = require("../controller/viewApplicationController");
const { downloadApplicationSummary } = require("../controller/applicationDownload");
const college_Auth=require("../middleware/auth");
const university_Auth=require("../middleware/universityAuth")

const router = express.Router();

router.get("/university/application/:applicationId",university_Auth, getApplicationDetails);
router.post("/university/application/:applicationId/status", university_Auth,updateApplicationStatus);
router.get("/university/application/:applicationId/download",university_Auth ,downloadApplicationSummary);

router.get("/college/application/:applicationId",college_Auth ,getApplicationDetails);

module.exports = router;
