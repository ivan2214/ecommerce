"use client";

import { useState } from "react";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";
import { ResetPasswordModal } from "./reset-password-modal";

type ModalView = "login" | "register" | "resetPassword" | null;

export function AuthModals() {
  const [view, setView] = useState<ModalView>(null);

  const openModal = (modal: ModalView) => {
    setView(modal);
  };

  const closeModal = () => {
    setView(null);
  };

  return (
    <>
      <LoginModal
        isOpen={view === "login"}
        onClose={closeModal}
        onRegisterClick={() => setView("register")}
        onForgotPasswordClick={() => setView("resetPassword")}
      />
      <RegisterModal
        isOpen={view === "register"}
        onClose={closeModal}
        onLoginClick={() => setView("login")}
      />
      <ResetPasswordModal
        isOpen={view === "resetPassword"}
        onClose={closeModal}
        onLoginClick={() => setView("login")}
      />
    </>
  );
}

export function useAuthModals() {
  const [view, setView] = useState<ModalView>(null);

  const openModal = (modal: ModalView) => {
    setView(modal);
  };

  const closeModal = () => {
    setView(null);
  };

  return {
    view,
    openLogin: () => openModal("login"),
    openRegister: () => openModal("register"),
    openResetPassword: () => openModal("resetPassword"),
    closeModal,
    AuthModals: () => (
      <>
        <LoginModal
          isOpen={view === "login"}
          onClose={closeModal}
          onRegisterClick={() => setView("register")}
          onForgotPasswordClick={() => setView("resetPassword")}
        />
        <RegisterModal
          isOpen={view === "register"}
          onClose={closeModal}
          onLoginClick={() => setView("login")}
        />
        <ResetPasswordModal
          isOpen={view === "resetPassword"}
          onClose={closeModal}
          onLoginClick={() => setView("login")}
        />
      </>
    ),
  };
}
