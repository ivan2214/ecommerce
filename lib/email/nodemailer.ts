import nodemailer from "nodemailer";

// Configure email transport
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
const emailPort = Number.parseInt(process.env.EMAIL_PORT || "587", 10);

// Create transporter
const createTransporter = () => {
  if (!emailUser || !emailPass) {
    throw new Error("Email credentials not configured");
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Email sender address
const fromEmail = process.env.EMAIL_FROM || "noreply@example.com";

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;

  try {
    const info = await transporter.sendMail({
      from: `"Auth System" <${fromEmail}>`,
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

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send verification email with Nodemailer:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetCode: string) {
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"Auth System" <${fromEmail}>`,
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

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      "Failed to send password reset email with Nodemailer:",
      error
    );
    throw error;
  }
}
