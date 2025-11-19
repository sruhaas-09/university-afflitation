const University = require("../models/university");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mail");

const tempOTPs = {}; 
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    if (!email) return res.status(400).json({ error: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    tempOTPs[email] = otp;

    const sent = await sendEmail(
      email,
      "University Email Verification",
      `Your verification code is ${otp}`
    );

    if (!sent) {
      return res.status(500).json({ error: "Failed to send OTP email." });
    }

    console.log("OTP sent to:", email, "OTP:", otp);
    res.json({ message: "OTP sent to email successfully" });
  } catch (err) {
    console.log("OTP error:", err);
    res.status(500).json({ error: "internal error" });
  }
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, uid, email, password, otp } = req.body;
    console.log(req.body);
    if (!name || !uid || !email || !password || !otp)
      return res.status(400).json({ error: "All fields required" });

    if (tempOTPs[email] !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    const exists = await University.findOne({ $or: [{ uid }, { email }] });
    if (exists) return res.status(400).json({ error: "University already exists" });

    const hashed = await bcrypt.hash(password, 10);

    await University.create({ name, uid, email, password: hashed, isVerified: true });
    delete tempOTPs[email];

    res.status(201).json({ message: "University registered successfully" });
  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { uid, password } = req.body;
    if (!uid || !password)
      return res.status(400).json({ error: "All fields required" });

    const university = await University.findOne({ uid });
    if (!university)
      return res.status(400).json({ error: "University not found" });

    const match = await bcrypt.compare(password, university.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//   { id: university._id, uid: university.uid },
//   process.env.JWT_SECRET,
//   { expiresIn: "7d" }
// );

    const token = jwt.sign(
      { id: university._id,
         role: "university"
       },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    console.log(token);
    res.clearCookie("collegeToken");
    res.cookie("universityToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.json({ message: "Login success" });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
