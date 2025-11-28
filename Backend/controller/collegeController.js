const College = require("../models/college.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mail");
const University = require("../models/university"); 


let tempOTPStore = {};

exports.sendCollegeOTP = async (req, res) => {
  const { email } = req.body;
  console.log("Requested Email:", email);

  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  tempOTPStore[email] = otp;

  const sent = await sendEmail(
    email,
    "Your College Login/Signup OTP",
    `Your OTP for College authentication is: ${otp}\n\nValid for 10 minutes.`
  );

  if (!sent) {
    return res.status(500).json({ error: "Failed to send OTP email." });
  }

  console.log("OTP sent to:", email);
  res.json({ message: "OTP sent to email successfully" });
};


exports.collegeSignup = async (req, res) => {
  try {
    const { universityName, universityId, collegeName, collegeId, email, password, otp } = req.body;

    if (!universityName || !universityId || !collegeName || !collegeId || !email || !password || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const universityExists = await University.findOne({ uid: universityId });
    if (!universityExists) {
      return res.status(400).json({
        error: "University is not registered."
      });
    }

    if (tempOTPStore[email] !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const exists = await College.findOne({ $or: [{ email }, { collegeId }] });
    if (exists) {
      return res.status(400).json({ error: "College already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const college = await College.create({
      universityName,
      universityId,
      collegeName,
      collegeId,
      email,
      password: hashed,
      isVerified: true
    });

    delete tempOTPStore[email];

    res.status(201).json({ message: "College registered successfully", collegeId: college._id });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};




exports.collegeLogin = async (req, res) => {
  try {
    const { collegeId, collegeName, email, password, otp } = req.body;
    console.log(req.body);

    if (!collegeId || !collegeName || !email || !password || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const college = await College.findOne({ email });
    if (!college) return res.status(404).json({ error: "Email not registered" });

    if (college.collegeId !== collegeId) {
      return res.status(400).json({ error: "Invalid College ID" });
    }

    if (college.collegeName !== collegeName) {
      return res.status(400).json({ error: "Invalid College Name" });
    }

    const passMatch = await bcrypt.compare(password, college.password);
    if (!passMatch) return res.status(401).json({ error: "Invalid password" });

    if (tempOTPStore[email] !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const token = jwt.sign(
      { id: college._id, collegeId: college.collegeId, role: "college" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    delete tempOTPStore[email];
    console.log(token);

    res.clearCookie("universityToken");

    res.cookie("collegeToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
      console.log("cookies",req.cookies.collegeToken);

  } catch (err) {
    console.log("College Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

