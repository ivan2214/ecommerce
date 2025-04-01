"use server";

import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  generateVerificationToken,
  verifyEmailToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from "./tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const verifyResetCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6),
  newPassword: z.string().min(8),
});

const resendVerificationSchema = z.object({
  email: z.string().email(),
});

// Mock database functions
// In a real app, these would connect to your database

async function findUserByEmail(email: string) {
  console.log("Finding user by email:", email);
  // Mock user for demonstration
  if (email === "user@example.com") {
    return {
      id: "user_123",
      name: "Test User",
      email: "user@example.com",
      // This is a hashed version of "password123"
      password: "$2b$10$8OxDEuDS1WFBs3eBgQlHIOaS5.4XnDMaKCGpIJ7e3lX2WKMHvj7yG",
      emailVerified: new Date(),
    };
  }
  return null;
}

async function createUser(name: string, email: string, hashedPassword: string) {
  console.log("Creating user:", { name, email });
  return { id: "user_123", name, email };
}

async function updateUserPassword(email: string, hashedPassword: string) {
  console.log("Updating password for:", email);
  return true;
}

async function updateUserEmailVerified(email: string) {
  console.log("Updating email verified status for:", email);
  return true;
}

// Server Actions

export async function loginAction(
  formData: FormData | { email: string; password: string }
) {
  const data =
    formData instanceof FormData
      ? {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        }
      : formData;

  // Validate input
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid email or password");
  }

  try {
    const user = await findUserByEmail(data.email);

    if (!user) {
      throw new Error("No user found with this email");
    }

    const isPasswordValid = await compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in");
    }

    // Set auth cookie
    (await cookies()).set("auth-token", "mock-jwt-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerAction(
  formData: FormData | { name: string; email: string; password: string }
) {
  const data =
    formData instanceof FormData
      ? {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        }
      : formData;

  // Validate input
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid registration data");
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hash(data.password, 10);

    // Create user
    const user = await createUser(data.name, data.email, hashedPassword);

    // Generate verification token
    const verificationToken = generateVerificationToken(data.email);

    // Send verification email
    await sendVerificationEmail(data.email, data.name, verificationToken);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function resetPasswordAction(email: string | FormData) {
  const emailStr =
    typeof email === "string" ? email : (email.get("email") as string);

  // Validate input
  const result = resetPasswordSchema.safeParse({ email: emailStr });
  if (!result.success) {
    throw new Error("Invalid email address");
  }

  try {
    // Check if user exists
    const user = await findUserByEmail(emailStr);
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return { success: true };
    }

    // Generate reset token (6-digit code)
    const resetCode = generatePasswordResetToken(emailStr);

    // Send reset email
    await sendPasswordResetEmail(emailStr, resetCode);

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

export async function verifyResetCodeAction(
  data: { email: string; code: string; newPassword: string } | FormData
) {
  const formData =
    data instanceof FormData
      ? {
          email: data.get("email") as string,
          code: data.get("code") as string,
          newPassword: data.get("newPassword") as string,
        }
      : data;

  // Validate input
  const result = verifyResetCodeSchema.safeParse(formData);
  if (!result.success) {
    throw new Error("Invalid verification data");
  }

  try {
    // Verify reset token
    const isValidToken = verifyPasswordResetToken(
      formData.code,
      formData.email
    );
    if (!isValidToken) {
      throw new Error("Invalid or expired verification code");
    }

    // Hash new password
    const hashedPassword = await hash(formData.newPassword, 10);

    // Update user password
    await updateUserPassword(formData.email, hashedPassword);

    return { success: true };
  } catch (error) {
    console.error("Verify reset code error:", error);
    throw error;
  }
}

export async function verifyEmailAction(token: string) {
  try {
    if (!token) {
      throw new Error("Verification token is required");
    }

    // Verify the token
    const email = verifyEmailToken(token);

    if (!email) {
      redirect("/auth/verification-failed");
    }

    // Update user's emailVerified status
    await updateUserEmailVerified(email);

    redirect("/auth/email-verified");
  } catch (error) {
    console.error("Email verification error:", error);
    redirect("/auth/verification-failed");
  }
}

export async function resendVerificationAction(
  formData: FormData | { email: string }
) {
  const data =
    formData instanceof FormData
      ? {
          email: formData.get("email") as string,
        }
      : formData;

  // Validate input
  const result = resendVerificationSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid email address");
  }

  try {
    // Check if user exists
    const user = await findUserByEmail(data.email);
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return { success: true };
    }

    // Check if email is already verified
    if (user.emailVerified) {
      throw new Error("Email is already verified");
    }

    // Generate verification token
    const verificationToken = generateVerificationToken(data.email);

    // Send verification email
    await sendVerificationEmail(data.email, user.name, verificationToken);

    return { success: true };
  } catch (error) {
    console.error("Resend verification email error:", error);
    throw error;
  }
}

// Social login handlers
export async function loginWithGoogleAction() {
  // In a real app, this would redirect to Google OAuth
  redirect("/api/auth/google");
}

export async function loginWithGithubAction() {
  // In a real app, this would redirect to GitHub OAuth
  redirect("/api/auth/github");
}

// Logout
export async function logoutAction() {
  // Clear auth cookie
  (await cookies()).delete("auth-token");
  return { success: true };
}
