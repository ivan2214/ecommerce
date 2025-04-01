"use server";

import bcrypt from "bcryptjs";

import type * as z from "zod";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas/auth-schema";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Falta el Token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos invalidos" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token invalido!" };
  }
  const hasExpired = new Date(existingToken.expires) <= new Date();

  if (hasExpired) {
    return { error: "El token ha expirado!" };
  }

  const exisitingUser = await getUserByEmail(existingToken.email);

  if (!exisitingUser) {
    return { error: "El correo electrónico no existe!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: exisitingUser.id,
    },
    data: {
      hashedPassword: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Contraseña actualizada!" };
};
