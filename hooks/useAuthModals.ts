import { AuthModalsContext } from "@/components/auth/auth-modals-provider";
import { useContext } from "react";

export function useAuthModals() {
  const context = useContext(AuthModalsContext);
  if (!context) {
    throw new Error("useAuthModals must be used within an AuthModalsProvider");
  }
  return context;
}
