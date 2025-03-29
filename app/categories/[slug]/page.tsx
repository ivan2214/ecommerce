import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { prisma } from "@/lib/db";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  // Get category by slug
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        include: {
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-6">
        <Link
          href="/categories"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Categories
        </Link>
        <h1 className="text-3xl font-bold mt-2">{category.name}</h1>
        <p className="text-muted-foreground mt-1">{category.description}</p>
      </div>

      {category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.products.map((product) => {
            // Calculate average rating
            const avgRating =
              product.reviews.length > 0
                ? product.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / product.reviews.length
                : 0;

            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="h-full overflow-hidden group">
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {product.stock <= 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                        Out of Stock
                      </Badge>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">
                          {avgRating > 0 ? avgRating.toFixed(1) : "No reviews"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center">
                    <div className="font-semibold">
                      ${product.price.toFixed(2)}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
