import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";

import { CredentialsSignin, type NextAuthConfig } from "next-auth";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

export default {
  providers: [
    GithubProvider,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidLoginError();
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new InvalidLoginError();
        }

        if (user && user.hashedPassword === credentials.password) {
          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
