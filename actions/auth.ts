"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

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

const verifyEmailSchema = z.object({
  token: z.string(),
});

// Mock functions for demonstration
// In a real app, these would connect to your authentication provider
async function mockAuthDelay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

// Login with email and password
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
    // In a real app, this would verify credentials with your auth provider
    await mockAuthDelay();

    // Set auth cookie
    (await cookies()).set("auth-token", "mock-jwt-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, user: {} };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid email or password");
  }
}

// Register new user
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
    // In a real app, this would create a user with your auth provider
    await mockAuthDelay();

    // In a real app, this would send a verification email
    console.log(`Verification email would be sent to ${data.email}`);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Failed to register user");
  }
}

// Request password reset
export async function resetPasswordAction(email: string | FormData) {
  const emailStr =
    typeof email === "string" ? email : (email.get("email") as string);

  // Validate input
  const result = resetPasswordSchema.safeParse({ email: emailStr });
  if (!result.success) {
    throw new Error("Invalid email address");
  }

  try {
    // In a real app, this would send a reset code to the user's email
    await mockAuthDelay();
    console.log(`Reset code would be sent to ${emailStr}`);

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error("Failed to send reset code");
  }
}

// Verify reset code and set new password
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
    // In a real app, this would verify the code and update the password
    await mockAuthDelay();

    return { success: true };
  } catch (error) {
    console.error("Verify reset code error:", error);
    throw new Error("Invalid or expired verification code");
  }
}

// Verify email address
export async function verifyEmailAction(token: string | FormData) {
  const tokenStr =
    typeof token === "string" ? token : (token.get("token") as string);

  // Validate input
  const result = verifyEmailSchema.safeParse({ token: tokenStr });
  if (!result.success) {
    throw new Error("Invalid verification token");
  }

  try {
    // In a real app, this would verify the email token
    await mockAuthDelay();

    return { success: true };
  } catch (error) {
    console.error("Verify email error:", error);
    throw new Error("Invalid or expired verification token");
  }
}

// Social login handlers
export async function loginWithGoogleAction() {
  // In a real app, this would redirect to Google OAuth
  await mockAuthDelay();

  // Simulate redirect to Google OAuth
  // In a real app, you would use the OAuth provider's SDK or API
  redirect("/api/auth/google");
}

export async function loginWithGithubAction() {
  // In a real app, this would redirect to GitHub OAuth
  await mockAuthDelay();

  // Simulate redirect to GitHub OAuth
  // In a real app, you would use the OAuth provider's SDK or API
  redirect("/api/auth/github");
}

// Logout
export async function logoutAction() {
  // Clear auth cookie
  (await cookies()).delete("auth-token");

  return { success: true };
}
