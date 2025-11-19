import React, { useState, useEffect } from "react";
import "./collegeDashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CollegeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [collegeName, setCollegeName] = useState("");
  const [profileInitials, setProfileInitials] = useState("UN");

  const [stats, setStats] = useState({
    pending: 0,
    onHold: 0,
    approved: 0,
    total: 0,
  });

  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Dialog state
  const [commentDialog, setCommentDialog] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);

  // ========== FETCH DASHBOARD DATA ==========
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/CollegeDashboard`, {
        credentials: "include",
      });

      const data = await res.json();

      setCollegeName(data.collegeName || "");
      setProfileInitials((data.collegeName || "UN").substring(0, 2).toUpperCase());

      setStats(data.stats || {});
      setApplications(data.pendingApplications || []);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const timer = setInterval(fetchDashboard, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [location.key]);

  // ========== TOGGLE PROFILE DROPDOWN ==========
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // ========== OPEN COMMENTS IN DIALOG ==========
  const openCommentDialog = (comments) => {
    setCurrentComments(comments || []);
    setCommentDialog(true);
  };

  return (
    <div>
      <div className="header">
        <h2>🏫 {collegeName}</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <div className="nav-buttons">
            <button className="nav-btn active" onClick={()=>navigate("/College-course-Dashboard")}>Dashboard</button>

            <button
              className="nav-btn new-affiliation"
              onClick={() => navigate("/CollegeRestration")}
            >
              Start New Registration
            </button>
          </div>

          <div className="profile-container" onClick={toggleDropdown}>
            <div className="profile-circle">{profileInitials}</div>

            <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
              <button className="dropdown-item profile-btn">Payment History</button>
              <button className="dropdown-item profile-btn">Settings</button>
              <div className="menu-divider"></div>
              <button className="dropdown-item logout-btn" onClick={() => navigate("/")}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">

        <div className="left-content">

          <div className="status-card-group">
            <div className="status-card card-pending">
              <h4>Pending Review</h4>
              <h1>{stats.pending}</h1>
            </div>
            <div className="status-card card-hold">
              <h4>On Hold</h4>
              <h1>{stats.onHold}</h1>
            </div>
            <div className="status-card card-approved">
              <h4>Approved</h4>
              <h1>{stats.approved}</h1>
            </div>
            <div className="status-card card-total">
              <h4>Total Applications</h4>
              <h1>{stats.total}</h1>
            </div>
          </div>

          <div className="card">
            <h3>Pending Applications</h3>

            {applications.length === 0 ? (
              <p className="empty-text">No pending applications</p>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="application-item">
                  <div className="app-details">
                    <h4>{app.collegeName}</h4>
                    <p>Submitted: {new Date(app.submittedOn).toLocaleDateString()}</p>
                  </div>

                  <button
                    className="btn-sm modification-btn"
                    onClick={() => openCommentDialog(app.comments)}
                  >
                    View Comments
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="right-sidebar">
          <div className="payment-alert">
            <h4>Pending Payment</h4>
            <h3>₹0</h3>
            <p>Payment upcoming in short time.</p>
            <button className="btn-primary">Pay Now</button>
          </div>

          <div className="card">
            <h3>Notifications</h3>

            <ul className="notification-list">
              {notifications.length === 0 ? (
                <p className="empty-text">No notifications</p>
              ) : (
                notifications.map((note, index) => (
                  <li key={index} className="notification-item">
                    {note}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <Dialog open={commentDialog} onClose={() => setCommentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Application Remarks / Comments</DialogTitle>

        <DialogContent>
          {currentComments.length === 0 ? (
            <Typography sx={{ mt: 1 }}>No comments available.</Typography>
          ) : (
            currentComments.map((c, i) => (
              <Paper key={i} sx={{ p: 2, mb: 1, borderRadius: "10px", background: "#f7f9ff" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {c.status}
                </Typography>
                <Typography sx={{ mt: 0.5 }}>{c.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(c.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCommentDialog(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CollegeDashboard;
