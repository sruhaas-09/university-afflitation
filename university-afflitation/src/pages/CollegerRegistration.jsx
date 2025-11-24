import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Apartment as ApartmentIcon,
  School as SchoolIcon,
  FolderCopy as FolderCopyIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  FileUpload as FileUploadIcon,
  ContactPhone as ContactPhoneIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://university-afflitation-dfiz.onrender.com";

const BatchRegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    universityName: "",
    universityCode: "",
    collegeName: "",
    collegeCode: "",
    semester: "",
    submissionDate: "",
    programName: "",
    branch: "",
    programCode: "",
    level: "",
    duration: "",
    startDate: "",
    endDate: "",
    totalSemesters: "",
    maxIntake: "",
    registered: "",
    studentFile: null,
    financialSignature: null,
    academicSignature: null,
    principalSignature: null,
    authorizationCertificate: null,
    contactName: "",
    designation: "",
    phone: "",
    email: "",
  });

  const [toast, setToast] = useState({ open: false, message: "", severity: "error" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "universityName","universityCode","collegeName","collegeCode","semester","submissionDate",
      "programName","branch","programCode","level","duration","startDate","endDate",
      "totalSemesters","maxIntake","registered","studentFile","financialSignature",
      "academicSignature","principalSignature","authorizationCertificate",
      "contactName","designation","phone","email"
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return setToast({
          open: true,
          message: `Please fill or upload: ${field}`,
          severity: "error",
        });
      }
    }

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));
      console.log(dataToSend);

      const res = await fetch(`${API_BASE_URL}/api/batch/register`, {
        method: "POST",
        body: dataToSend,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setToast({ open: true, message: "Batch submitted successfully!", severity: "success" });
        setTimeout(() => navigate("/payments"), 1200);
      } else {
        setToast({ open: true, message: data.error || "Submission failed.", severity: "error" });
      }
    } catch (err) {
      setToast({ open: true, message: "Server error. Try again.", severity: "error" });
    }
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        <Typography variant="h4" align="center" fontWeight={700} color="primary.main" gutterBottom>
          University Batch Registration Portal
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 5, color: "text.secondary" }}>
          Administrative submission form for institutional batch registration
        </Typography>

        <Box sx={{ mb: 6, bgcolor: "#f8fafc", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={sectionTitle("#1d4ed8")}>
            <ApartmentIcon /> Institutional & Submission Context
          </Typography>
          <Grid container spacing={2}>
            {[
              ["University Name", "universityName"],
              ["University Code", "universityCode", "number"],
              ["College / Institution Name", "collegeName"],
              ["College Code / Affiliation No.", "collegeCode"],
              ["Academic Semester", "semester", "number"],
              ["Submission Date", "submissionDate", "date"],
            ].map(([label, name, type = "text"]) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  type={type}
                  fullWidth
                  InputLabelProps={type === "date" ? { shrink: true } : {}}
                  onChange={handleChange}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mb: 6, bgcolor: "#f0fdf4", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={sectionTitle("#059669")}>
            <SchoolIcon /> Program and Course Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Program / Course Name" name="programName" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Branch / Specialization" name="branch" fullWidth onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField label="Program Code" name="programCode" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="level-label">Level</InputLabel>
                <Select labelId="level-label" name="level" defaultValue="" onChange={handleChange}>
                  <MenuItem value=""><em>Select Level</em></MenuItem>
                  <MenuItem value="UG">UG (Undergraduate)</MenuItem>
                  <MenuItem value="PG">PG (Postgraduate)</MenuItem>
                  <MenuItem value="Diploma">Diploma</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Course Duration (Years)" type="number" name="duration" fullWidth onChange={handleChange}/>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Program Start Date" type="date" name="startDate" fullWidth InputLabelProps={{ shrink: true }} onChange={handleChange}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Program End Date" type="date" name="endDate" fullWidth InputLabelProps={{ shrink: true }} onChange={handleChange}/>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField label="Total Semesters" type="number" name="totalSemesters" fullWidth onChange={handleChange}/>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Max Intake / Sanctioned Seats" type="number" name="maxIntake" fullWidth onChange={handleChange}/>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Students Registered" type="number" name="registered" fullWidth onChange={handleChange}/>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 6, bgcolor: "#ecfeff", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={sectionTitle("#0891b2")}>
            <FolderCopyIcon /> Student Data Upload
          </Typography>

          <Button variant="outlined" component="label" startIcon={<FileUploadIcon />} fullWidth>
            Upload Student Data File (.xlsx / .xls)
            <input hidden type="file" name="studentFile" accept=".xlsx,.xls" onChange={handleFileChange} />
          </Button>
          {renderFileStatus(formData.studentFile)}
        </Box>

        <Box sx={{ mb: 6, bgcolor: "#fff7ed", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={sectionTitle("#ea580c")}>
            <AdminPanelSettingsIcon /> Administrative Clearance & Authorization
          </Typography>

          {[
            ["Financial Clearance Officer Signature", "financialSignature"],
            ["Academic Clearance Officer Signature", "academicSignature"],
            ["Principal / Director Signature", "principalSignature"],
          ].map(([label, name]) => (
            <Box key={name} sx={{ mb: 3 }}>
              <Button variant="outlined" component="label" startIcon={<FileUploadIcon />} fullWidth>
                {label}
                <input hidden type="file" name={name} accept="image/*" onChange={handleFileChange} />
              </Button>
              {renderFileStatus(formData[name])}
            </Box>
          ))}
        </Box>

        <Box sx={{ bgcolor: "#f5f3ff", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={sectionTitle("#7e22ce")}>
            <ContactPhoneIcon /> Official Documents & Contact Details
          </Typography>

          <Button variant="outlined" component="label" startIcon={<FileUploadIcon />} fullWidth>
            Upload Authorization Certificate (PDF / Image)
            <input hidden type="file" name="authorizationCertificate" accept=".pdf,image/*" onChange={handleFileChange} />
          </Button>
          {renderFileStatus(formData.authorizationCertificate)}

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Contact Person Name" name="contactName" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Designation" name="designation" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Contact Phone" name="phone" fullWidth onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Contact Email" name="email" fullWidth onChange={handleChange} />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 5 }} />
        <Box textAlign="center">
          <Button variant="contained" color="success" size="large" sx={{ px: 6, py: 1.5, borderRadius: 3 }} onClick={handleSubmit}>
            Submit Batch Registration
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const sectionTitle = (color) => ({
  borderBottom: "2px solid #e0e0e0",
  pb: 1,
  mb: 3,
  display: "flex",
  alignItems: "center",
  gap: 1,
  color,
});

export default BatchRegistrationForm;
