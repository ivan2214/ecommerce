import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { RoleUser } from "@prisma/client";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { getAccountByUserId } from "./data/accounts";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account }) {
      // esto ees para que no se pueda loguear con google si no esta verificado el email
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }
      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.roleUser = existingUser.roleUser;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.roleUser && session.user) {
        session.user.roleUser = token.roleUser as RoleUser;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error",
  },
  ...authConfig,
});
