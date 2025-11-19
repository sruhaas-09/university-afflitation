const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const path=require('path');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, 
    credentials: true, 
  })
);

connectDB();

app.get("/", (req, res) => {
  res.send("College Affiliation Backend Running...");
});

app.use("/api/college", require("./routes/college"));
app.use("/api/university",require('./routes/university'));
app.use("/api/batch", require("./routes/batch"));
app.use("/api", require("./routes/collegeDashboard"));

app.use("/api", require("./routes/universityDashboard"));
app.use("/api/university", require("./routes/universityBatchRegistration"));
app.use("/api", require("./routes/application"));
app.use("/api/course", require("./routes/courseDashboard"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
