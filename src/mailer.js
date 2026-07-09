const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);
const sendResetCodeEmail = async (toEmail, code) => {
  await resend.emails.send({
    from: "onboarding@resend.dev", 
    to: toEmail,
    subject: "Your Password Reset Code",
    html: `<p>Your password reset code is: <strong>${code}</strong></p>
           <p>This code will expire in 15 minutes.</p>`,
  });
};

module.exports = { sendResetCodeEmail };