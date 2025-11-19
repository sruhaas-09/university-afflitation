import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function CollegeRegister() {
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/college";

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [contactOpen, setContactOpen] = useState(false);

  const [formData, setFormData] = useState({
    universityName: "",
    universityId: "",
    collegeName: "",
    collegeId: "",
    email: "",
    password: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    if (showOTP) {
      const timer = setTimeout(() => {
        const el = document.getElementById("otp-input-0");
        if (el) el.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showOTP]);

  const sendVerificationCode = async () => {
    if (!formData.email) {
      return setToast({
        open: true,
        message: "Please enter email first.",
        severity: "warning",
      });
    }

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setShowOTP(true);
        setToast({
          open: true,
          message: "OTP sent to your email!",
          severity: "success",
        });
      } else {
        setToast({
          open: true,
          message: data.error || "Failed to send OTP",
          severity: "error",
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: "Server error. Try again.",
        severity: "error",
      });
    }
  };

  const handleRegister = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return setToast({
        open: true,
        message: "Enter valid 6-digit verification code.",
        severity: "error",
      });
    }

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          otp: otpCode,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setToast({
          open: true,
          message: "College registered successfully! Redirecting...",
          severity: "success",
        });

        setTimeout(() => navigate("/"), 2500);
      } else {
        setToast({
          open: true,
          message: data.error || "Registration failed",
          severity: "error",
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: "Server error. Try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <AppBar position="static" sx={{ background: "#003366" }} elevation={0}>
        <Toolbar sx={{ position: "relative" }}>
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon sx={{ color: "#ffdd57" }} />}
            sx={{ textTransform: "none", position: "absolute", left: 10, fontWeight: 600 }}
            onClick={() => navigate("/")}
          >
            Back
          </Button>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              width: "100%",
              textAlign: "center",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <SchoolRoundedIcon sx={{ color: "#ffdd57", fontSize: 26 }} />
            College Affiliation Portal
          </Typography>

          <Button
            color="inherit"
            startIcon={<MailOutlineIcon sx={{ color: "#90e0ff" }} />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "8px",
              px: 2,
              position: "absolute",
              right: 10,
            }}
            onClick={() => setContactOpen(true)}
          >
            Contact Us
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <Paper
          elevation={6}
          sx={{
            mt: 6,
            width: { xs: "100%", sm: "450px" },
            p: 4,
            borderRadius: "16px",
            backdropFilter: "blur(5px)",
            background: "rgba(255,255,255,0.88)",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center", mb: 1, color: "#003366" }}>
            Register Your College
          </Typography>

          <Typography sx={{ textAlign: "center", color: "#555", fontSize: "14px", mb: 3 }}>
            Secure access for affiliated colleges to manage programs & student registrations.
          </Typography>

          {["universityName", "universityId", "collegeName", "collegeId", "email", "password"].map(
            (field, idx) => (
              <TextField
                key={field}
                label={
                  ["University Name", "University ID", "College Name", "College ID / Affiliation Code", "Email Address", "Password"][idx]
                }
                type={field === "password" ? "password" : "text"}
                fullWidth
                sx={{ mb: 2 }}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
            )
          )}

          {!showOTP && (
            <Button
              variant="outlined"
              fullWidth
              onClick={sendVerificationCode}
              sx={{ py: 1.2, borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
            >
              Send Verification Code
            </Button>
          )}
          {showOTP && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography sx={{ mb: 1, fontWeight: 600, color: "#003366" }}>Enter Verification Code</Typography>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 1.2 }}>
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
                    inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "20px" } }}
                    sx={{ width: "48px", background: "#fff", borderRadius: "8px" }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, py: 1.2, borderRadius: "10px", fontWeight: 600 }}
                onClick={handleRegister}
              >
                Verify & Register
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      <Dialog open={contactOpen} onClose={() => setContactOpen(false)}>
        <DialogTitle>Contact Support</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>For more information or assistance, please contact:</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <MailOutlineIcon color="primary" />
            <Typography fontWeight={600}>affiliationhub@gmail.com</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2800}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}