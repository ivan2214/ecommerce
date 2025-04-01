"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type CartPreviewProps = {
  onCheckout: () => void;
};

export default function CartPreview({ onCheckout }: CartPreviewProps) {
  // This would normally come from a cart context or server action
  const cartItems = [
    {
      id: "1",
      name: "UltraPhone Pro",
      price: 999.99,
      quantity: 1,
      image: "/images/products/ultraphone-1.jpg",
    },
    {
      id: "2",
      name: "TechPhone Lite",
      price: 449.99,
      quantity: 2,
      image: "/images/products/techphone-1.jpg",
    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 10.0;
  const total = subtotal + shipping;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
        <p className="text-sm text-muted-foreground">
          {cartItems.length} items
        </p>
      </div>
      <Separator />
      {cartItems.length > 0 ? (
        <>
          <div className="flex-1 overflow-auto py-4">
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center space-x-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-4 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 pt-4">
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button onClick={onCheckout}>Proceed to Checkout</Button>
              <Button variant="outline" asChild>
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
