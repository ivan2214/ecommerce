import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

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
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Input placeholder="Search products..." className="w-full" />
                </div>
              </div>
            </div>
            <Separator />
            <Accordion
              type="multiple"
              defaultValue={["categories", "price", "brands"]}
            >
              <AccordionItem value="categories">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`category-${category.id}`} />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="flex-1 text-sm font-normal cursor-pointer"
                        >
                          {category.name} ({category._count.products})
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-price">Min</Label>
                        <Input id="min-price" type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-price">Max</Label>
                        <Input
                          id="max-price"
                          type="number"
                          placeholder="1000"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Apply
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="brands">
                <AccordionTrigger>Brands</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`brand-${brand.id}`} />
                        <Label
                          htmlFor={`brand-${brand.id}`}
                          className="flex-1 text-sm font-normal cursor-pointer"
                        >
                          {brand.name} ({brand._count.products})
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="rating">
                <AccordionTrigger>Rating</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="flex-1 text-sm font-normal cursor-pointer flex items-center"
                        >
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-primary text-primary"
                            />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-muted-foreground"
                            />
                          ))}
                          <span className="ml-1">& Up</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="availability">
                <AccordionTrigger>Availability</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-stock" />
                      <Label
                        htmlFor="in-stock"
                        className="text-sm font-normal cursor-pointer"
                      >
                        In Stock
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="on-sale" />
                      <Label
                        htmlFor="on-sale"
                        className="text-sm font-normal cursor-pointer"
                      >
                        On Sale
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <Button variant="outline" className="w-full">
              Reset Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">All Products</h1>
                <p className="text-muted-foreground">
                  Showing {products.length} products
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <span className="sr-only">Previous page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8"
                  disabled
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  3
                </Button>
                <Button variant="outline" size="icon">
                  <span className="sr-only">Next page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
