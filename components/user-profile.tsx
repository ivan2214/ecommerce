"use client";

import type React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data } = useSession();
  const user = data?.user;
  const [isLoaded, setIsLoaded] = useState(false);

  const [name, setName] = useState(user?.name || "");

  const [email, setEmail] = useState(user?.email || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !user) return;

    setIsUpdating(true);

    try {
      toast("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "There was a problem updating your profile.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input
          id="first-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          To change your email, please go to your account settings.
        </p>
      </div>
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
