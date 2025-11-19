const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `University Affiliation <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

module.exports = sendEmail;
