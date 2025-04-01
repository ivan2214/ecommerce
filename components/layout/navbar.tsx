"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAuthModals } from "@/components/auth/auth-modals";
import { UserProfileButton } from "@/components/auth/user-profile-button";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const { openLogin, openRegister, AuthModals } = useAuthModals();

  return (
    <header className="border-b px-4 bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            TypeScript Refactor AI
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            {session && (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Settings
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <UserProfileButton />
          ) : (
            <>
              <Button variant="ghost" onClick={openLogin}>
                Login
              </Button>
              <Button onClick={openRegister}>Register</Button>
            </>
          )}
        </div>
      </div>

      {/* Render the auth modals */}
      <AuthModals />
    </header>
  );
}
