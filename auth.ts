import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { RoleUser } from "@prisma/client";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roleUser = user.roleUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.roleUser = token.role as RoleUser;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
