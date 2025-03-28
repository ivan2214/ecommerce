import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ProductsPage() {
  // This would normally come from a database query
  const products = [
    {
      id: "1",
      name: "UltraPhone Pro",
      description: "The latest smartphone with advanced features and long battery life.",
      price: 999.99,
      image: "/images/products/ultraphone-1.jpg",
      category: "Smartphones",
      rating: 4.8,
      reviews: 124,
      featured: true,
    },
    {
      id: "2",
      name: "PowerBook Pro",
      description: "High-performance laptop for professionals and gamers.",
      price: 1499.99,
      image: "/images/products/powerbook-1.jpg",
      category: "Laptops",
      rating: 4.9,
      reviews: 86,
      featured: true,
    },
    {
      id: "3",
      name: "TechPhone Lite",
      description: "Affordable smartphone with great performance and camera quality.",
      price: 499.99,
      originalPrice: 549.99,
      image: "/images/products/techphone-1.jpg",
      category: "Smartphones",
      rating: 4.5,
      reviews: 52,
      featured: true,
    },
    {
      id: "4",
      name: "SmartWatch X",
      description: "Track your fitness and stay connected with this stylish smartwatch.",
      price: 299.99,
      image: "/images/products/smartwatch-1.jpg",
      category: "Wearables",
      rating: 4.6,
      reviews: 38,
      featured: true,
    },
    {
      id: "5",
      name: "Wireless Earbuds Pro",
      description: "Immersive sound quality with active noise cancellation.",
      price: 199.99,
      image: "/images/products/earbuds-1.jpg",
      category: "Audio",
      rating: 4.7,
      reviews: 92,
    },
    {
      id: "6",
      name: "Gaming Console X",
      description: "Next-generation gaming with stunning graphics and fast performance.",
      price: 499.99,
      image: "/images/products/console-1.jpg",
      category: "Gaming",
      rating: 4.9,
      reviews: 76,
    },
  ]

  const categories = [
    { id: "1", name: "Smartphones", count: 12 },
    { id: "2", name: "Laptops", count: 8 },
    { id: "3", name: "Wearables", count: 6 },
    { id: "4", name: "Audio", count: 10 },
    { id: "5", name: "Gaming", count: 7 },
  ]

  const brands = [
    { id: "1", name: "TechBrand", count: 15 },
    { id: "2", name: "UltraTech", count: 12 },
    { id: "3", name: "PowerTech", count: 8 },
    { id: "4", name: "SmartLife", count: 6 },
    { id: "5", name: "GamerX", count: 4 },
  ]

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
            <Accordion type="multiple" defaultValue={["categories", "price", "brands"]}>
              <AccordionItem value="categories">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category.id}`} />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="flex-1 text-sm font-normal cursor-pointer"
                        >
                          {category.name} ({category.count})
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
                        <Input id="max-price" type="number" placeholder="1000" />
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
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand.id}`} />
                        <Label htmlFor={`brand-${brand.id}`} className="flex-1 text-sm font-normal cursor-pointer">
                          {brand.name} ({brand.count})
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
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                        In Stock
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="on-sale" />
                      <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
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
                <p className="text-muted-foreground">Showing {products.length} products</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
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
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {product.originalPrice && (
                        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">Sale</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">({product.reviews})</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center">
                      <div className="flex items-center">
                        {product.originalPrice ? (
                          <>
                            <p className="font-semibold">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground line-through ml-2">
                              ${product.originalPrice.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold">${product.price.toFixed(2)}</p>
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
                <Button variant="outline" size="sm" className="h-8 w-8" disabled>
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
  )
}

