import { RoleUser } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      roleUser?: RoleUser;
    } & DefaultSession["user"];
  }

  interface User {
    roleUser?: RoleUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roleUser?: RoleUser;
  }
}
