import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Button, TextField,
  Table, TableHead, TableRow, TableCell, TableBody,
  Select, FormControl, InputLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://university-afflitation-dfiz.onrender.com";

export default function CollegeDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams();

  const [collegeName, setCollegeName] = useState("College");
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [commentsDialog, setCommentsDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/university/college/${code}/batches`, {
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setApplications(data.data || []);
        if (data.data.length > 0) setCollegeName(data.data[0].collegeName);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    setTimeout(loadData(),10000);
    return ()=>clearInterval();
  }, [code]);

  const filteredApps = applications.filter((app) => {
    const statusMatch = statusFilter === "All" || app.status === statusFilter;
    const searchMatch =
      app.programName.toLowerCase().includes(search.toLowerCase()) ||
      app.programCode.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const downloadCSV = () => {
    const rows = [
      ["Course Name", "Code", "Applied Date", "Status"],
      ...filteredApps.map(app => [
        app.programName,
        app.programCode,
        app.submissionDate?.slice(0, 10),
        app.status
      ])
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map(row => row.map(v => `"${v ?? ""}"`).join(",")).join("\n");

    const blob = new Blob([decodeURI(csvContent)], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${collegeName}_batches.csv`);
  };

  const downloadExcel = () => {
    const wsData = [
      ["Course Name", "Code", "Applied Date", "Status"],
      ...filteredApps.map(app => [
        app.programName,
        app.programCode,
        app.submissionDate?.slice(0, 10),
        app.status
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Batches");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), `${collegeName}_batches.xlsx`);
  };

  const openComments = (row) => {
    const sortedRemarks = [...(row.remarks || [])].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setSelectedApp({ ...row, remarks: sortedRemarks });
    setCommentsDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={styles.headerCard}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={styles.backBtn}
          onClick={() => navigate("/university-dashboard")}
        >
          Back
        </Button>

        <Typography variant="h6" fontWeight={700} sx={{ color: "#0a2a6c" }}>
          {collegeName} – Affiliated Courses
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<FileDownloadIcon />}
            sx={styles.exportBtn}
            onClick={downloadExcel}
          >
            Excel
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<FileDownloadIcon />}
            sx={styles.exportBtn}
            onClick={downloadCSV}
          >
            CSV
          </Button>
        </Box>
      </Paper>

      <Paper sx={styles.filterCard}>
        <TextField
          fullWidth
          placeholder="Search by course name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={styles.searchField}
        />

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            native
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={styles.selectField}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Hold">Hold</option>
            <option value="Pending">Pending</option>
          </Select>
        </FormControl>
      </Paper>

      {/* Table */}
      <Paper sx={styles.tableCard}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#123C69" }}>
              <TableCell sx={styles.tableHead}>Course Name</TableCell>
              <TableCell sx={styles.tableHead}>Code</TableCell>
              <TableCell sx={styles.tableHead}>Applied Date</TableCell>
              <TableCell sx={styles.tableHead}>Status</TableCell>
              <TableCell sx={styles.tableHeadCenter}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredApps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, fontWeight: 600, color: "#777" }}>
                  No applications found for this college.
                </TableCell>
              </TableRow>
            ) : (
              filteredApps.map((row) => (
                <TableRow key={row._id} sx={styles.tableRow}>
                  <TableCell>{row.programName}</TableCell>
                  <TableCell>{row.programCode}</TableCell>
                  <TableCell>{row.submissionDate?.slice(0, 10)}</TableCell>

                  <TableCell>
                    <Box sx={styles.statusBox(row.status)}>{row.status}</Box>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      sx={styles.viewBtn}
                      onClick={() => navigate(`/college/${code}/application/${row._id}`)}
                    >
                      View Application
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      sx={styles.commentBtn}
                      onClick={() => openComments(row)}
                    >
                      View Comments
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={commentsDialog} onClose={() => setCommentsDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: "#0a2a6c" }}>
          Application Remarks / Comments
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
          {selectedApp?.remarks?.length ? (
            selectedApp.remarks.map((r, i) => (
              <Paper key={i} sx={styles.commentCard}>
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{r.status}</Typography>
                <Typography>{r.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(r.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No remarks available.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCommentsDialog(false)} sx={styles.closeBtn}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
const styles = {
  headerCard: {
    p: 2.5,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "14px",
    mb: 3,
    boxShadow: 3
  },
  backBtn: { textTransform: "none", fontWeight: 600 },
  exportBtn: { textTransform: "none", fontWeight: 600, borderRadius: "10px" },
  filterCard: { p: 2, mb: 3, display: "flex", gap: 2, borderRadius: "14px", boxShadow: 1 },
  searchField: { background: "#fff", borderRadius: "10px" },
  selectField: { background: "#fff", borderRadius: "10px" },
  tableCard: { borderRadius: "14px", overflow: "hidden", boxShadow: 3 },
  tableHead: { color: "white", fontWeight: 700 },
  tableHeadCenter: { color: "white", fontWeight: 700, textAlign: "center" },
  tableRow: { "&:hover": { background: "#f5f8ff" } },
  statusBox: (status) => ({
    width: "120px",
    height: "32px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    color: "#fff",
    textTransform: "uppercase",
    backgroundColor:
      status === "Approved" ? "#2E7D32" :
      status === "Rejected" ? "#C62828" :
      status === "Hold" ? "#ED6C02" : "#546E7A",
  }),
  viewBtn: { textTransform: "none", mr: 1, borderRadius: "8px" },
  commentBtn: { textTransform: "none", borderRadius: "8px" },
  commentCard: { p: 2, mb: 1, background: "#f8f9ff", borderRadius: "10px" },
  closeBtn: { textTransform: "none", fontWeight: 600 },
};
