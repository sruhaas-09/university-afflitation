const express = require("express");
const { sendCollegeOTP, collegeSignup, collegeLogin } = require("../controller/collegeController");
const college_Auth=require("../middleware/auth");

const router = express.Router();

router.post("/send-otp",college_Auth, sendCollegeOTP);
router.post("/signup", college_Auth,collegeSignup);
router.post("/login",college_Auth, collegeLogin);

module.exports = router;
