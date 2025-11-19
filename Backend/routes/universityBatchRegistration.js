const express = require("express");
const router = express.Router();
const universityAuth = require("../middleware/universityAuth");
const {
  getCollegeBatches,
  getBatchById,
  updateStatus
} = require("../controller/universityBatchController");

router.get("/college/:collegeCode/batches", universityAuth, getCollegeBatches);

router.get("/batch/:id", universityAuth, getBatchById);

router.post("/batch/:id/status", universityAuth, updateStatus);

module.exports = router;
