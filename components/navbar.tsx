"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { ShoppingCart, Menu, X, Search, Heart, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import CartPreview from "@/components/cart-preview"

export default function Navbar() {
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const isAdmin = user?.publicMetadata?.role === "SUPER_ADMIN" || user?.publicMetadata?.role === "PRODUCT_MANAGER"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <span className="font-bold">E-Shop</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/" ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`transition-colors hover:text-foreground/80 ${
              pathname.startsWith("/products") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className={`transition-colors hover:text-foreground/80 ${
              pathname.startsWith("/categories") ? "text-foreground" : "text-foreground/60"
            }`}
          >
            Categories
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/admin") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center space-x-2">
          {isSearchOpen ? (
            <div className="relative w-full max-w-sm">
              <Input type="search" placeholder="Search products..." className="w-full" autoFocus />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {isSignedIn && (
            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Button>
            </Link>
          )}

          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <CartPreview onCheckout={() => setIsCartOpen(false)} />
            </SheetContent>
          </Sheet>

          <ModeToggle />

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href="/sign-in">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()

  const isAdmin = user?.publicMetadata?.role === "SUPER_ADMIN" || user?.publicMetadata?.role === "PRODUCT_MANAGER"

  return (
    <div className="flex flex-col h-full">
      <Link href="/" className="flex items-center space-x-2 py-4">
        <Package className="h-6 w-6" />
        <span className="font-bold">E-Shop</span>
      </Link>
      <div className="flex-1 overflow-auto py-2">
        <nav className="flex flex-col space-y-3">
          <Link href="/" className={`px-2 py-1 rounded-md ${pathname === "/" ? "bg-accent" : ""}`}>
            Home
          </Link>
          <Link
            href="/products"
            className={`px-2 py-1 rounded-md ${pathname.startsWith("/products") ? "bg-accent" : ""}`}
          >
            Products
          </Link>
          <Link
            href="/categories"
            className={`px-2 py-1 rounded-md ${pathname.startsWith("/categories") ? "bg-accent" : ""}`}
          >
            Categories
          </Link>
          {isSignedIn && (
            <>
              <Link
                href="/orders"
                className={`px-2 py-1 rounded-md ${pathname.startsWith("/orders") ? "bg-accent" : ""}`}
              >
                My Orders
              </Link>
              <Link
                href="/favorites"
                className={`px-2 py-1 rounded-md ${pathname.startsWith("/favorites") ? "bg-accent" : ""}`}
              >
                Favorites
              </Link>
              <Link
                href="/profile"
                className={`px-2 py-1 rounded-md ${pathname.startsWith("/profile") ? "bg-accent" : ""}`}
              >
                Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link href="/admin" className={`px-2 py-1 rounded-md ${pathname.startsWith("/admin") ? "bg-accent" : ""}`}>
              Admin Dashboard
            </Link>
          )}
        </nav>
      </div>
      {!isSignedIn && (
        <div className="border-t py-4">
          <div className="flex flex-col space-y-2">
            <Link href="/sign-in" className="w-full">
              <Button variant="default" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full">
              <Button variant="outline" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

