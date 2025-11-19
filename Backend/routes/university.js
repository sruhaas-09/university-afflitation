const express = require("express");
const router = express.Router();
const { sendOTP, signup, login } = require("../controller/universityController");

const university_Auth=require("../middleware/universityAuth")

router.post("/send-otp", sendOTP);
router.post("/signup",signup);
router.post("/login", login);

module.exports = router;
