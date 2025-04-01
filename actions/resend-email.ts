"use server";

import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail"; // Asegúrate de tener una función para enviar emails
import { randomUUID } from "crypto";

export const resendEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { message: "User not found", status: 404 };
  }

  if (user.emailVerified) {
    return { message: "User already verified", status: 400 };
  }

  // Elimina cualquier token de verificación previo
  await prisma.verificationToken.deleteMany({
    where: { email },
  });

  // Genera un nuevo token
  const token = randomUUID();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Expira en 1 hora

  // Guarda el nuevo token en la base de datos
  await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  // Envía el correo con el nuevo token
  await sendVerificationEmail(email, token).then((res) => {
    console.log(res);
  });

  return { message: "Verification email sent", status: 200 };
};
