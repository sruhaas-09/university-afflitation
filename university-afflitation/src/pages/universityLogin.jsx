import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Grid,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function UniversityAuth() {
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://university-afflitation-dfiz.onrender.com/api/university";

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [loginForm, setLoginForm] = useState({ uid: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    uid: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    if (showOTP) {
      const timer = setTimeout(() => {
        const el = document.getElementById("otp-input-0");
        if (el) el.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showOTP]);

  const updateLogin = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const updateSignup = (e) =>
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });

  const sendVerificationCode = async () => {
    if (!signupForm.email) {
      setError("Please enter your email first.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupForm.email }),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setShowOTP(true);
        setMessage("Verification code sent to your email.");
      } else {
        setError(data.error || "Failed to send verification code.");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setMessage("");

    if (!loginForm.uid || !loginForm.password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
        credentials: "include", 
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login Successful! Redirecting...");
        setTimeout(() => navigate("/university-dashboard"), 1000);
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Try again.");
    }
  };

  const handleSignup = async () => {
    setError("");
    setMessage("");

    if (
      !signupForm.name ||
      !signupForm.uid ||
      !signupForm.email ||
      !signupForm.password
    ) {
      setError("All fields are required.");
      return;
    }

    if (!showOTP) {
      setError("Please verify your email before signing up.");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Enter valid 6-digit verification code.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signupForm,
          otp: otpCode,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup Successful! Redirecting...");
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error. Try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />

      <Paper
        elevation={10}
        sx={{
          width: { xs: "100%", sm: "90%", md: "950px" },
          minHeight: "600px",
          borderRadius: "26px",
          background: "rgba(255,255,255,0.13)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "42%" },
            padding: "45px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
            borderRight: { md: "1px solid rgba(255,255,255,0.25)" },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </Typography>

          <Typography sx={{ opacity: 0.92, lineHeight: 1.6 }}>
            {mode === "login"
              ? "Sign in to manage university data and verification."
              : "Register your university and enable secure academic access."}
          </Typography>

          <Button
            variant="outlined"
            sx={switchModeButton}
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setMessage("");
              setShowOTP(false);
              setOtp(["", "", "", "", "", ""]);
            }}
          >
            {mode === "login" ? "Create an Account →" : "← Back to Login"}
          </Button>
        </Box>

        <motion.div
          key={mode}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          style={{
            width: "58%",
            padding: "45px",
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.90), rgba(255,255,255,0.65))",
          }}
        >
          <Typography align="center" variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {mode === "login" ? "University Login" : "University Signup"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Divider sx={{ mb: 3 }} />

          {mode === "login" && (
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  label="University ID"
                  fullWidth
                  name="uid"
                  value={loginForm.uid}
                  onChange={updateLogin}
                  sx={textfieldStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  name="password"
                  value={loginForm.password}
                  onChange={updateLogin}
                  sx={textfieldStyle}
                />
              </Grid>

              <Box sx={{ position: "absolute", bottom: 20, right: 40 }}>
                <Typography
                  onClick={() => navigate("/forgotpassword")}
                  sx={{
                    fontSize: "14px",
                    color: "#0d47a1",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    "&:hover": { color: "#08306b" },
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={primaryButton}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          )}

          {mode === "signup" && (
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  label="University Name"
                  fullWidth
                  name="name"
                  value={signupForm.name}
                  onChange={updateSignup}
                  sx={textfieldStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="University ID"
                  fullWidth
                  name="uid"
                  value={signupForm.uid}
                  onChange={updateSignup}
                  sx={textfieldStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  fullWidth
                  name="email"
                  value={signupForm.email}
                  onChange={updateSignup}
                  sx={textfieldStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  name="password"
                  value={signupForm.password}
                  onChange={updateSignup}
                  sx={textfieldStyle}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                  onClick={sendVerificationCode}
                  sx={sendCodeButton}
                >
                  {loading ? <CircularProgress size={20} /> : "Send Code via Email"}
                </Button>
              </Grid>

              {showOTP && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1.2,
                    mt: 1,
                  }}
                >
                  {otp.map((digit, i) => (
                    <TextField
                      key={i}
                      id={`otp-input-${i}`}
                      value={digit}
                      onChange={(e) => {
                        const value = e.target.value;
                        
                        const lastChar = value.slice(-1);
                        
                        const newOtp = [...otp];
                        newOtp[i] = lastChar;
                        setOtp(newOtp);

                        if (lastChar && i < 5) {
                          const next = document.getElementById(`otp-input-${i + 1}`);
                          if (next) next.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          const prev = document.getElementById(`otp-input-${i - 1}`);
                          if (prev) prev.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text').slice(0, 6);
                        const newOtp = [...otp];
                        
                        pastedData.split('').forEach((char, idx) => {
                          if (idx < 6) newOtp[idx] = char;
                        });
                        
                        setOtp(newOtp);
                        const focusIndex = Math.min(pastedData.length, 5);
                        const targetField = document.getElementById(`otp-input-${focusIndex}`);
                        if (targetField) targetField.focus();
                      }}
                      inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center", fontSize: "20px" },
                      }}
                      sx={{
                        width: "45px",
                        background: "#fff",
                        borderRadius: "10px",
                      }}
                    />
                  ))}
                </Grid>
              )}

              <Grid item xs={12} sx={{ mt: showOTP ? 2 : 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={primaryButton}
                  onClick={handleSignup}
                >
                  Create Account
                </Button>
              </Grid>
            </Grid>
          )}
        </motion.div>
      </Paper>
    </Box>
  );
}

const textfieldStyle = {
  background: "white",
  borderRadius: "12px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(0,0,0,0.18)" },
    "&:hover fieldset": { borderColor: "#1976d2" },
    "&.Mui-focused fieldset": { borderColor: "#0d47a1", borderWidth: "2px" },
  },
};

const primaryButton = {
  py: 1.35,
  fontWeight: 700,
  fontSize: "16px",
  borderRadius: "12px",
  textTransform: "none",
  background: "linear-gradient(90deg, #1976d2, #0d47a1)",
};

const sendCodeButton = {
  py: 1.2,
  fontWeight: 700,
  borderRadius: "12px",
  textTransform: "none",
  borderColor: "#0d47a1",
  color: "#0d47a1",
};

const switchModeButton = {
  borderColor: "#fff",
  color: "#fff",
  width: "230px",
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "12px",
  py: 1.2,
};