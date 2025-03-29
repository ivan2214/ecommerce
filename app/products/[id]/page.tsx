import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Share2, Star, Truck } from "lucide-react";

import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ProductQuantity } from "@/components/product-quantity";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  // Get product with category, reviews and check if it's favorited
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Check if product is in user's favorites
  let isFavorited = false;
  if (userId) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        productId: product.id,
      },
    });
    isFavorited = !!favorite;
  }

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  // Get related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      category: true,
    },
  });

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-md border"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{product.category.name}</Badge>
              {product.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(avgRating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {avgRating > 0 ? avgRating.toFixed(1) : "No ratings"}
              </span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
              {product.stock > 0 && product.stock <= 10 && (
                <span className="ml-2">Only {product.stock} left!</span>
              )}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>

            <ProductQuantity stock={product.stock} />
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <AddToCartButton productId={product.id} stock={product.stock} />
            <FavoriteButton
              productId={product.id}
              isFavorited={isFavorited}
              variant="default"
            />
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium">
                Free shipping on orders over $50
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimated delivery: 3-5 business days
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4 space-y-4">
            <div className="prose max-w-none dark:prose-invert">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <div className="rounded-lg border">
              <div className="divide-y">
                <div className="grid grid-cols-2 p-4">
                  <div className="font-medium">Category</div>
                  <div>{product.category.name}</div>
                </div>
                <div className="grid grid-cols-2 p-4">
                  <div className="font-medium">Stock</div>
                  <div>{product.stock} units</div>
                </div>
                <div className="grid grid-cols-2 p-4">
                  <div className="font-medium">Featured</div>
                  <div>{product.featured ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>
            <div className="space-y-4">
              {product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                          {review.user.name ? (
                            <span className="text-lg font-semibold">
                              {review.user.name.charAt(0)}
                            </span>
                          ) : (
                            <Image
                              src="/placeholder-user.jpg"
                              alt="User"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {review.user.name || "Anonymous"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              href={`/products/${relatedProduct.id}`}
            >
              <Card className="h-full overflow-hidden group">
                <div className="relative h-[200px] w-full overflow-hidden">
                  <Image
                    src={relatedProduct.images[0] || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {relatedProduct.category.name}
                    </p>
                    <h3 className="font-semibold">{relatedProduct.name}</h3>
                    <p className="font-semibold">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
