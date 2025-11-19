const Batch = require("../models/batchRegistration");

exports.registerBatch = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const fileFields = [
      "studentFile",
      "financialSignature",
      "academicSignature",
      "principalSignature",
      "authorizationCertificate",
    ];

    for (const field of fileFields) {
      if (!req.files[field] || req.files[field].length === 0) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const data = { ...req.body };

    data.studentFile = req.files.studentFile[0].path;
    data.financialSignature = req.files.financialSignature[0].path;
    data.academicSignature = req.files.academicSignature[0].path;
    data.principalSignature = req.files.principalSignature[0].path;
    data.authorizationCertificate = req.files.authorizationCertificate[0].path;

    const batch = await Batch.create(data);

    res.status(201).json({
      message: "Batch registration saved successfully",
      batch,
    });

  } catch (err) {
    console.error("Batch Registration Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
