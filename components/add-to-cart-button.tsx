"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

import { addToCart } from "@/lib/actions";
import { toast } from "sonner";

type AddToCartButtonProps = {
  productId: string;
  stock: number;
  quantity?: number;
};

export function AddToCartButton({
  productId,
  stock,
  quantity = 1,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      await addToCart(productId, quantity);

      toast("Added to cart", {
        description: "The product has been added to your cart.",
      });
    } catch (error) {
      console.error(error);

      if (
        (error as Error).message ===
        "You must be signed in to add items to your cart"
      ) {
        toast.error("Authentication required", {
          description: "Please sign in to add items to your cart.",
        });
      } else if ((error as Error).message === "Not enough stock available") {
        toast.error("Insufficient stock", {
          description: "There isn't enough stock available for this product.",
        });
      } else {
        toast.error("Error", {
          description: "Failed to add product to cart. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading || stock <= 0}
      className="flex-1"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {stock <= 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
