const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const jwt=require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Database connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("College Affiliation Backend Running...");
});


app.get("/api/auth/check", (req, res) => {
  const token = req.cookies.collegeToken || req.cookies.universityToken;
  console.log("tok",token);

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded);

    return res.json({
      authenticated: true,
      role: decoded.role,
    });
  } catch (error) {
    return res.status(401).json({ authenticated: false });
  }
});

app.use("/api/college", require("./routes/college"));
app.use("/api/university", require("./routes/university"));
app.use("/api/batch", require("./routes/batch"));
app.use("/api", require("./routes/collegeDashboard"));
app.use("/api", require("./routes/universityDashboard"));
app.use("/api/university", require("./routes/universityBatchRegistration"));
app.use("/api", require("./routes/application"));
app.use("/api/course", require("./routes/courseDashboard"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
