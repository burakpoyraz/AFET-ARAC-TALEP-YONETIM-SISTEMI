import nodemailer from "nodemailer";

export const mailGonder = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADRESI,
        pass: process.env.GMAIL_SIFRESI,
      },
    });

    const mailOptions = {
      from: `"Afet Arac Sistemi" <${process.env.GMAIL_ADRESI}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ E-posta gönderildi:", to);
  } catch (error) {
    console.error("❌ Mail gönderme hatası:", error.message);
  }
};