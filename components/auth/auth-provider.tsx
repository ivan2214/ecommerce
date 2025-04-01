"use client";

import type React from "react";

import { useSession, signIn, signOut } from "next-auth/react";
import { createContext, useContext } from "react";

type AuthContextType = {
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Registration failed");
    }

    return response.json();
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  const resetPassword = async (email: string) => {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to request password reset");
    }

    return response.json();
  };

  const verifyResetCode = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    const response = await fetch("/api/auth/verify-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to verify reset code");
    }

    return response.json();
  };

  const verifyEmail = async (token: string) => {
    const response = await fetch(`/api/auth/verify-email?token=${token}`);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to verify email");
    }

    return response.json();
  };

  const value = {
    session,
    status,
    login,
    register,
    logout,
    resetPassword,
    verifyResetCode,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
