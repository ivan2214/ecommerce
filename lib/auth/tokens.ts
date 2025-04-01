import crypto from "crypto";

// In a real application, these would be stored in a database
// This is just for demonstration purposes
const verificationTokens = new Map<string, { email: string; expires: Date }>();
const passwordResetTokens = new Map<string, { email: string; expires: Date }>();

// Generate a verification token
export function generateVerificationToken(email: string) {
  // Create a random token
  const token = crypto.randomBytes(32).toString("hex");

  // Set expiration to 24 hours from now
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Store the token
  verificationTokens.set(token, { email, expires });

  return token;
}

// Verify a token
export function verifyEmailToken(token: string) {
  const record = verificationTokens.get(token);

  if (!record) {
    return null;
  }

  // Check if token is expired
  if (record.expires < new Date()) {
    verificationTokens.delete(token);
    return null;
  }

  // Delete the token after use
  verificationTokens.delete(token);

  return record.email;
}

// Generate a password reset token (6-digit code)
export function generatePasswordResetToken(email: string) {
  // Create a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration to 1 hour from now
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000);

  // Store the code
  passwordResetTokens.set(code, { email, expires });

  return code;
}

// Verify a password reset token
export function verifyPasswordResetToken(code: string, email: string) {
  const record = passwordResetTokens.get(code);

  if (!record) {
    return false;
  }

  // Check if token is expired
  if (record.expires < new Date()) {
    passwordResetTokens.delete(code);
    return false;
  }

  // Check if the email matches
  if (record.email !== email) {
    return false;
  }

  // Delete the token after use
  passwordResetTokens.delete(code);

  return true;
}
