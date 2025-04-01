import Link from "next/link";
import Image from "next/image";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/current-user";

export default async function PurchasesPage() {
  const { user } = await currentUser();

  if (!user) {
    redirect("not-found");
  }

  // Get all user's order items (purchases)
  const purchases = await prisma.orderItem.findMany({
    where: {
      order: {
        userId: user.id,
        status: "DELIVERED", // Only show delivered items as purchases
      },
    },
    include: {
      product: {
        include: {
          category: true,
        },
      },
      order: {
        select: {
          id: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      order: {
        createdAt: "desc",
      },
    },
  });

  // Group purchases by category
  const purchasesByCategory: Record<string, typeof purchases> = {};

  purchases.forEach((purchase) => {
    const categoryName = purchase.product.category.name;
    if (!purchasesByCategory[categoryName]) {
      purchasesByCategory[categoryName] = [];
    }
    purchasesByCategory[categoryName].push(purchase);
  });

  // Get categories with purchases
  const categories = Object.keys(purchasesByCategory);

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Purchases</h1>

      {purchases.length > 0 ? (
        <>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                All Purchases ({purchases.length})
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category} ({purchasesByCategory[category].length})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {purchases.map((purchase) => (
                  <PurchaseCard key={purchase.id} purchase={purchase} />
                ))}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {purchasesByCategory[category].map((purchase) => (
                    <PurchaseCard key={purchase.id} purchase={purchase} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Separator className="my-8" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Purchase History</h2>
            <div className="rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr] divide-y md:divide-y-0 md:divide-x">
                <div className="p-4">
                  <h3 className="font-medium text-sm">Total Purchases</h3>
                  <p className="text-2xl font-bold mt-1">{purchases.length}</p>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm">
                    Most Purchased Category
                  </h3>
                  <p className="text-2xl font-bold mt-1">
                    {categories.reduce((a, b) =>
                      purchasesByCategory[a].length >
                      purchasesByCategory[b].length
                        ? a
                        : b
                    )}
                  </p>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm">Total Spent</h3>
                  <p className="text-2xl font-bold mt-1">
                    $
                    {purchases
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm">First Purchase</h3>
                  <p className="text-2xl font-bold mt-1">
                    {new Date(
                      purchases[purchases.length - 1].order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No purchases yet</h2>
          <p className="mt-2 text-muted-foreground">
            You haven't made any purchases yet. Start shopping to see your
            purchase history.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function PurchaseCard({ purchase }: { purchase: any }) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative h-[200px] w-full overflow-hidden">
        <Image
          src={purchase.product.images[0] || "/placeholder.svg"}
          alt={purchase.product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {purchase.product.category.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(purchase.order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link
            href={`/products/${purchase.product.id}`}
            className="hover:underline"
          >
            <h3 className="font-semibold line-clamp-2">
              {purchase.product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <p className="font-medium">${purchase.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              Qty: {purchase.quantity}
            </p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/products/${purchase.product.id}`}>
                View Product
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/orders/${purchase.order.id}`}>Order Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
