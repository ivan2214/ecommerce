"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, ArrowLeft, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { resetPasswordAction, verifyResetCodeAction } from "@/lib/auth/actions";
import { toast } from "sonner";

// Step 1: Request password reset
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Step 2: Verify code and set new password
const verifyCodeSchema = z
  .object({
    code: z
      .string()
      .min(6, { message: "Verification code must be at least 6 characters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestResetFormValues = z.infer<typeof requestResetSchema>;
type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onLoginClick,
}: ResetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [email, setEmail] = useState("");

  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const verifyForm = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onRequestSubmit = async (data: RequestResetFormValues) => {
    setIsLoading(true);
    try {
      await resetPasswordAction(data.email);
      setEmail(data.email);
      setStep("verify");
      toast("Reset code sent", {
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to send reset code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifySubmit = async (data: VerifyCodeFormValues) => {
    setIsLoading(true);
    try {
      await verifyResetCodeAction({
        email,
        code: data.code,
        newPassword: data.newPassword,
      });
      setStep("success");
      toast("Password reset successful", {
        description: "Your password has been reset successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to verify reset code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequestForm = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Reset Password</DialogTitle>
        <DialogDescription>
          Enter your email address and we'll send you a verification code to
          reset your password
        </DialogDescription>
      </DialogHeader>
      <Form {...requestForm}>
        <form
          onSubmit={requestForm.handleSubmit(onRequestSubmit)}
          className="space-y-4"
        >
          <FormField
            control={requestForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="name@example.com"
                      className="pl-10"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Send Reset Code"
            )}
          </Button>
        </form>
      </Form>
      <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-0">
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0"
            onClick={onLoginClick}
          >
            Login
          </Button>
        </div>
      </DialogFooter>
    </>
  );

  const renderVerifyForm = () => (
    <>
      <DialogHeader>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4"
          onClick={() => setStep("request")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <DialogTitle className="text-2xl font-bold">
          Verify Reset Code
        </DialogTitle>
        <DialogDescription>
          Enter the verification code sent to {email} and create a new password
        </DialogDescription>
      </DialogHeader>
      <Form {...verifyForm}>
        <form
          onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
          className="space-y-4"
        >
          <FormField
            control={verifyForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="123456"
                      className="pl-10"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={verifyForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={verifyForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );

  const renderSuccessView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          Password Reset Successful
        </DialogTitle>
        <DialogDescription>
          Your password has been reset successfully. You can now login with your
          new password.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-center py-6">
        <div className="rounded-full bg-primary/10 p-3">
          <Lock className="h-10 w-10 text-primary" />
        </div>
      </div>
      <Button onClick={onLoginClick} className="w-full">
        Login
      </Button>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === "request" && renderRequestForm()}
        {step === "verify" && renderVerifyForm()}
        {step === "success" && renderSuccessView()}
      </DialogContent>
    </Dialog>
  );
}
