"use server";

import { prisma } from "@/lib/db";

export const verifyOtp = async (email: string, otp: string) => {
  try {
    // Buscar el código OTP en la base de datos
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email,
        token: otp,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      };
    }

    // Marcar el usuario como verificado
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Eliminar el código usado
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: "An error occurred during verification",
    };
  }
};
