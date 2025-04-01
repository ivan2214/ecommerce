"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
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
import { resendEmail } from "@/actions/resend-email";
import { verifyOtp } from "@/actions/verify-otp";

// Define the steps of the form
enum FormStep {
  EMAIL = 0,
  OTP = 1,
  SUCCESS = 2,
}

// Combined schema for all form steps
const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  pin: z
    .string()
    .min(6, "OTP must be at least 6 characters")
    .max(6, "OTP must be at most 6 characters")
    .optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface ResendVerificationEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResendVerificationEmail({
  isOpen,
  onClose,
}: ResendVerificationEmailProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.EMAIL);
  const [isPending, startTransition] = useTransition();

  // Initialize form with combined schema
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      pin: "",
    },
    mode: "onChange",
  });

  const resetForm = () => {
    form.reset();
    setCurrentStep(FormStep.EMAIL);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted", data, currentStep);

    if (currentStep === FormStep.EMAIL) {
      // Handle email submission
      startTransition(async () => {
        try {
          console.log("Sending email to:", data.email);
          const result = await resendEmail(data.email);
          console.log("Email result:", result);

          if (result.status === 200) {
            setCurrentStep(FormStep.OTP);
            toast.success("Verification code sent", {
              description: "Please check your email for the verification code",
            });
          } else {
            toast.error("Error", {
              description:
                result.message || "Failed to send verification email",
            });
          }
        } catch (error) {
          console.error("Email error:", error);
          toast.error("Error", {
            description:
              error instanceof Error
                ? error.message
                : "Failed to resend verification email",
          });
        }
      });
    } else if (currentStep === FormStep.OTP && data.pin) {
      // Handle OTP verification
      startTransition(async () => {
        try {
          const result = await verifyOtp(data.email, data.pin);
          if (result.success) {
            setCurrentStep(FormStep.SUCCESS);
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
    }
  };

  // Get title and description based on current step
  const getDialogContent = () => {
    switch (currentStep) {
      case FormStep.EMAIL:
        return {
          title: "Resend Verification Email",
          description:
            "Enter your email address and we'll send you a new verification code.",
        };
      case FormStep.OTP:
        return {
          title: "Verify Your Email",
          description:
            "We've sent a verification code to your email address. Please enter the code below to verify your account.",
        };
      case FormStep.SUCCESS:
        return {
          title: "Verification Successful",
          description:
            "Your email has been verified successfully. You can now log in to your account.",
        };
      default:
        return {
          title: "Resend Verification Email",
          description:
            "Enter your email address and we'll send you a new verification code.",
        };
    }
  };

  const { title, description } = getDialogContent();

  // Handle direct form submission for email step
  const handleEmailSubmit = () => {
    const emailValue = form.getValues("email");
    if (emailValue) {
      console.log("Direct submit with email:", emailValue);
      onSubmit({ email: emailValue, pin: "" });
    } else {
      form.setError("email", {
        type: "manual",
        message: "Email is required",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {currentStep === FormStep.SUCCESS ? (
          <>
            <div className="flex justify-center py-6">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === FormStep.EMAIL) {
                  handleEmailSubmit();
                } else {
                  form.handleSubmit(onSubmit)(e);
                }
              }}
              className="space-y-4"
            >
              {currentStep === FormStep.EMAIL && (
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
                            type="email"
                            required
                            {...field}
                            disabled={isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {currentStep === FormStep.OTP && (
                <>
                  <div className="mb-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-muted-foreground"
                      onClick={() => setCurrentStep(FormStep.EMAIL)}
                      disabled={isPending}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to email
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            value={field.value || ""}
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
                </>
              )}

              {(currentStep === FormStep.EMAIL ||
                currentStep === FormStep.OTP) && (
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentStep === FormStep.EMAIL
                        ? "Please wait"
                        : "Verifying..."}
                    </>
                  ) : currentStep === FormStep.EMAIL ? (
                    "Send Verification Code"
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              )}
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
