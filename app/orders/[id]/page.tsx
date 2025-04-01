import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/current-user";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  /* const { user } = await currentUser();

  if (!user) {
    redirect("/sign-in");
  } */

  // Get order details
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      userId: "user_0",
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-3xl font-bold mt-2">
          Order #{order.id.substring(0, 8)}
        </h1>
        <p className="text-muted-foreground">
          Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
          {new Date(order.createdAt).toLocaleTimeString()}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-md">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.shippingAddress}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              <div className="mt-4 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span>Payment Method</span>
                  <span>{order.paymentMethod.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Status</span>
                  <span
                    className={`font-medium ${
                      order.status === "DELIVERED"
                        ? "text-green-600"
                        : order.status === "SHIPPED"
                        ? "text-blue-600"
                        : order.status === "PROCESSING"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col space-y-2">
            <Button variant="outline" asChild>
              <Link href="/orders">View All Orders</Link>
            </Button>
            <Button variant="outline">Track Order</Button>
            <Button variant="outline">Download Invoice</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
