import React from "react";
import HeroSection from "../components/landingPage/hero";
import ImageCarousel from '../components/landingPage/Carousel'
import './landingpage.css'
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">
          <SchoolIcon className="logo-icon" />
          <span>Affiliation Hub</span>
        </div>
        <button className="admin-btn" onClick={()=>navigate('/university-validation')}>
          <AccountBalanceIcon/>University Portal
        </button>
      </header>
      <main className="main-section">
        <HeroSection />
        < ImageCarousel />
      </main>
    </div>
  );
}

export default LandingPage;
