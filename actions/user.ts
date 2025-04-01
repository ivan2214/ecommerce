"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";

export const currentUser = async (): Promise<{
  user: User | null;
}> => {
  const session = await auth();

  if (!session?.user) {
    return { user: null };
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return { user: null };
  }

  return { user };
};
