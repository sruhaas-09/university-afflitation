import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SchoolIcon from "@mui/icons-material/School";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./collegeLogin.css";

function CollegeLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [showContinue, setShowContinue] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [code, setCode] = useState(Array(6).fill(""));

  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    theme: "colored",
    hideProgressBar: true,
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/college";

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const updated = [...code];
      updated[index] = value;
      setCode(updated);
      if (value && index < 5) {
        const next = document.getElementById(`code-${index + 1}`);
        next?.focus();
      }
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warn("Please fill in all fields first.", toastOptions);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setShowContinue(false);
        setShowVerification(true);
        toast.success("OTP sent to your email!", toastOptions);
        setTimeout(() => document.getElementById("code-0")?.focus(), 200);
      } else {
        toast.error(data.error || "Failed to send OTP", toastOptions);
      }
    } catch (err) {
      toast.error("Server error. Try again.", toastOptions);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const otp = code.join("");
    if (otp.length !== 6) {
      toast.error("Please enter complete 6-digit verification code.", toastOptions);
      return;
    }

    const affiliationId = document.getElementById("affId").value;
    const collegeName = document.getElementById("colName").value;
    const password = document.getElementById("colPass").value;

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId: affiliationId,
          collegeName,
          email,
          password,
          otp
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Successful! Redirecting...", toastOptions);
        setTimeout(() => navigate("/College-Dashboard"), 2000);
      } else {
        toast.error(data.error || "Invalid credentials", toastOptions);
      }
    } catch (err) {
      toast.error("Server error. Try again.", toastOptions);
    }
  };

  return (
    <div className="login-page">
 
      <nav className="login-navbar">
        <div className="nav-left">
          <AccountBalanceIcon className="nav-icon" />
          <span className="nav-title">College Affiliation Portal</span>
        </div>
        <div className="nav-right">
          <button className="navbar-btn" onClick={() => navigate("/")}>
            Back
          </button>
          <button className="navbar-btn" onClick={() => navigate("/forgot-password")}>
            Forgot Password
          </button>
          <button className="navbar-btn">Contact Us</button>
        </div>
      </nav>

      <div className="form-container">
        <div className="form-box">
          <div className="form-header">
            <SchoolIcon className="graduation-icon" />
            <div>
              <h2>College Login</h2>
              <p>Secure access for affiliated colleges to manage courses, faculty, and registrations.</p>
            </div>
          </div>

          <form className="login-form" onSubmit={showVerification ? handleLogin : handleContinue}>
            <label>Affiliation ID</label>
            <input id="affId" type="text" placeholder="Enter Affiliation ID" required />

            <label>College Name</label>
            <input id="colName" type="text" placeholder="Enter College Name" required />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input id="colPass" type="password" placeholder="Enter Password" required />

            {showContinue && (
              <button type="submit" className="btn-login">
                Continue
              </button>
            )}

            {showVerification && (
              <>
                <div className="verification-box">
                  <p className="code-label">Enter Verification Code</p>
                  <div className="code-inputs">
                    {code.map((num, idx) => (
                      <input
                        key={idx}
                        id={`code-${idx}`}
                        type="text"
                        maxLength="1"
                        value={num}
                        onChange={(e) => handleChange(e.target.value, idx)}
                      />
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-login">
                  Login
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default CollegeLogin;
