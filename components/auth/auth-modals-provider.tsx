"use client";

import { createContext, useContext, useState } from "react";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";
import { ResetPasswordModal } from "./reset-password-modal";

type ModalView = "login" | "register" | "resetPassword" | null;

interface AuthModalsContextType {
  openLogin: () => void;
  openRegister: () => void;
  openResetPassword: () => void;
  closeModal: () => void;
}

export const AuthModalsContext = createContext<
  AuthModalsContextType | undefined
>(undefined);

export function AuthModalsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [view, setView] = useState<ModalView>(null);

  const openModal = (modal: ModalView) => setView(modal);
  const closeModal = () => setView(null);

  return (
    <AuthModalsContext.Provider
      value={{
        openLogin: () => openModal("login"),
        openRegister: () => openModal("register"),
        openResetPassword: () => openModal("resetPassword"),
        closeModal,
      }}
    >
      {children}
      <LoginModal
        isOpen={view === "login"}
        onClose={closeModal}
        onRegisterClick={() => openModal("register")}
        onForgotPasswordClick={() => openModal("resetPassword")}
      />
      <RegisterModal
        isOpen={view === "register"}
        onClose={closeModal}
        onLoginClick={() => openModal("login")}
      />
      <ResetPasswordModal
        isOpen={view === "resetPassword"}
        onClose={closeModal}
        onLoginClick={() => openModal("login")}
      />
    </AuthModalsContext.Provider>
  );
}
