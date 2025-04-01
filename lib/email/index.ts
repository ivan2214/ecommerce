import * as resendEmail from "./resend";
import * as nodemailerEmail from "./nodemailer";

// Check if Resend is configured
const isResendConfigured = !!process.env.RESEND_API_KEY;

// Check if Nodemailer is configured
const isNodemailerConfigured = !!(
  process.env.EMAIL_USER && process.env.EMAIL_PASS
);

// Export the appropriate email service
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  try {
    if (isResendConfigured) {
      return await resendEmail.sendVerificationEmail(
        email,
        name,
        verificationToken
      );
    } else if (isNodemailerConfigured) {
      return await nodemailerEmail.sendVerificationEmail(
        email,
        name,
        verificationToken
      );
    } else {
      console.warn("No email service configured. Verification email not sent.");
      // For development, log the verification URL
      const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;
      console.log("Verification URL (dev only):", verificationUrl);
      return { success: true, dev: true };
    }
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetCode: string) {
  try {
    if (isResendConfigured) {
      return await resendEmail.sendPasswordResetEmail(email, resetCode);
    } else if (isNodemailerConfigured) {
      return await nodemailerEmail.sendPasswordResetEmail(email, resetCode);
    } else {
      console.warn(
        "No email service configured. Password reset email not sent."
      );
      // For development, log the reset code
      console.log("Reset code (dev only):", resetCode);
      return { success: true, dev: true };
    }
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
