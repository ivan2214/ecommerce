import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { ArrowLeft, Download, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { OrderTimeline } from "@/components/order-timeline";
import { currentUser } from "@/lib/current-user";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await currentUser();

  if (!user) {
    redirect("/not-found");
  }

  // Get order details
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      userId: user.id, // Ensure the order belongs to the current user
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
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
          <h1 className="text-3xl font-bold">
            Order #{order.id.substring(0, 8)}
          </h1>
          <Badge
            className={`w-fit mt-2 sm:mt-0 ${
              order.status === "DELIVERED"
                ? "bg-green-500 hover:bg-green-600"
                : order.status === "SHIPPED"
                ? "bg-blue-500 hover:bg-blue-600"
                : order.status === "PROCESSING"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {order.status.replace(/_/g, " ")}
          </Badge>
        </div>
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
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
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
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline
                status={order.status}
                createdAt={order.createdAt}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Delivery Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>

              {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm">
                    {order.status === "PROCESSING"
                      ? "Your order is being processed. We'll update you when it ships."
                      : "Your order is on its way! Track your shipment for the latest updates."}
                  </p>
                </div>
              )}
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
                  <span>Order ID</span>
                  <span className="font-mono">{order.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col space-y-2">
            <Button variant="default" asChild>
              {order.status === "DELIVERED" ? (
                <Link href={`/products?reorder=${order.id}`}>Reorder</Link>
              ) : order.status === "PROCESSING" ? (
                <Link href="#cancel-order">Cancel Order</Link>
              ) : (
                <Link href="#contact-support">Contact Support</Link>
              )}
            </Button>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>

            <Button variant="outline" asChild>
              <Link href="/orders">View All Orders</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* This would normally be populated with recommended products based on order history */}
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-full overflow-hidden group">
              <div className="relative h-[160px] w-full overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=160&width=320&text=Product+${i}`}
                  alt={`Recommended Product ${i}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">Recommended Product {i}</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your order history
                </p>
                <p className="font-medium mt-2">${(19.99 * i).toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
