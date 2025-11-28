import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./coursedashboard.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://university-afflitation-dfiz.onrender.com";

const CourseDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ug");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);

  // ================= LOAD COURSES =================
  const loadCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/course/courses`, {
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        setCourses(
          data.data.map((c) => ({
            id: c._id,
            name: c.programName,
            branch: c.branch,
            code: c.programCode,
            start: c.startDate?.slice(0, 10),
            end: c.endDate?.slice(0, 10),
            duration: `${c.duration} Years`,
            intake: c.maxIntake,
            enrolled: c.registered,
            studentFile: c.studentFile, // IMPORTANT
            status:
              c.status === "Approved"
                ? "Active"
                : c.status === "Hold"
                ? "Hold"
                : "Pending",
            type: "ug",
          }))
        );
      }
    } catch (err) {
      console.log("Error loading courses:", err);
    }
  };

  useEffect(() => {
    loadCourses();

    // Auto-refresh every 10 seconds
    const timer = setInterval(loadCourses, 10000);
    return () => clearInterval(timer);
  }, []);

  // ================= FILTERING =================
  const filteredCourses = courses.filter((course) => {
    const matchType = course.type === activeTab;
    const matchStatus =
      statusFilter === "All" || course.status === statusFilter;
    const matchSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchStatus && matchSearch;
  });

  // ================= DOWNLOAD STUDENTS FILE =================
  const downloadStudents = (filePath) => {
    if (!filePath) {
      alert("No student file uploaded.");
      return;
    }

    const onlyName = filePath.split(/[/\\]/).pop();
    window.open(`${API_BASE_URL}/uploads/${onlyName}`, "_blank");
  };

  return (
    <div className="course-dashboard">

      <div className="dashboard-header">
        <h2>Course Dashboard</h2>
      </div>

      <div className="dashboard-content">

        <div className="top-bar">
          <button className="back-btn" onClick={() => navigate('/College-Dashboard')}>
            <ArrowBackIcon /> Back
          </button>

          <h3>Course Overview</h3>

          <div className="export-buttons">
            <button className="export-btn excel">
              <DownloadIcon fontSize="small" /> Excel
            </button>
            <button className="export-btn csv">
              <DownloadIcon fontSize="small" /> CSV
            </button>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "diploma" ? "active" : ""}`}
            onClick={() => setActiveTab("diploma")}
          >
            Diploma
          </button>
          <button
            className={`tab-btn ${activeTab === "ug" ? "active" : ""}`}
            onClick={() => setActiveTab("ug")}
          >
            Undergraduate (UG)
          </button>
          <button
            className={`tab-btn ${activeTab === "pg" ? "active" : ""}`}
            onClick={() => setActiveTab("pg")}
          >
            Postgraduate (PG)
          </button>
        </div>

        <div className="filters">
          <div className="search-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search by course, branch, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-wrapper">
            <FilterListIcon />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Hold">Hold</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {filteredCourses.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Branch</th>
                  <th>Code</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Duration</th>
                  <th>Intake</th>
                  <th>Enrolled</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.name}</td>
                    <td>{course.branch}</td>
                    <td>{course.code}</td>
                    <td>{course.start}</td>
                    <td>{course.end}</td>
                    <td>{course.duration}</td>
                    <td>{course.intake}</td>
                    <td>{course.enrolled}</td>

                    <td>
                      <span className={`status-badge status-${course.status.toLowerCase()}`}>
                        {course.status}
                      </span>
                    </td>

                    <td className="actions-col">
                      <div className="action-btn-wrapper">
                        <button
                          className="view-btn"
                          onClick={() =>
                            navigate(`/college/application/${course.id}`)
                          }
                        >
                          View Application
                        </button>

                        <button
                          className="students-btn"
                          onClick={() => downloadStudents(course.studentFile)}
                        >
                          Download Students
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No courses found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard;
