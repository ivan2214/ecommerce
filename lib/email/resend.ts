import { Resend } from "resend";

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email sender address
const fromEmail = process.env.EMAIL_FROM || "noreply@example.com";

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  if (!resend) {
    throw new Error("Resend API key not configured");
  }

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email address</h2>
          <p>Hello ${name || "there"},</p>
          <p>Thank you for registering. Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
          <p>Thanks,<br>The Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending verification email with Resend:", error);
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Failed to send verification email with Resend:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetCode: string) {
  if (!resend) {
    throw new Error("Resend API key not configured");
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Here is your verification code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f3f4f6; padding: 16px; font-size: 24px; letter-spacing: 4px; font-weight: bold;">
              ${resetCode}
            </div>
          </div>
          <p>Enter this code on the password reset page to create a new password.</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
          <p>Thanks,<br>The Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending password reset email with Resend:", error);
      throw new Error(error.message);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Failed to send password reset email with Resend:", error);
    throw error;
  }
}
