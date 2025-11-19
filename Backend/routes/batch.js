const router = require("express").Router();
const upload = require("../middleware/upload");
const { registerBatch } = require("../controller/batchController");
const college_Auth=require("../middleware/auth");

router.post(
  "/register",
  upload.fields([
    { name: "studentFile", maxCount: 1 },
    { name: "financialSignature", maxCount: 1 },
    { name: "academicSignature", maxCount: 1 },
    { name: "principalSignature", maxCount: 1 },
    { name: "authorizationCertificate", maxCount: 1 },
  ]),college_Auth,
  registerBatch
);

module.exports = router;
