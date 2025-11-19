import React, { useState } from "react";
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
  Alert
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const otpRefs = [];

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    const updated = [...otp];
    updated[index] = value.replace(/\D/, "");
    setOtp(updated);

    if (value && index < otp.length - 1) {
      otpRefs[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].focus();
    }
  };

  const sendCode = () => {
    if (!email) {
      return setToast({ open: true, message: "Please enter your registered email.", severity: "error" });
    }
    setShowOTP(true);
    setToast({ open: true, message: "Verification code sent to your email!", severity: "success" });
  };

  const verifyOtp = () => {
    if (otp.join("").length !== 6)
      return setToast({ open: true, message: "Enter full 6-digit verification code.", severity: "error" });

    setVerified(true);
    setToast({ open: true, message: "OTP Verified! Set your new password.", severity: "success" });
  };

  const resetPassword = () => {
    if (!newPass || !confirmPass)
      return setToast({ open: true, message: "Please fill out all fields.", severity: "error" });

    if (newPass !== confirmPass)
      return setToast({ open: true, message: "Passwords do not match.", severity: "error" });

    setToast({ open: true, message: "Password reset successful!", severity: "success" });
    setTimeout(() => navigate("/"), 1300);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <AppBar position="static" sx={{ background: "#003366" }} elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/login")}
          >
            Back
          </Button>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              margin: "0 auto",
              color: "white",
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            🔐 Password Recovery
          </Typography>

          <Button
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              position: "absolute",
              right: 16,
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "8px",
              px: 2
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
            backdropFilter: "blur(6px)",
            background: "rgba(255,255,255,0.85)"
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center", mb: 3, color: "#003366" }}>
            Forgot Password?
          </Typography>

          {!showOTP && (
            <>
              <TextField
                label="Registered Email Address"
                fullWidth
                sx={{ mb: 3 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button fullWidth variant="contained" sx={btnStyle} onClick={sendCode}>
                Send Verification Code
              </Button>
            </>
          )}

          {showOTP && !verified && (
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ mb: 1, fontWeight: 600, color: "#003366" }}>
                Enter Verification Code
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2 }}>
                {otp.map((digit, i) => (
                  <TextField
                    key={i}
                    value={digit}
                    inputRef={(ref) => (otpRefs[i] = ref)}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "20px", padding: "10px" }
                    }}
                    sx={{ width: "48px", background: "#fff", borderRadius: "6px" }}
                  />
                ))}
              </Box>

              <Button fullWidth variant="contained" sx={btnStyle} onClick={verifyOtp}>
                Verify Code
              </Button>
            </Box>
          )}

          {verified && (
            <>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                sx={{ mb: 3 }}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <Button fullWidth variant="contained" sx={btnStyle} onClick={resetPassword}>
                Reset Password
              </Button>
            </>
          )}
        </Paper>
      </Box>

      <Dialog open={contactOpen} onClose={() => setContactOpen(false)}>
        <DialogTitle>Contact Support</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>For assistance, please contact:</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        autoHideDuration={3000}
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

const btnStyle = {
  py: 1.2,
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 600,
  background: "linear-gradient(90deg,#003366,#0055A5)"
};
