"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { prisma } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "El token no existe!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "El token ha expirado!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "El correo electrónico no existe!" };
  }

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: "El correo electrónico ha sido verificado!",
  };
};
