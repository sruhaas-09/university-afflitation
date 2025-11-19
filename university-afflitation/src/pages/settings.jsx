import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleToggle = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSubmit = async () => {
    const { current, newPass, confirm } = passwords;

    if (!current || !newPass || !confirm) {
      return setToast({
        open: true,
        severity: "error",
        message: "All fields are required.",
      });
    }
    if (newPass.length < 6) {
      return setToast({
        open: true,
        severity: "error",
        message: "New password must be at least 6 characters.",
      });
    }
    if (newPass !== confirm) {
      return setToast({
        open: true,
        severity: "error",
        message: "New passwords do not match.",
      });
    }

    try {
      // Replace API after backend is ready
      // const res = await fetch("/api/university/change-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ current, newPass }),
      // });

      // Mock Success
      setTimeout(() => {
        setToast({
          open: true,
          severity: "success",
          message: "Password updated successfully!",
        });
        setPasswords({ current: "", newPass: "", confirm: "" });
      }, 700);
    } catch {
      setToast({
        open: true,
        severity: "error",
        message: "Failed to update password. Try again.",
      });
    }
  };

  const passwordField = (label, name, fieldKey) => (
    <TextField
      label={label}
      name={name}
      type={show[fieldKey] ? "text" : "password"}
      fullWidth
      value={passwords[name]}
      onChange={handleChange}
      sx={{ background: "white", borderRadius: 2 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => handleToggle(fieldKey)}>
              {show[fieldKey] ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={styles.header}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: "none" }}
          onClick={() => navigate("/university-dashboard")}
        >
          Back
        </Button>
        <Typography variant="h6" fontWeight={700}>
          University Settings – Change Password
        </Typography>
        <Box></Box>
      </Paper>

      {/* Form Card */}
      <Paper sx={styles.card}>
        <Typography variant="subtitle1" sx={styles.title}>
          Change Administrator Password
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {passwordField("Current Password", "current", "current")}
          {passwordField("New Password", "newPass", "newPass")}
          {passwordField("Confirm New Password", "confirm", "confirm")}

          <Button variant="contained" sx={styles.submitBtn} onClick={handleSubmit}>
            Update Password
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
const styles = {
  header: {
    p: 2,
    mb: 3,
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: 2,
  },
  card: {
    p: 4,
    borderRadius: "16px",
    boxShadow: 3,
    maxWidth: "650px",
    margin: "auto",
    background: "rgba(255,255,255,0.9)",
  },
  title: {
    fontWeight: 700,
    color: "#0a2a6c",
    mb: 1,
  },
  submitBtn: {
    textTransform: "none",
    fontWeight: 700,
    py: 1.3,
    borderRadius: "10px",
    background: "linear-gradient(90deg,#0d47a1,#1976d2)",
  },
};
