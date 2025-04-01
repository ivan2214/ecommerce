import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { FormLoginSchema } from "@/schemas/auth-schema";
import { getUserByEmail } from "@/data/user";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

export default {
  providers: [
    GithubProvider,
    Credentials({
      async authorize(credentials) {
        const validateFields = FormLoginSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.hashedPassword) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            user.hashedPassword
          );

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
