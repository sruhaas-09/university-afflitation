import React from "react";
import { CssBaseline, Container, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/protected";
import NotVerified from "./components/404";

import LandingPage from "./pages/UniversityLanding";
import CollegeLogin from "./pages/CollegeLogin";
import CollegeDashboard from "./pages/collegeDashboard";
import CourseDashboard from "./pages/coursedashboard";
import BatchRegistrationForm from "./pages/CollegerRegistration";
import PaymentsPage from "./pages/payments";
import UniversityAuth from "./pages/universityLogin";
import UniversityDashboard from "./pages/universityDashboard";
import CollegeDetails from "./pages/collegedetails";
import ViewApplication from "./pages/application";
import Settings from "./pages/settings";
import CollegeRegister from "./pages/collegeSignup";
import ForgotPassword from "./pages/forgotpassword";
import ViewCollegeApplication from "./pages/viewCollegeApplication";

function App() {
  return (
    <>
      <Router>
        <CssBaseline />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<CollegeLogin />} />
          <Route path="/college/Signup" element={<CollegeRegister />} />
          <Route path="/university-validation" element={<UniversityAuth />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route
            path="/College-Dashboard"
            element={
              <ProtectedRoute allowedRole="college">
                <CollegeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/College-course-Dashboard"
            element={
              <ProtectedRoute allowedRole="college">
                <CourseDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/CollegeRestration"
            element={
              <ProtectedRoute allowedRole="college">
                <BatchRegistrationForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRole="college">
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/college/:code"
            element={
              <ProtectedRoute allowedRole="college">
                <CollegeDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/college/:code/application/:applicationCode"
            element={
              <ProtectedRoute allowedRole="college">
                <ViewApplication />
              </ProtectedRoute>
            }
          />

          <Route
            path="/college/application/:applicationCode"
            element={
              <ProtectedRoute allowedRole="college">
                <ViewCollegeApplication />
              </ProtectedRoute>
            }
          />

          <Route
            path="/university-Dashboard"
            element={
              <ProtectedRoute allowedRole="university">
                <UniversityDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/university/settings"
            element={
              <ProtectedRoute allowedRole="university">
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="/not-verified" element={<NotVerified />} />
          <Route path="*" element={<NotVerified />} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
