import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Grid,
  CircularProgress,
  Divider,
  ListItemIcon,
  Card,
  CardContent,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { deepPurple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function UniversityDashboard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colorsMap, setColorsMap] = useState({});
  const [universityName, setUniversityName] = useState("University");

  const open = Boolean(anchorEl);

  const generateUniqueColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 85%, 88%)`;
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    navigate("/");
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate("/University/Settings");
  };

  const loadAffiliatedColleges = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/university/dashboard`, {
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/");
        return;
      }

      const data = await res.json();

      setUniversityName(data.universityName || "University");
      const collegesList = data.colleges || [];

      const map = {};
      collegesList.forEach((c) => (map[c.collegeId] = generateUniqueColor()));

      setColorsMap(map);
      setColleges(collegesList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAffiliatedColleges();
  }, []);

  const openCollege = (code) => {
    navigate(`/college/${code}`);
  };

  return (
    <Box sx={{ bgcolor: "#f4f6fb", minHeight: "100vh" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "white", borderBottom: "1px solid #dee0e7" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a237e" }}>
            🎓 {universityName}
          </Typography>

          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: deepPurple[500] }}>
              {universityName.substring(0, 2).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 4, color: "#222" }}>
          Affiliated Colleges
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {colleges.length === 0 && (
              <Typography>No affiliated colleges available.</Typography>
            )}

            {colleges.map((college) => (
              <Grid key={college.collegeId} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={4}
                  onClick={() => openCollege(college.collegeId)}
                  sx={{
                    height: "220px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    background: colorsMap[college.collegeId],
                    transition: "all 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 8,
                      background: `linear-gradient(135deg, ${colorsMap[college.collegeId]} 0%, ${
                        colorsMap[college.collegeId]
                      }dd 100%)`,
                    },
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mb: 2,
                        bgcolor: "white",
                        color: "#1a237e",
                        fontWeight: 700,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      {college.collegeId.substring(0, 2)}
                    </Avatar>

                    <Typography
                      variant="h6"
                      fontWeight={600}
                      title={college.collegeName}
                      sx={{
                        color: "#0a1a4a",
                        textAlign: "center",
                        mb: 0.8,
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        px: 1.5,
                        fontSize: "1rem",
                      }}
                    >
                      {college.collegeName}
                    </Typography>

                    <Box
                      sx={{
                        px: 1.3,
                        py: 0.55,
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(6px)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#1a237e",
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        mb: 0.5,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      }}
                    >
                      {college.collegeId}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
