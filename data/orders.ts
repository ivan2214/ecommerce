import { prisma } from "@/lib/db";
import { Category, Order, OrderItem, Product } from "@prisma/client";

export interface ProductWithRelations extends Product {
  category: Category;
}

export interface OrderItemsWithRelations extends OrderItem {
  product: ProductWithRelations;
}

export interface OrderWithRelations extends Order {
  orderItems: OrderItemsWithRelations[];
}

export async function getUserOrders(userId: string): Promise<{
  success: boolean;
  orders: OrderWithRelations[];
  error: string;
}> {
  const orders = await prisma.order.findMany({
    where: {
      userId,
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

  if (!orders) {
    return {
      success: false,
      orders: [],
      error: "No orders found",
    };
  }

  return {
    success: true,
    orders,
    error: "",
  };
}
