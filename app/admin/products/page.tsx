"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Download, Edit, MoreHorizontal, Plus, Search, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function ProductsPage() {
  // This would normally come from a database query
  const initialProducts = [
    {
      id: "1",
      name: "UltraPhone Pro",
      category: "Smartphones",
      price: 999.99,
      stock: 50,
      status: "In Stock",
      featured: true,
      image: "/images/products/ultraphone-1.jpg",
    },
    {
      id: "2",
      name: "PowerBook Pro",
      category: "Laptops",
      price: 1499.99,
      stock: 30,
      status: "In Stock",
      featured: true,
      image: "/images/products/powerbook-1.jpg",
    },
    {
      id: "3",
      name: "TechPhone Lite",
      category: "Smartphones",
      price: 499.99,
      stock: 100,
      status: "In Stock",
      featured: false,
      image: "/images/products/techphone-1.jpg",
    },
    {
      id: "4",
      name: "SmartWatch X",
      category: "Wearables",
      price: 299.99,
      stock: 75,
      status: "In Stock",
      featured: true,
      image: "/images/products/smartwatch-1.jpg",
    },
    {
      id: "5",
      name: "Wireless Earbuds Pro",
      category: "Audio",
      price: 199.99,
      stock: 120,
      status: "In Stock",
      featured: false,
      image: "/images/products/earbuds-1.jpg",
    },
    {
      id: "6",
      name: "Gaming Console X",
      category: "Gaming",
      price: 499.99,
      stock: 0,
      status: "Out of Stock",
      featured: false,
      image: "/images/products/console-1.jpg",
    },
    {
      id: "7",
      name: "Smart Speaker",
      category: "Audio",
      price: 129.99,
      stock: 85,
      status: "In Stock",
      featured: false,
      image: "/images/products/speaker-1.jpg",
    },
    {
      id: "8",
      name: "Ultra HD TV",
      category: "TVs",
      price: 1299.99,
      stock: 15,
      status: "Low Stock",
      featured: true,
      image: "/images/products/tv-1.jpg",
    },
    {
      id: "9",
      name: "Digital Camera Pro",
      category: "Cameras",
      price: 799.99,
      stock: 25,
      status: "In Stock",
      featured: false,
      image: "/images/products/camera-1.jpg",
    },
    {
      id: "10",
      name: "Portable Charger",
      category: "Accessories",
      price: 49.99,
      stock: 200,
      status: "In Stock",
      featured: false,
      image: "/images/products/charger-1.jpg",
    },
  ]

  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    const matchesStatus = statusFilter === "all" || product.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(products.map((product) => product.category))]
  const statuses = [...new Set(products.map((product) => product.status))]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory, update details, and track stock levels.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:space-x-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/admin/products/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          product.status === "In Stock"
                            ? "border-green-500 text-green-500"
                            : product.status === "Low Stock"
                              ? "border-yellow-500 text-yellow-500"
                              : "border-red-500 text-red-500"
                        }`}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <Badge variant="default">Featured</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="px-4">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

