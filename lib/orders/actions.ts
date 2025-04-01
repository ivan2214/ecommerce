"use server";

import { getOrdersByUserId, getOrderById } from "./data";

// Get all orders for a user
export async function getUserOrders(userId: string) {
  try {
    // In a real app, you would verify the user is authorized to view these orders
    const orders = await getOrdersByUserId(userId);
    return { success: true, orders };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

// Get a specific order by ID
export async function getOrder(orderId: string, userId: string) {
  try {
    // In a real app, you would verify the user is authorized to view this order
    const order = getOrderById(orderId);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    // Check if the order belongs to the user
    if (order.userId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}
