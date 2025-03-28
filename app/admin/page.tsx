import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
  // This would normally come from a database query
  const stats = {
    totalSales: 24890.56,
    totalOrders: 156,
    totalUsers: 432,
    totalProducts: 89,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2023-06-20",
      status: "Delivered",
      total: 129.99,
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2023-06-19",
      status: "Processing",
      total: 79.95,
    },
    {
      id: "ORD-003",
      customer: "Robert Johnson",
      date: "2023-06-18",
      status: "Shipped",
      total: 249.5,
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      date: "2023-06-17",
      status: "Delivered",
      total: 349.99,
    },
    {
      id: "ORD-005",
      customer: "Michael Wilson",
      date: "2023-06-16",
      status: "Processing",
      total: 59.99,
    },
  ]

  const topProducts = [
    {
      id: "1",
      name: "UltraPhone Pro",
      category: "Smartphones",
      price: 999.99,
      sold: 42,
      revenue: 41999.58,
    },
    {
      id: "2",
      name: "PowerBook Pro",
      category: "Laptops",
      price: 1499.99,
      sold: 28,
      revenue: 41999.72,
    },
    {
      id: "3",
      name: "TechPhone Lite",
      category: "Smartphones",
      price: 499.99,
      sold: 56,
      revenue: 27999.44,
    },
    {
      id: "4",
      name: "SmartWatch X",
      category: "Wearables",
      price: 299.99,
      sold: 63,
      revenue: 18899.37,
    },
    {
      id: "5",
      name: "Wireless Earbuds Pro",
      category: "Audio",
      price: 199.99,
      sold: 78,
      revenue: 15599.22,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">+5 new products this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+18.2% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>You have {recentOrders.length} orders this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                            {order.id}
                          </Link>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {order.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/admin/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Your best performing products this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.slice(0, 5).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <Link href={`/admin/products/${product.id}`} className="hover:underline">
                            {product.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">{product.category}</div>
                        </TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell className="text-right">${product.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/admin/products">View All Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>View detailed sales analytics and trends.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                <p className="mt-2 text-sm text-muted-foreground">Detailed analytics charts will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download custom reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sales Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Detailed sales data by product, category, and time period.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Generate
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Inventory Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Current stock levels, low inventory alerts, and restock recommendations.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Generate
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Customer Report</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">
                      Customer demographics, purchase history, and retention metrics.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Generate
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System alerts and important updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                      <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Low Stock Alert</p>
                      <p className="text-xs text-muted-foreground">
                        5 products are running low on inventory. Review and restock soon.
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Sales Milestone Reached</p>
                      <p className="text-xs text-muted-foreground">
                        Congratulations! You've reached $25,000 in monthly sales.
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">1 day ago</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">New User Registrations</p>
                      <p className="text-xs text-muted-foreground">15 new users registered in the last 24 hours.</p>
                    </div>
                    <div className="text-xs text-muted-foreground">2 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

