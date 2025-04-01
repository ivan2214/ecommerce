"use server";

import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { FormRegisterSchema } from "@/schemas/auth-schema";
import bcrypt from "bcryptjs";

import type { z } from "zod";

export const register = async (values: z.infer<typeof FormRegisterSchema>) => {
  const validateFields = FormRegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Campos invalidos!" };
  }

  const { email, password, name } = validateFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Correo electrónico ya en uso!" };
  }

  await prisma.user.create({
    data: {
      name: name,
      email,
      hashedPassword: hashedPassword,
      roleUser: "USER",
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Correo electrónico de confirmación enviado!" };
};
