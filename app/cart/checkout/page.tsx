import { auth } from "@/auth";
import { currentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckoutForm } from "@/components/checkout-form";

export default async function CheckoutPage() {
  const { user } = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // Get user's addresses
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  const cartItems = cart.items;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 10.0;
  const total = subtotal + shipping;

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <CheckoutForm addresses={addresses} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name}{" "}
                      <span className="text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </span>
                    <span>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
