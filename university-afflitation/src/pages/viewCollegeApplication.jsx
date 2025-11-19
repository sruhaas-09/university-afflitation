import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, CircularProgress, Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ViewCollegeApplication() {
  const navigate = useNavigate();
  const { code, applicationCode } = useParams();

  const [application, setApplication] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusToSet, setStatusToSet] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/university/application/${applicationCode}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const appData = data.data || data.application;
        setApplication(appData);
        setRemarks(appData.remarks || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [applicationCode]);

  const submitStatusChange = async () => {
    if (!remarkText.trim()) return setError("Please enter a remark.");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/university/application/${applicationCode}/status`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusToSet, remark: remarkText }),
        }
      );
      const data = await res.json();
      if (data.success) {
        await loadData();
        setStatusDialogOpen(false);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const downloadApplicationPDF = () => {
    window.open(`${API_BASE_URL}/api/university/application/${applicationCode}/download`, "_blank");
  };

  const openFile = (fileName) => {
    if (!fileName) return;
    const onlyName = fileName.split(/[/\\]/).pop();
    window.open(`${API_BASE_URL}/uploads/${onlyName}`, "_blank");
  };

  const statusColor = (status) =>
    status === "Approved" ? "#0E9F6E"
      : status === "Rejected" ? "#DC2626"
      : status === "Hold" ? "#F59E0B"
      : "#475569";

  if (loading || !application)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2, color: "#94a3b8" }}>Loading application...</Typography>
      </Box>
    );

  return (
    <Box sx={styles.page}>
      <Paper sx={styles.headerCard}>
        <Button startIcon={<ArrowBackIcon />} sx={styles.backBtn}
          onClick={() => navigate("/college-course-dashboard")}>
          Back
        </Button>

        <Typography variant="h6" sx={styles.headerTitle}>
          {application.programName} — Application
        </Typography>

        <Box sx={styles.statusPill(statusColor(application.status))}>
          {application.status}
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<DownloadIcon />} sx={styles.downloadBtn}
          onClick={downloadApplicationPDF}>
          Download PDF
        </Button>
      </Box>

      <Section title="Institution & Submission">
        {Detail("University Name", application.universityName)}
        {Detail("University Code", application.universityCode)}
        {Detail("College / Institution Name", application.collegeName)}
        {Detail("College Code / Affiliation No.", application.collegeCode)}
        {Detail("Academic Semester", application.semester)}
        {Detail("Submission Date", application.submissionDate?.slice(0, 10))}
      </Section>

      <Section title="Program & Course Summary">
        {Detail("Program / Course Name", application.programName)}
        {Detail("Branch / Specialization", application.branch)}
        {Detail("Program Code", application.programCode)}
        {Detail("Level", application.level)}
        {Detail("Duration (Years)", application.duration)}
        {Detail("Start Date", application.startDate?.slice(0, 10))}
        {Detail("End Date", application.endDate?.slice(0, 10))}
        {Detail("Total Semesters", application.totalSemesters)}
        {Detail("Max Intake / Seats", application.maxIntake)}
        {Detail("Students Registered", application.registered)}
      </Section>

      <Section title="Uploaded Files & Certificates">
        <Grid container spacing={2}>
          {FileItem("Student Excel File", application.studentFile)}
          {FileItem("Financial Officer Signature", application.financialSignature)}
          {FileItem("Academic Officer Signature", application.academicSignature)}
          {FileItem("Principal / Director Signature", application.principalSignature)}
          {FileItem("Authorization Certificate", application.authorizationCertificate)}
        </Grid>
      </Section>

      {/* CLEAN REMARKS LIST (NO ICONS, SIMPLE FORMAT) */}
      <Section title="Remarks / Status Updates">
        {remarks.length ? remarks.map((r, i) => (
          <Paper key={i} sx={styles.remarkCard}>
            <Typography fontWeight={600} sx={{ color: statusColor(r.status) }}>
              {r.status}
            </Typography>

            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              {new Date(r.timestamp).toLocaleString()}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line" }}>
              {r.text}
            </Typography>
          </Paper>
        )) : (
          <Typography sx={{ color: "#94a3b8" }}>No remarks available.</Typography>
        )}
      </Section>
    </Box>
  );

  function openStatusDialog(status) {
    setStatusToSet(status);
    setRemarkText("");
    setError("");
    setStatusDialogOpen(true);
  }

  function Section({ title, children }) {
    return (
      <Paper sx={styles.sectionCard}>
        <Typography variant="subtitle1" sx={styles.sectionTitle}>{title}</Typography>
        <Grid container spacing={2}>{children}</Grid>
      </Paper>
    );
  }

  function Detail(label, value) {
    return (
      <Grid item xs={12}>
        <Typography variant="body2" sx={styles.detailLabel}>{label}</Typography>
        <Typography fontWeight={500}>{value || "-"}</Typography>
      </Grid>
    );
  }

  function ActionBtn(label, color) {
    return (
      <Button variant="contained" sx={{ ...styles.actionBtn, background: color }}
        onClick={() => openStatusDialog(label)}>
        {label}
      </Button>
    );
  }

  function FileItem(label, filePath) {
    if (!filePath)
      return (
        <Grid item xs={12}>
          <Paper sx={styles.fileCardEmpty}>
            <Typography fontWeight={600}>{label}</Typography>
            <Typography variant="body2" sx={{ color: "#DC2626" }}>Not uploaded</Typography>
          </Paper>
        </Grid>
      );

    const fileName = filePath.split(/[/\\]/).pop();
    const isPreviewType = /\.(png|jpg|jpeg|pdf)$/i.test(fileName);

    return (
      <Grid item xs={12}>
        <Paper sx={styles.fileCard}>
          <Box sx={styles.fileLeft}>
            <DescriptionIcon sx={{ fontSize: 26, color: "#475569" }} />
            <Box>
              <Typography fontWeight={600}>{label}</Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>{fileName}</Typography>
            </Box>
          </Box>

          <Box sx={styles.fileRight}>
            {isPreviewType && (
              <Button size="small" variant="outlined" sx={styles.fileBtnOutline}
                startIcon={<VisibilityIcon />} onClick={() => openFile(fileName)}>Preview</Button>
            )}
            <Button size="small" variant="contained" sx={styles.fileBtn}
              startIcon={<DownloadIcon />} onClick={() => openFile(fileName)}>Download</Button>
          </Box>
        </Paper>
      </Grid>
    );
  }
}

const styles = {
  page: { p: 3, maxWidth: "1100px", mx: "auto" },

  headerCard: {
    p: 2.3,
    mb: 3,
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  },

  headerTitle: { flexGrow: 1, textAlign: "center", fontWeight: 600, color: "#0f172a" },
  backBtn: { textTransform: "none", fontWeight: 500, color: "#334155" },

  statusPill: (bg) => ({
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: bg,
  }),

  downloadBtn: { borderRadius: "10px", textTransform: "none" },

  sectionCard: {
    p: 3,
    mb: 3,
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
  },

  sectionTitle: {
    mb: 2,
    color: "#0f172a",
    fontWeight: 600,
    borderBottom: "1px solid #e2e8f0",
    pb: 1,
  },

  detailLabel: { color: "#64748b", fontSize: "13px" },

  fileCard: {
    p: 2,
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },

  fileCardEmpty: {
    p: 2,
    borderRadius: "14px",
    background: "#fff1f2",
    border: "1px dashed #fecdd3",
  },

  fileLeft: { display: "flex", alignItems: "center", gap: 1.5 },
  fileRight: { display: "flex", alignItems: "center", gap: 1 },

  remarkCard: {
    p: 2,
    mb: 1.4,
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
  },

  bottomBar: {
    mt: 3,
    display: "flex",
    justifyContent: "flex-end",
    gap: 2,
    paddingTop: 12,
  },

  actionBtn: {
    textTransform: "none",
    borderRadius: "12px",
    fontWeight: 600,
    minWidth: "120px",
  },

  fileBtn: { textTransform: "none", borderRadius: "8px" },
  fileBtnOutline: { textTransform: "none", borderRadius: "8px" },
};
