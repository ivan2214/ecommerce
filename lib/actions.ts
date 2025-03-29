"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

// Product actions
export async function createProduct(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const role = user.publicMetadata.role as Role;

  if (role !== "SUPER_ADMIN" && role !== "PRODUCT_MANAGER") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const originalPrice = Number.parseFloat(
    formData.get("originalPrice") as string
  );
  const hasDiscount = formData.get("hasDiscount") === "on";
  const discount = Number.parseFloat(formData.get("discount") as string);
  const price = hasDiscount ? originalPrice - discount : originalPrice;

  const stock = Number.parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "on";

  // Handle image uploads in a real app
  const images = ["/placeholder.svg"];

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      originalPrice,
      hasDiscount,
      discount,
      stock,
      categoryId,
      featured,
      images,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return product;
}

export async function updateProduct(productId: string, formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const role = user.publicMetadata.role as Role;

  if (role !== "SUPER_ADMIN" && role !== "PRODUCT_MANAGER") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number.parseFloat(formData.get("price") as string);
  const stock = Number.parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const featured = formData.get("featured") === "on";

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      featured,
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/products/${productId}`);
  revalidatePath("/admin/products");
  revalidatePath("/products");

  return product;
}

export async function deleteProduct(productId: string) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const role = user.publicMetadata.role as Role;

  if (role !== "SUPER_ADMIN" && role !== "PRODUCT_MANAGER") {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return { success: true };
}

// Cart actions
export async function addToCart(productId: string, quantity = 1) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to add items to your cart");
  }

  // Check if product exists and has enough stock
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Not enough stock available");
  }

  // Check if user has a cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  // If no cart exists, create one
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: { items: true },
    });
  }

  // Check if product already exists in cart
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    // Check if the new total quantity exceeds available stock
    if (existingItem.quantity + quantity > product.stock) {
      throw new Error("Not enough stock available");
    }

    // Update quantity if product already in cart
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    // Add new item to cart
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  revalidatePath("/cart");

  return { success: true };
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Ensure the cart item belongs to the user
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: {
      cart: true,
      product: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Check if there's enough stock
  if (quantity > cartItem.product.stock) {
    throw new Error("Not enough stock available");
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  } else {
    // Update quantity
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");

  return { success: true };
}

export async function removeFromCart(cartItemId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Ensure the cart item belongs to the user
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  revalidatePath("/cart");

  return { success: true };
}

// Order actions
export async function createOrder(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to place an order");
  }

  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  // Check stock availability for all items
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Not enough stock available for ${item.product.name}`);
    }
  }

  // Calculate total
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Get shipping address from form
  const shippingAddress = formData.get("shippingAddress") as string;
  const paymentMethod = formData.get("paymentMethod") as string;

  // Start a transaction to ensure all operations succeed or fail together
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        shippingAddress,
        paymentMethod: paymentMethod as any,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Update product stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear cart after order is created
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  revalidatePath("/orders");
  revalidatePath("/products");

  return order;
}

// Favorite actions
export async function toggleFavorite(productId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to add favorites");
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingUser || !existingProduct) {
    throw new Error("User or product not found");
  }

  // Check if product is already in favorites
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existingFavorite) {
    // Remove from favorites
    await prisma.favorite.delete({
      where: { id: existingFavorite.id },
    });
  } else {
    // Add to favorites
    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  revalidatePath("/favorites");
  revalidatePath(`/products/${productId}`);

  return { success: true };
}

// Review actions
export async function createReview(productId: string, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to leave a review");
  }

  const rating = Number.parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check if user has already reviewed this product
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (existingReview) {
    // Update existing review
    const review = await prisma.review.update({
      where: { id: existingReview.id },
      data: {
        rating,
        comment,
      },
    });

    revalidatePath(`/products/${productId}`);
    return review;
  }

  // Create new review
  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
  });

  revalidatePath(`/products/${productId}`);
  return review;
}
