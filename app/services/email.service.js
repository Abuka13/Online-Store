const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.config");

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.auth
    });
  }
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  // если SMTP не настроен — не валим сервер
  if (!mailConfig.host || !mailConfig.auth?.user || !mailConfig.auth?.pass) {
    console.warn("📧 SMTP not configured. Email skipped.");
    return { skipped: true };
  }

  return getTransporter().sendMail({
    from: mailConfig.from,
    to,
    subject,
    text,
    html
  });
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

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail
};
