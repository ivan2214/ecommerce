import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FavoriteButton } from "@/components/favorite-button";

export default async function FavoritesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user's favorites
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(({ product }) => {
            // Calculate average rating
            const avgRating =
              product.reviews.length > 0
                ? product.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / product.reviews.length
                : 0;

            return (
              <Card key={product.id} className="h-full overflow-hidden group">
                <div className="relative">
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton productId={product.id} isFavorited={true} />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {product.category.name}
                    </p>
                    <Link
                      href={`/products/${product.id}`}
                      className="hover:underline"
                    >
                      <h3 className="font-semibold line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(avgRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 fill-gray-300 dark:text-gray-600 dark:fill-gray-600"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {avgRating > 0 ? avgRating.toFixed(1) : "No reviews"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="font-semibold">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button size="sm" className="h-8 gap-1">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No favorites yet</h2>
          <p className="mt-2 text-muted-foreground">
            Products you add to your favorites will appear here.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
