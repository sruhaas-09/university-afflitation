const express = require("express");
const { sendCollegeOTP, collegeSignup, collegeLogin } = require("../controller/collegeController");
const college_Auth=require("../middleware/auth");

const router = express.Router();

router.post("/send-otp", sendCollegeOTP);
router.post("/signup",collegeSignup);
router.post("/login", collegeLogin);

module.exports = router;
