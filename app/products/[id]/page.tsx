import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductPage({ params }: { params: { id: string } }) {
  // This would normally come from a database query
  const product = {
    id: params.id,
    name: "UltraPhone Pro",
    description: "The latest smartphone with advanced features and long battery life.",
    longDescription: `
      <p>Experience the future of mobile technology with the UltraPhone Pro. This cutting-edge smartphone combines sleek design with powerful performance to deliver an exceptional user experience.</p>
      
      <p>Key Features:</p>
      <ul>
        <li>6.7-inch Super AMOLED display with 120Hz refresh rate</li>
        <li>Advanced quad-camera system with 108MP main sensor</li>
        <li>5G connectivity for lightning-fast downloads and streaming</li>
        <li>5000mAh battery with fast charging and wireless charging support</li>
        <li>Latest processor for smooth multitasking and gaming</li>
        <li>Water and dust resistant (IP68 rated)</li>
        <li>256GB storage with expandable memory options</li>
      </ul>
      
      <p>The UltraPhone Pro is perfect for professionals, content creators, and anyone who demands the best from their mobile device. With its premium build quality and state-of-the-art features, it's designed to keep up with your busy lifestyle.</p>
    `,
    price: 999.99,
    stock: 50,
    sku: "UP-2023-001",
    images: [
      "/images/products/ultraphone-1.jpg",
      "/images/products/ultraphone-2.jpg",
      "/images/products/ultraphone-3.jpg",
      "/images/products/ultraphone-4.jpg",
    ],
    category: "Smartphones",
    brand: "TechBrand",
    rating: 4.8,
    reviews: 124,
    featured: true,
    specifications: [
      { name: "Display", value: "6.7-inch Super AMOLED, 120Hz" },
      { name: "Processor", value: "OctaCore 2.8GHz" },
      { name: "RAM", value: "8GB" },
      { name: "Storage", value: "256GB" },
      { name: "Camera", value: "Quad 108MP + 12MP + 10MP + 8MP" },
      { name: "Battery", value: "5000mAh" },
      { name: "OS", value: "Android 13" },
      { name: "Dimensions", value: "165.1 x 75.6 x 8.9 mm" },
      { name: "Weight", value: "228g" },
    ],
    colors: [
      { name: "Midnight Black", value: "#000000" },
      { name: "Stellar Silver", value: "#C0C0C0" },
      { name: "Ocean Blue", value: "#0077be" },
    ],
    relatedProducts: [
      {
        id: "2",
        name: "TechPhone Lite",
        price: 499.99,
        image: "/images/products/techphone-1.jpg",
        category: "Smartphones",
      },
      {
        id: "3",
        name: "SmartWatch X",
        price: 299.99,
        image: "/images/products/smartwatch-1.jpg",
        category: "Wearables",
      },
      {
        id: "4",
        name: "Wireless Earbuds Pro",
        price: 199.99,
        image: "/images/products/earbuds-1.jpg",
        category: "Audio",
      },
    ],
  }

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
              <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
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
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="outline">{product.brand}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
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
              {product.stock > 0 && product.stock <= 10 && <span className="ml-2">Only {product.stock} left!</span>}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium">Color</p>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <div
                    key={color.name}
                    className="relative h-8 w-8 rounded-full border p-1 cursor-pointer"
                    title={color.name}
                  >
                    <span className="block h-full w-full rounded-full" style={{ backgroundColor: color.value }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Quantity</p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="w-12 text-center">1</span>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button className="flex-1" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="mr-2 h-5 w-5" />
              Add to Wishlist
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium">Free shipping on orders over $50</p>
            </div>
            <p className="text-sm text-muted-foreground">Estimated delivery: 3-5 business days</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4 space-y-4">
            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
          </TabsContent>
          <TabsContent value="specifications" className="mt-4">
            <div className="rounded-lg border">
              <div className="divide-y">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 p-4">
                    <div className="font-medium">{spec.name}</div>
                    <div>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>
            <div className="space-y-4">
              {/* Sample reviews - would come from database */}
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                        <Image src="/placeholder-user.jpg" alt="User" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">2 months ago</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p>
                    This phone exceeded my expectations! The camera quality is amazing and the battery lasts all day
                    even with heavy use. The display is bright and vibrant, making it perfect for watching videos and
                    playing games.
                  </p>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                        <Image src="/placeholder-user.jpg" alt="User" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-muted-foreground">1 month ago</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p>
                    Great phone overall, but I found the size a bit too large for comfortable one-handed use. The camera
                    is excellent and the performance is top-notch. Battery life is impressive, lasting nearly two days
                    with moderate use.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {product.relatedProducts.map((relatedProduct) => (
            <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
              <Card className="h-full overflow-hidden group">
                <div className="relative h-[200px] w-full overflow-hidden">
                  <Image
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{relatedProduct.category}</p>
                    <h3 className="font-semibold">{relatedProduct.name}</h3>
                    <p className="font-semibold">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

