"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
import { toast } from "sonner";
import { ResendSchema } from "@/schemas/auth-schema";
import { resendEmail } from "@/actions/resend-email";
import { verifyOtp } from "@/actions/verify-otp";

// Add OTP schema
const OtpSchema = z.object({
  pin: z
    .string()
    .min(6, "OTP must be at least 6 characters")
    .max(6, "OTP must be at most 6 characters"),
});

type ResendFormValues = z.infer<typeof ResendSchema>;
type OtpFormValues = z.infer<typeof OtpSchema>;

interface ResendVerificationEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResendVerificationEmail({
  isOpen,
  onClose,
}: ResendVerificationEmailProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResendFormValues>({
    resolver: zodResolver(ResendSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = (data: ResendFormValues) => {
    setUserEmail(data.email);

    startTransition(async () => {
      try {
        const result = await resendEmail(data.email);
        if (result.status === 200) {
          setOtpSent(true);
          toast.success("Verification code sent", {
            description: "Please check your email for the verification code",
          });
        } else {
          toast.error("Error", {
            description: result.message || "Failed to send verification email",
          });
        }
      } catch (error) {
        toast.error("Error", {
          description:
            error instanceof Error
              ? error.message
              : "Failed to resend verification email",
        });
      } finally {
        form.reset();
        otpForm.reset();
      }
    });
  };

  const onVerifyOtp = (data: OtpFormValues) => {
    startTransition(async () => {
      try {
        const result = await verifyOtp(userEmail, data.pin);
        if (result.success) {
          setVerificationSuccess(true);
          toast.success("Verification successful", {
            description: "Your email has been verified successfully",
          });
        } else {
          toast.error("Verification failed", {
            description: result.message || "Invalid verification code",
          });
        }
      } catch (error) {
        toast.error("Error", {
          description:
            error instanceof Error ? error.message : "Failed to verify code",
        });
      }
    });
  };

  if (verificationSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Verification Successful
            </DialogTitle>
            <DialogDescription>
              Your email has been verified successfully. You can now log in to
              your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <DialogFooter>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (otpSent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Verify Your Email
            </DialogTitle>
            <DialogDescription>
              We've sent a verification code to your email address. Please enter
              the code below to verify your account.
            </DialogDescription>
          </DialogHeader>
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onVerifyOtp)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        pattern="^[a-zA-Z0-9]+$"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Resend Verification Email
          </DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a new verification code.
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
