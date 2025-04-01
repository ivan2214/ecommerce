import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";

type OrderTimelineProps = {
  status: string;
  createdAt: Date;
};

export function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  // Calculate dates based on order creation date
  const orderDate = new Date(createdAt);

  // For demo purposes, we'll set processing to 1 day after order, shipping to 2 days after, and delivery to 5 days after
  const processingDate = new Date(orderDate);
  processingDate.setDate(processingDate.getDate() + 1);

  const shippingDate = new Date(orderDate);
  shippingDate.setDate(shippingDate.getDate() + 2);

  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  const today = new Date();

  // Determine which steps are completed based on status
  const isProcessed = status !== "CANCELLED";
  const isShipped = status === "SHIPPED" || status === "DELIVERED";
  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />

        {/* Order placed */}
        <div className="relative flex items-start gap-4 pb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">Order Placed</h3>
            <p className="text-sm text-muted-foreground">
              {orderDate.toLocaleDateString()} at{" "}
              {orderDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm mt-1">
              Your order has been received and is being processed.
            </p>
          </div>
        </div>

        {/* Processing */}
        <div className="relative flex items-start gap-4 pb-8">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isCancelled
                ? "bg-destructive text-destructive-foreground"
                : isProcessed
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isCancelled ? (
              <XCircle className="h-5 w-5" />
            ) : isProcessed ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-medium">
              {isCancelled ? "Order Cancelled" : "Processing"}
            </h3>
            {isCancelled ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {today.toLocaleDateString()} at{" "}
                  {today.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm mt-1">Your order has been cancelled.</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {isProcessed
                    ? `${processingDate.toLocaleDateString()} at ${processingDate.toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}`
                    : "Estimated: " + processingDate.toLocaleDateString()}
                </p>
                <p className="text-sm mt-1">
                  {isProcessed
                    ? "Your order has been processed and is being prepared for shipping."
                    : "Your order will be processed soon."}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Shipped */}
        {!isCancelled && (
          <div className="relative flex items-start gap-4 pb-8">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isShipped
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isShipped ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Package className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-medium">Shipped</h3>
              <p className="text-sm text-muted-foreground">
                {isShipped
                  ? `${shippingDate.toLocaleDateString()} at ${shippingDate.toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}`
                  : "Estimated: " + shippingDate.toLocaleDateString()}
              </p>
              <p className="text-sm mt-1">
                {isShipped
                  ? "Your order has been shipped and is on its way to you."
                  : "Your order will be shipped soon."}
              </p>
            </div>
          </div>
        )}

        {/* Delivered */}
        {!isCancelled && (
          <div className="relative flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isDelivered
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isDelivered ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Truck className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-medium">Delivered</h3>
              <p className="text-sm text-muted-foreground">
                {isDelivered
                  ? `${deliveryDate.toLocaleDateString()} at ${deliveryDate.toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}`
                  : "Estimated: " + deliveryDate.toLocaleDateString()}
              </p>
              <p className="text-sm mt-1">
                {isDelivered
                  ? "Your order has been delivered. Enjoy your purchase!"
                  : "Your order will be delivered soon."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
