const express = require("express");
const router = express.Router();
const authCollege = require("../middleware/auth");

const { getCourses, getStudents } = require("../controller/courseDashboard");

router.get("/courses", authCollege, getCourses);
router.get("/courses/:batchId/students", authCollege, getStudents);

module.exports = router;
