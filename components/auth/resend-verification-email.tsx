"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail } from "lucide-react";

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

type ResendFormValues = z.infer<typeof ResendSchema>;

interface ResendVerificationEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResendVerificationEmail({
  isOpen,
  onClose,
}: ResendVerificationEmailProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [isPending, startTransition] = useTransition(); // ✅ Usamos useTransition

  const form = useForm<ResendFormValues>({
    resolver: zodResolver(ResendSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ResendFormValues) => {
    try {
      startTransition(() => {
        resendEmail(data.email);
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to resend verification email",
      });
    } finally {
    }
  };

  if (emailSent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Email Sent</DialogTitle>
            <DialogDescription>
              We've sent a new verification link to your email address. Please
              check your inbox and click the link to verify your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Mail className="h-16 w-16 text-primary" />
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Resend Verification Email
          </DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a new verification link.
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
                "Resend Verification Email"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
