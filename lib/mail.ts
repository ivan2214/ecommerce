import nodemailer from "nodemailer";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailUser = process.env.EMAIL_FROM;
const domain = process.env.NEXTAUTH_URL;

const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const response = await transporter.sendMail({
      from: mailUser,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  } finally {
    console.log(`Email process completed for: ${to}`);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const html = `<p>Your verification code is: <strong>${token}</strong></p>`;

  return await sendEmail({
    to: email,
    subject: "Your Verification Code",
    html,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const html = `<p>Click the link to reset your password: <a href="${confirmLink}">${confirmLink}</a></p>`;

  return await sendEmail({
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = `<p>Your 2FA code is: <strong>${token}</strong></p>`;

  return await sendEmail({
    to: email,
    subject: "2FA Code",
    html,
  });
};
