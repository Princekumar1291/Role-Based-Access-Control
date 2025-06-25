const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      console.error('❌ Invalid recipient email:', to);
      return;
    }

    console.log("📧 Sending email to:", to);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"RBAC App" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

module.exports = sendEmail;
