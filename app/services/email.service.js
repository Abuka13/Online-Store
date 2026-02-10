const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail({ to, subject, text, html }) {
  // если RESEND_API_KEY не настроен
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 RESEND_API_KEY not configured.");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Message:", text);
    return { skipped: true, sentToConsole: true };
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@onlinestore.com",
      to,
      subject,
      html: html || text
    });

    if (result.error) {
      console.error("❌ Resend error:", result.error.message);
      console.log("📧 DEBUG MODE - Would send to:", to);
      console.log("Subject:", subject);
      console.log("Message:", text);
      return { error: result.error.message, sentToConsole: true };
    }

    console.log("✅ Email sent successfully to:", to);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    console.log("📧 DEBUG MODE - Would send to:", to);
    console.log("Subject:", subject);
    console.log("Message:", text);
    return { error: error.message, sentToConsole: true };
  }
}

async function sendWelcomeEmail({ to, name }) {
  return sendMail({
    to,
    subject: "Welcome to Online Store ✅",
    text: `Hello ${name}! Your account has been created.`,
    html: `<h2>Hello ${name}!</h2><p>Your account has been created successfully.</p>`
  });
}

async function sendOrderConfirmationEmail({ to, name, orderId, total }) {
  return sendMail({
    to,
    subject: `Order confirmation #${String(orderId).slice(-6)}`,
    text: `Hi ${name}, your order was created. Total: ${total}`,
    html: `<h2>Order created ✅</h2>
           <p>Hi ${name}, your order <b>#${String(orderId).slice(-6)}</b> was created.</p>
           <p>Total: <b>${total}</b></p>`
  });
}

async function sendPasswordResetEmail({ to, name, resetLink }) {
  return sendMail({
    to,
    subject: "Password Reset Request 🔐",
    text: `Hi ${name}, click the link to reset your password: ${resetLink}`,
    html: `<h2>Password Reset Request</h2>
           <p>Hi ${name},</p>
           <p>You requested a password reset. Click the button below to proceed:</p>
           <p><a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a></p>
           <p>Or copy this link: ${resetLink}</p>
           <p>This link expires in 1 hour.</p>
           <p>If you didn't request this, ignore this email.</p>`
  });
}

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail
};
