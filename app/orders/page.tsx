import Link from "next/link";
import Image from "next/image";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Package, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/current-user";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { user } = await currentUser();

  if (!user) {
    redirect("/not-found");
  }

  // Get search query if any
  const query = typeof searchParams.q === "string" ? searchParams.q : "";

  // Get user's orders
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
      OR: query
        ? [
            { id: { contains: query, mode: "insensitive" } },
            { shippingAddress: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // Group orders by status
  const activeOrders = orders.filter(
    (order) => order.status === "PROCESSING" || order.status === "SHIPPED"
  );
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  );
  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  );

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <form>
            <Input
              type="search"
              name="q"
              placeholder="Search orders..."
              className="pl-8"
              defaultValue={query}
            />
          </form>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({deliveredOrders.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {renderOrderList(orders)}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {renderOrderList(activeOrders)}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-6">
          {renderOrderList(deliveredOrders)}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          {renderOrderList(cancelledOrders)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderOrderList(orders: any[]) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">No orders found</h2>
        <p className="mt-2 text-muted-foreground">
          You haven't placed any orders yet or no orders match your search.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base">
                Order #{order.id.substring(0, 8)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <Badge
                  className={`${
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Preview of order items */}
              <div className="flex flex-wrap gap-2">
                {order.orderItems.slice(0, 3).map((item: any) => (
                  <div
                    key={item.id}
                    className="relative h-16 w-16 overflow-hidden rounded-md border"
                  >
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border flex items-center justify-center bg-muted">
                    <span className="text-sm font-medium">
                      +{order.orderItems.length - 3}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">Items</p>
                  <p className="text-sm text-muted-foreground">
                    {order.orderItems.length}{" "}
                    {order.orderItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-sm">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment</p>
                  <p className="text-sm text-muted-foreground">
                    {order.paymentMethod.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Shipping Address</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {order.shippingAddress.split(",")[0]}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
