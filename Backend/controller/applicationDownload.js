const Application = require("../models/batchRegistration");
const PDFDocument = require("pdfkit");

exports.downloadApplicationSummary = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const app = await Application.findOne({ _id: applicationId });

    if (!app) return res.status(404).send("Application not found");

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=application_${applicationId}.pdf`
    );

    doc.pipe(res);

    doc
      .rect(0, 0, doc.page.width, 60)
      .fill("#0a2a6c")
      .fillColor("#ffffff")
      .fontSize(18)
      .text("Application Summary", 50, 20);

    doc.moveDown(2);

    const sectionTitle = (title) => {
      doc.moveDown(1);
      doc
        .fillColor("#0a2a6c")
        .fontSize(14)
        .text(title, { underline: true });
      doc.moveDown(0.5);
      doc.fillColor("#000000");
    };

    const field = (label, value) => {
      doc
        .fontSize(11)
        .fillColor("#374151")
        .text(`${label}: `, { continued: true })
        .fillColor("#111827")
        .text(value ?? "-");
    };


    sectionTitle("Institution & Submission");

    field("University", `${app.universityName} (${app.universityCode})`);
    field("College", `${app.collegeName} (${app.collegeCode})`);
    field("Academic Semester", app.semester);
    field("Submission Date", new Date(app.submissionDate).toLocaleDateString());

    doc.moveDown();

    sectionTitle("Program Details");

    field("Program", app.programName);
    field("Branch / Specialization", app.branch);
    field("Level", app.level);
    field("Duration", `${app.duration} Years`);
    field("Total Semesters", app.totalSemesters);
    field("Max Intake / Seats", app.maxIntake);
    field("Students Registered", app.registered);

    doc.moveDown();

    sectionTitle("Contact Information");
    field("Contact Person", app.contactName);
    field("Email", app.email);
    field("Phone", app.phone);

    doc.moveDown();

    sectionTitle("Current Status");
    field("Status", app.status);

    // ===== REMARKS =====
    sectionTitle("Remarks History");

    if (app.remarks && app.remarks.length > 0) {
      app.remarks.forEach((r, i) => {
        doc
          .moveDown(0.5)
          .fontSize(11)
          .fillColor("#0a2a6c")
          .text(`${i + 1}. Status: ${r.status}`);

        doc
          .fontSize(10)
          .fillColor("#374151")
          .text(`Date: ${new Date(r.timestamp).toLocaleString()}`);

        doc
          .fontSize(10)
          .fillColor("#111827")
          .text(`Remark: ${r.text}`);
      });
    } else {
      doc.fontSize(11).fillColor("#6b7280").text("No remarks available.");
    }

    doc.moveDown(2);
    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .text(
        `Generated on ${new Date().toLocaleString()}`,
        50,
        doc.page.height - 50,
        { align: "center" }
      );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate summary PDF");
  }
};
