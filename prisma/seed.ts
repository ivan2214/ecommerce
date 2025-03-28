import { PrismaClient, Role } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.favorite.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.cartItem.deleteMany({})
  await prisma.cart.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.address.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.user.deleteMany({})

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Smartphones",
        description: "Latest smartphones with advanced features",
        image: "/images/categories/smartphones.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Laptops",
        description: "High-performance laptops for work and gaming",
        image: "/images/categories/laptops.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Wearables",
        description: "Smart watches and fitness trackers",
        image: "/images/categories/wearables.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Audio",
        description: "Headphones, earbuds, and speakers",
        image: "/images/categories/audio.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Gaming",
        description: "Gaming consoles and accessories",
        image: "/images/categories/gaming.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "TVs",
        description: "Smart TVs with high resolution displays",
        image: "/images/categories/tvs.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Cameras",
        description: "Digital cameras and accessories",
        image: "/images/categories/cameras.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accessories",
        description: "Chargers, cables, and other accessories",
        image: "/images/categories/accessories.jpg",
      },
    }),
  ])

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "UltraPhone Pro",
        description: "The latest smartphone with advanced features and long battery life.",
        price: 999.99,
        stock: 50,
        images: [
          "/images/products/ultraphone-1.jpg",
          "/images/products/ultraphone-2.jpg",
          "/images/products/ultraphone-3.jpg",
          "/images/products/ultraphone-4.jpg",
        ],
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "PowerBook Pro",
        description: "High-performance laptop for professionals and gamers.",
        price: 1499.99,
        stock: 30,
        images: ["/images/products/powerbook-1.jpg", "/images/products/powerbook-2.jpg"],
        featured: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "TechPhone Lite",
        description: "Affordable smartphone with great performance and camera quality.",
        price: 499.99,
        stock: 100,
        images: ["/images/products/techphone-1.jpg", "/images/products/techphone-2.jpg"],
        featured: false,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "SmartWatch X",
        description: "Track your fitness and stay connected with this stylish smartwatch.",
        price: 299.99,
        stock: 75,
        images: ["/images/products/smartwatch-1.jpg", "/images/products/smartwatch-2.jpg"],
        featured: true,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Wireless Earbuds Pro",
        description: "Immersive sound quality with active noise cancellation.",
        price: 199.99,
        stock: 120,
        images: ["/images/products/earbuds-1.jpg", "/images/products/earbuds-2.jpg"],
        featured: false,
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Gaming Console X",
        description: "Next-generation gaming with stunning graphics and fast performance.",
        price: 499.99,
        stock: 0,
        images: ["/images/products/console-1.jpg", "/images/products/console-2.jpg"],
        featured: false,
        categoryId: categories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Smart Speaker",
        description: "Voice-controlled speaker with premium sound quality.",
        price: 129.99,
        stock: 85,
        images: ["/images/products/speaker-1.jpg", "/images/products/speaker-2.jpg"],
        featured: false,
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Ultra HD TV",
        description: "65-inch 4K smart TV with HDR and built-in streaming apps.",
        price: 1299.99,
        stock: 15,
        images: ["/images/products/tv-1.jpg", "/images/products/tv-2.jpg"],
        featured: true,
        categoryId: categories[5].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Digital Camera Pro",
        description: "Professional-grade camera with 24MP sensor and 4K video recording.",
        price: 799.99,
        stock: 25,
        images: ["/images/products/camera-1.jpg", "/images/products/camera-2.jpg"],
        featured: false,
        categoryId: categories[6].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Portable Charger",
        description: "20,000mAh power bank with fast charging support.",
        price: 49.99,
        stock: 200,
        images: ["/images/products/charger-1.jpg", "/images/products/charger-2.jpg"],
        featured: false,
        categoryId: categories[7].id,
      },
    }),
  ])

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user_1",
        email: "admin@example.com",
        name: "Admin User",
        role: Role.SUPER_ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        id: "user_2",
        email: "manager@example.com",
        name: "Product Manager",
        role: Role.PRODUCT_MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        id: "user_3",
        email: "customer@example.com",
        name: "John Customer",
        role: Role.USER,
      },
    }),
  ])

  // Create addresses for the customer
  await prisma.address.create({
    data: {
      userId: users[2].id,
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      isDefault: true,
    },
  })

  await prisma.address.create({
    data: {
      userId: users[2].id,
      street: "456 Park Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA",
      isDefault: false,
    },
  })

  // Create cart for the customer
  const cart = await prisma.cart.create({
    data: {
      userId: users[2].id,
    },
  })

  // Add items to the cart
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: products[0].id,
      quantity: 1,
    },
  })

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: products[3].id,
      quantity: 2,
    },
  })

  // Create an order for the customer
  const order = await prisma.order.create({
    data: {
      userId: users[2].id,
      total: 1299.97,
      status: "DELIVERED",
      paymentMethod: "CREDIT_CARD",
      paymentStatus: "PAID",
      shippingAddress: "123 Main St, New York, NY 10001, USA",
    },
  })

  // Add items to the order
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: products[1].id,
      quantity: 1,
      price: 1499.99,
    },
  })

  // Create reviews
  await prisma.review.create({
    data: {
      userId: users[2].id,
      productId: products[1].id,
      rating: 5,
      comment: "Excellent laptop! Fast performance and great battery life.",
    },
  })

  await prisma.review.create({
    data: {
      userId: users[2].id,
      productId: products[0].id,
      rating: 4,
      comment: "Great phone, but the battery could be better.",
    },
  })

  // Add favorites
  await prisma.favorite.create({
    data: {
      userId: users[2].id,
      productId: products[0].id,
    },
  })

  await prisma.favorite.create({
    data: {
      userId: users[2].id,
      productId: products[3].id,
    },
  })

  console.log("Database has been seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

