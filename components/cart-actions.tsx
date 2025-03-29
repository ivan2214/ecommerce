"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { updateCartItemQuantity, removeFromCart } from "@/lib/actions";
import { toast } from "sonner";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
};

type CartActionsProps = {
  item: CartItem;
};

export function CartActions({ item }: CartActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;

    setIsUpdating(true);

    try {
      await updateCartItemQuantity(item.id, newQuantity);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to update quantity",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      await removeFromCart(item.id);
      toast("Item removed", {
        description: "The item has been removed from your cart",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to remove item",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          disabled={isUpdating}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-destructive"
        onClick={handleRemove}
        disabled={isUpdating}
      >
        <Trash2 className="mr-1 h-4 w-4" />
        Remove
      </Button>
    </div>
  );
}
