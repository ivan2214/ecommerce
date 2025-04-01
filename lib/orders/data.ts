import { Category, Order, OrderItem, Product } from "@prisma/client";
import { prisma } from "../db";

// Generate mock orders
export const mockOrders: Order[] = [
  {
    id: "ord_123456",
    userId: "user_123",
    status: "delivered",
    items: [
      {
        id: "item_1",
        name: "Wireless Headphones",
        price: 129.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "item_2",
        name: "Smartphone Case",
        price: 24.99,
        quantity: 2,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 179.97,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-10-18T14:20:00Z",
  },
  {
    id: "ord_789012",
    userId: "user_123",
    status: "shipped",
    items: [
      {
        id: "item_3",
        name: "Smart Watch",
        price: 249.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 249.99,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "PayPal",
    createdAt: "2023-11-05T09:15:00Z",
    updatedAt: "2023-11-06T11:45:00Z",
  },
  {
    id: "ord_345678",
    userId: "user_123",
    status: "processing",
    items: [
      {
        id: "item_4",
        name: "Bluetooth Speaker",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "item_5",
        name: "Wireless Charger",
        price: 39.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "item_6",
        name: "USB-C Cable",
        price: 12.99,
        quantity: 3,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 158.94,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-12-01T15:20:00Z",
    updatedAt: "2023-12-02T09:10:00Z",
  },
  {
    id: "ord_901234",
    userId: "user_123",
    status: "pending",
    items: [
      {
        id: "item_7",
        name: "Laptop Backpack",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 59.99,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2023-12-10T18:30:00Z",
    updatedAt: "2023-12-10T18:30:00Z",
  },
  {
    id: "ord_567890",
    userId: "user_123",
    status: "cancelled",
    items: [
      {
        id: "item_8",
        name: "Wireless Mouse",
        price: 29.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
      {
        id: "item_9",
        name: "Keyboard",
        price: 49.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
      },
    ],
    total: 79.98,
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "PayPal",
    createdAt: "2023-11-20T12:15:00Z",
    updatedAt: "2023-11-21T09:30:00Z",
  },
];

export interface ProductWithRelations extends Product {
  category: Category;
}

export interface OrderItemWithRelations extends OrderItem {
  product: ProductWithRelations;
}

export interface OrderWithRelations extends Order {
  orderItems: OrderItemWithRelations[];
}

// Function to get all orders for a user
export async function getOrdersByUserId(
  userId: string
): Promise<OrderWithRelations[]> {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
  return orders;
  /* return mockOrders.filter((order) => order.userId === userId); */
}

// Function to get a specific order by ID
export function getOrderById(orderId: string): Order | undefined {
  return mockOrders.find((order) => order.id === orderId);
}
