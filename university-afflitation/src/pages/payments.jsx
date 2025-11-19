import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { QrCode2 as QrCodeIcon, FileUpload as FileUploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PaymentsPage = () => {
  const navigate = useNavigate();

  const [paymentOption, setPaymentOption] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "error" });

  const handleSubmit = () => {
    if (paymentOption === "") {
      setToast({ open: true, message: "Please select a payment option.", severity: "error" });
      return;
    }

    if (paymentOption === "now" && !receiptFile) {
      setToast({ open: true, message: "Please upload your payment receipt.", severity: "error" });
      return;
    }

    setToast({ open: true, message: "Thank you for registering!", severity: "success" });

    setTimeout(() => {
      navigate("/College-Dashboard");
    }, 2000);
  };

  const renderFileStatus = (file) =>
    file ? (
      <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
        ✅ File Uploaded: {file.name}
      </Typography>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        ❌ No file selected
      </Typography>
    );

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4 }}>
        {/* Header */}
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          color="primary.main"
          gutterBottom
        >
          Payment Portal
        </Typography>
        <Typography align="center" sx={{ mb: 4, color: "text.secondary" }}>
          Complete your university batch registration payment below.
        </Typography>

        {/* Payment Options */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Select Payment Option
        </Typography>

        <RadioGroup
          name="paymentOption"
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
        >
          <FormControlLabel
            value="later"
            control={<Radio color="primary" />}
            label="Pay during the first 3 months of course duration"
          />
          <FormControlLabel
            value="now"
            control={<Radio color="primary" />}
            label="Pay now (Immediate payment)"
          />
        </RadioGroup>

        {paymentOption === "now" && (
          <Box sx={{ mt: 4, p: 3, bgcolor: "#f0fdf4", borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} color="success.main" sx={{ mb: 2 }}>
              Payment Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} textAlign="center">
                <QrCodeIcon sx={{ fontSize: 100, color: "success.main" }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Scan this QR code to pay
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight={600}>
                  UPI ID:
                </Typography>
                <Typography sx={{ mb: 2 }}>affilitationhuff@ybl</Typography>

                <Typography variant="subtitle1" fontWeight={600}>
                  Account Number:
                </Typography>
                <Typography sx={{ mb: 2 }}>209834002934</Typography>

                <Typography variant="subtitle1" fontWeight={600}>
                  IFSC Code:
                </Typography>
                <Typography sx={{ mb: 2 }}>HDFC0008491</Typography>

                <Typography variant="subtitle1" fontWeight={600}>
                  Account Name:
                </Typography>
                <Typography sx={{ mb: 2 }}>Global Technical University</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Upload Payment Receipt
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<FileUploadIcon />}
              fullWidth
            >
              Upload Receipt (PDF / Image)
              <input
                hidden
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setReceiptFile(e.target.files[0])}
              />
            </Button>

            {renderFileStatus(receiptFile)}
          </Box>
        )}
        <Divider sx={{ my: 4 }} />
        <Box textAlign="center">
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ px: 6, py: 1.5, borderRadius: 3 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentsPage;
