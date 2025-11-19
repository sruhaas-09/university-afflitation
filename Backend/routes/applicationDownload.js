const { downloadApplicationSummary } = require("../controller/applicationDownload");

router.get("/application/:applicationId/summary-pdf", downloadApplicationSummary);
