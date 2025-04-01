import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { SidebarFilters } from "./components/sidebar-filters";
import { Pagination } from "./components/pagination";
import { SortItems } from "./components/sort-items";

type SearchParams = Promise<{
  category: string | null;
  brand: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  sort: string | null;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const where: Prisma.ProductWhereInput = {};

  // Manejo de categorías (puede ser un string simple o varias separadas por comas)
  if (params.category) {
    where.category = params.category.includes(",")
      ? {
          name: { in: params.category.split(",") },
        }
      : {
          name: {
            equals: params.category,
          },
        };
  }

  // Manejo de marcas (similar a categorías)
  if (params.brand) {
    where.brand = params.brand.includes(",")
      ? {
          name: {
            in: params.brand.split(","),
          },
        }
      : {
          name: {
            equals: params.brand,
          },
        };
  }

  // Manejo de precio mínimo y máximo
  if (params.minPrice || params.maxPrice) {
    where.price = {
      ...(params.minPrice ? { gte: parseFloat(params.minPrice) } : {}),
      ...(params.maxPrice ? { lte: parseFloat(params.maxPrice) } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    ...(params.sort === "price-asc" ? { price: "asc" } : {}),
    ...(params.sort === "price-desc" ? { price: "desc" } : {}),
  };

  // This would normally come from a database query
  const products = await prisma.product
    .findMany({
      orderBy,
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        category: true,
        brand: true,
        originalPrice: true,
        hasDiscount: true,
        discount: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })
    .then((products) => {
      return products.map((product) => ({
        ...product,
        rating: product._count.reviews / product._count.reviews,
        reviews: product._count.reviews,
        category: product.category.name,
      }));
    });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] lg:gap-8">
          {/* Filters Sidebar */}

          <SidebarFilters brands={brands} categories={categories} />

          {/* Products Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">All Products</h1>
                <p className="text-muted-foreground">
                  Showing {products.length} products
                </p>
              </div>
              <SortItems />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="h-full overflow-hidden group">
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {product.originalPrice && (
                        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                          Sale
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm font-medium">
                            {product.rating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center">
                      <div className="flex items-center">
                        {product.originalPrice ? (
                          <>
                            <p className="font-semibold">
                              ${product.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground line-through ml-2">
                              ${product.originalPrice.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
