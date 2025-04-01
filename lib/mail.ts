import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);
const mailUser = process.env.EMAIL_FROM;
const domain = process.env.NEXTAUTH_URL;

const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    await resend.emails.send({
      from: mailUser!,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const html = EmailTemplate({
    link: confirmLink,
    text: "Confirm Email Address",
  });
  await sendEmail({
    to: email,
    subject: "Confirm your email",
    html: `${html}`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const html = EmailTemplate({ link: confirmLink, text: "Reset Password" });
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `${html}`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = EmailTemplate({ link: "#", text: `Your 2FA code: ${token}` });
  await sendEmail({
    to: email,
    subject: "2FA Code",
    html: `${html}`,
  });
};
