import nodemailer from "nodemailer";

import {
  adminBookingNotificationTemplate,
  bookingConfirmationTemplate,
  emailVerificationTemplate
} from "../utils/email-templates.js";

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is incomplete");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

export const sendBookingConfirmationEmail = async ({ to, booking, tour }) => {
  const transporter = createTransporter();
  const { subject, html, text } = bookingConfirmationTemplate({ booking, tour });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text
  });
};

export const sendAdminBookingNotification = async ({ booking, tour }) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  const transporter = createTransporter();
  const { subject, html, text } = adminBookingNotificationTemplate({ booking, tour });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: adminEmail,
    subject,
    html,
    text
  });
};

export const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const transporter = createTransporter();
  const { subject, html, text } = emailVerificationTemplate({ name, verificationUrl });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text
  });
};
