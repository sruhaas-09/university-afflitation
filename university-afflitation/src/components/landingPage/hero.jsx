import React from "react";
import "./hero.css";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import SchoolIcon from "@mui/icons-material/School";
import LockResetIcon from "@mui/icons-material/LockReset";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-header">
          <SchoolIcon fontSize="large" className="hero-icon" />
          <h3>University Affiliation Management</h3>
        </div>

        <h1>Streamlined College Affiliations</h1>
        <p>
          A simple, secure portal for colleges to manage affiliation applications,
          compliance, and renewals.
        </p>

        <div className="hero-buttons">
          <button className="btn primary" onClick={() => navigate("/login")}>
            <LoginIcon /> Login
          </button>
          <button className="btn secondary" onClick={() => navigate("/college/Signup")}>
            <SchoolIcon /> Register Your College
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
