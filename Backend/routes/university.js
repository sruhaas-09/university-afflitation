const express = require("express");
const router = express.Router();
const { sendOTP, signup, login } = require("../controller/universityController");

const university_Auth=require("../middleware/universityAuth")

router.post("/send-otp",university_Auth, sendOTP);
router.post("/signup",university_Auth, signup);
router.post("/login",university_Auth, login);

module.exports = router;
