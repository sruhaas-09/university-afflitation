const express = require("express");
const router = express.Router();

const authCollege = require("../middleware/auth");
const { getCollegeDashboard } =
  require("../controller/collegeDashboardController");

router.get("/CollegeDashboard", authCollege, getCollegeDashboard);


module.exports = router;
