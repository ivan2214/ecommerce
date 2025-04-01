import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 3000,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: false,
  tls: {
    rejectUnauthorized: false, // Ignorar certificados autofirmados
  },
});

const mailUser = process.env.MAIL_USERNAME;
const domain = process.env.NEXTAUTH_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const mailOptions = {
    from: mailUser,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  const mailOptions = {
    from: mailUser,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${confirmLink}">here</a> to reset password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: mailUser,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  };

  await transporter.sendMail(mailOptions);
};
