import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserOrders } from "@/data/orders";

import { getSession } from "next-auth/react";
import { OrderStatus } from "@prisma/client";

// Status badge component
function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    pending: { variant: "outline" as const, icon: Clock },
    PROCESSING: { variant: "secondary" as const, icon: Package },
    SHIPPED: { variant: "default" as const, icon: Truck },
    DELIVERED: { variant: "success" as const, icon: CheckCircle },
    CANCELLED: { variant: "destructive" as const, icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={
        config.variant as "outline" | "secondary" | "default" | "destructive"
      }
      className="flex items-center gap-1"
    >
      <Icon className="h-3 w-3" />
      <span className="capitalize">{status}</span>
    </Badge>
  );
}

export default async function OrdersPage() {
  // In a real app, you would get the user ID from the session
  const userId = "user_0"; // Mock user ID
  const { success, orders, error } = await getUserOrders(userId);

  if (!success) {
    return (
      <div className="container max-w-6xl py-10">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">
              Failed to load orders: {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-60 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button asChild>
              <Link href="/">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>
                      Placed on{" "}
                      {format(new Date(order.createdAt), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Items</h3>
                    <ul className="space-y-3">
                      {order.orderItems.slice(0, 2).map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded border bg-muted flex items-center justify-center overflow-hidden">
                            <img
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </li>
                      ))}
                      {order.orderItems.length > 2 && (
                        <li className="text-sm text-muted-foreground">
                          +{order.orderItems.length - 2} more items
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Total</dt>
                        <dd className="font-medium">
                          ${order.total.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          Payment Method
                        </dt>
                        <dd>{order.paymentMethod}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center"
                    >
                      View Order Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
