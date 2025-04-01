"use client";

import { ChromeIcon, GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center justify-center gap-x-2">
      <Button
        className="w-full"
        size="lg"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <ChromeIcon className="h-5 w-5" />
      </Button>
      <Button
        className="w-full"
        size="lg"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <GithubIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
