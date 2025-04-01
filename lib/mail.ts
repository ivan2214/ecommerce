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
    const response = await resend.emails.send({
      from: mailUser!,
      to,
      subject,
      html,
    });
    if (response.error) {
      console.error("Error sending email:", response.error);
      return {
        success: false,
        message: "Failed to send email",
        error: response.error,
      };
    }

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
  console.log("sendVerificationEmail", email, token);

  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const html = EmailTemplate({
    link: confirmLink,
    text: "Confirm Email Address",
  });

  return await sendEmail({
    to: email,
    subject: "Confirm your email",
    html: html.toString(),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  const html = EmailTemplate({ link: confirmLink, text: "Reset Password" });

  return await sendEmail({
    to: email,
    subject: "Reset your password",
    html: html.toString(),
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = EmailTemplate({ link: "#", text: `Your 2FA code: ${token}` });

  return await sendEmail({
    to: email,
    subject: "2FA Code",
    html: html.toString(),
  });
};
