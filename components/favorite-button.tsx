"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { toggleFavorite } from "@/lib/actions"
import { useRouter } from "next/navigation"

type FavoriteButtonProps = {
  productId: string
  isFavorited: boolean
  variant?: "icon" | "default"
}

export function FavoriteButton({ productId, isFavorited: initialIsFavorited, variant = "icon" }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleToggleFavorite = async () => {
    setIsLoading(true)

    try {
      await toggleFavorite(productId)
      setIsFavorited(!isFavorited)

      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited
          ? "The product has been removed from your favorites."
          : "The product has been added to your favorites.",
      })

      router.refresh()
    } catch (error) {
      console.error(error)

      if ((error as Error).message === "You must be signed in to add favorites") {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to your favorites.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update favorites. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full bg-background ${
          isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
      >
        <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={isFavorited ? "text-red-500" : ""}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
      {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  )
}

