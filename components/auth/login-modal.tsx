"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, Github } from "lucide-react";
import { signIn } from "next-auth/react";

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
import { Separator } from "@/components/ui/separator";
import { ResendVerificationEmail } from "./resend-verification-email";
import { toast } from "sonner";
import { FormLoginSchema } from "@/schemas/auth-schema";
import { login } from "@/actions/login";

type LoginFormValues = z.infer<typeof FormLoginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onRegisterClick,
  onForgotPasswordClick,
}: LoginModalProps) {
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    startTransition(() => {
      login(data)
        .then((res) => {
          if (res?.error) {
            if (res.error.includes("verificar tu correo")) {
              setShowResendVerification(true); // Muestra opción para reenviar verificación
            }
            toast.error(res.error);
          }

          if (res?.success) {
            toast.success("Success", {
              description: "Login successful",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error", {
            description:
              error instanceof Error ? error.message : "Failed to login",
          });
        })
        .finally(() => {
          onClose();
        });
    });

    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Error", {
        description: "Failed to login with Google",
      });
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signIn("github");
    } catch (error) {
      toast.error("Error", {
        description: "Failed to login with GitHub",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          {...field}
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={(e) => {
                    e.preventDefault();
                    onForgotPasswordClick();
                  }}
                >
                  Forgot password?
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowResendVerification(true);
                  }}
                >
                  Resend verification
                </Button>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={handleGoogleLogin}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={handleGithubLogin}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-0">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={onRegisterClick}
              >
                Register
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResendVerificationEmail
        isOpen={showResendVerification}
        onClose={() => setShowResendVerification(false)}
      />
    </>
  );
}
