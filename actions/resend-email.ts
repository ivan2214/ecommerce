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

  // Genera un código OTP de 6 dígitos
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10); // Expira en 10 minutos

  // Guarda el nuevo código en la base de datos
  await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  // Envía el correo con el código
  await sendVerificationEmail(email, token);

  return { message: "Verification email sent", status: 200 };
};
