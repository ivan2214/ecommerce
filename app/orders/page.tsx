import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user's orders
  const orders = await prisma.order.findMany({
    where: { userId },
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
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders found.</p>
        <Button className="mt-4" asChild>
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
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : order.status === "SHIPPED"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : order.status === "PROCESSING"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
