import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  // This would normally come from a database query
  const featuredCategories = [
    {
      id: "1",
      name: "Electronics",
      image: "/images/categories/electronics.jpg",
      count: 120,
    },
    {
      id: "2",
      name: "Clothing",
      image: "/images/categories/clothing.jpg",
      count: 84,
    },
    {
      id: "3",
      name: "Home & Kitchen",
      image: "/images/categories/home.jpg",
      count: 97,
    },
  ];

  const featuredProducts = [
    {
      id: "1",
      name: "UltraPhone Pro",
      description:
        "The latest smartphone with advanced features and long battery life.",
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
      description:
        "Affordable smartphone with great performance and camera quality.",
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
      description:
        "Track your fitness and stay connected with this stylish smartwatch.",
      price: 299.99,
      image: "/images/products/smartwatch-1.jpg",
      category: "Wearables",
      rating: 4.6,
      reviews: 38,
      featured: true,
    },
  ];

  const testimonials = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Verified Customer",
      content:
        "I've been shopping here for years and the quality of products and customer service is consistently excellent. Fast shipping and easy returns make this my go-to online store.",
      avatar: "/images/avatars/avatar-1.jpg",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Verified Customer",
      content:
        "The product selection is amazing and the website is so easy to navigate. I found exactly what I was looking for at a great price. Will definitely shop here again!",
      avatar: "/images/avatars/avatar-2.jpg",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Verified Customer",
      content:
        "Customer support went above and beyond to help me with a return. The whole process was smooth and hassle-free. Highly recommend this store to everyone!",
      avatar: "/images/avatars/avatar-3.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  New Collection
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover Quality Products for Every Need
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Shop the latest trends and essentials with our curated
                  collection of high-quality products at competitive prices.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" size="lg">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl">
              <Image
                src="/placeholder.svg"
                alt="Hero Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Shop by Category
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Explore our wide range of categories to find exactly what you
                need.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {featuredCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <div className="group relative overflow-hidden rounded-lg">
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm">{category.count} Products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Featured Products
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Discover our most popular and trending products.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {featuredProducts.map((product) => (
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
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                What Our Customers Say
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Don't just take our word for it. Here's what our customers have
                to say.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="flex-1 text-muted-foreground">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center space-x-1 mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Stay Updated
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Subscribe to our newsletter for the latest products, exclusive
                offers, and more.
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <form className="flex space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
