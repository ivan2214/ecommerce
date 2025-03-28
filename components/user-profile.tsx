"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function UserProfile() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded || !user) return

    setIsUpdating(true)

    try {
      await user.update({
        firstName,
        lastName,
      })

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">To change your email, please go to your account settings.</p>
      </div>
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}

