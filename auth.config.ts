import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

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
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) return null;

        if (user && user.hashedPassword === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            roleUser: user.roleUser,
            tokens: user.tokens,
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
