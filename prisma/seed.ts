import { PrismaClient, Role, OrderStatus, PaymentMethod } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clean up existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  console.log("Creating categories...");
  const categories = [
    {
      name: "Smartphones",
      slug: "smartphones",
      description: "Latest smartphones and mobile devices",
    },
    {
      name: "Laptops",
      slug: "laptops",
      description: "High-performance laptops for work and gaming",
    },
    {
      name: "Wearables",
      slug: "wearables",
      description: "Smartwatches and fitness trackers",
    },
    {
      name: "Audio",
      slug: "audio",
      description: "Headphones, earbuds, and speakers",
    },
    {
      name: "Gaming",
      slug: "gaming",
      description: "Gaming consoles and accessories",
    },
    {
      name: "Cameras",
      slug: "cameras",
      description: "Digital cameras and photography equipment",
    },
    {
      name: "TVs",
      slug: "tvs",
      description: "Smart TVs and home entertainment",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Cables, chargers, and other accessories",
    },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: faker.image.urlLoremFlickr({
            category: category.slug,
            width: 640,
            height: 480,
          }),
        },
      })
    )
  );

  // Create users
  console.log("Creating users...");
  const passwordHash = await hash("password123", 10);

  const adminUser = await prisma.user.create({
    data: {
      id: "admin_user_id",
      email: "admin@example.com",
      name: "Admin User",
      role: Role.SUPER_ADMIN,
      passwordHash,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      id: "manager_user_id",
      email: "manager@example.com",
      name: "Product Manager",
      role: Role.PRODUCT_MANAGER,
      passwordHash,
    },
  });

  const regularUsers = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      return prisma.user.create({
        data: {
          id: `user_${i}`,
          email: faker.internet.email({ firstName, lastName }),
          name: `${firstName} ${lastName}`,
          role: Role.USER,
          passwordHash,
        },
      });
    })
  );

  const allUsers = [adminUser, managerUser, ...regularUsers];

  // Create addresses for users
  console.log("Creating addresses...");
  const addresses = await Promise.all(
    allUsers.flatMap((user) =>
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map((_, i) =>
        prisma.address.create({
          data: {
            userId: user.id,
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
            isDefault: i === 0, // First address is default
          },
        })
      )
    )
  );

  // Create products
  console.log("Creating products...");
  const products = await Promise.all(
    createdCategories.flatMap((category) =>
      Array.from({ length: faker.number.int({ min: 5, max: 15 }) }).map(() => {
        const name = faker.commerce.productName();
        const originalPrice = Number.parseFloat(
          faker.commerce.price({ min: 10, max: 2000 })
        );
        const stock = faker.number.int({ min: 0, max: 100 });
        const hasDiscount = faker.datatype.boolean({ probability: 0.5 });
        const discount = hasDiscount
          ? faker.number.int({ min: 5, max: 50 })
          : 0;
        const price = hasDiscount
          ? originalPrice - (originalPrice * discount) / 100
          : originalPrice;
        const featured = faker.datatype.boolean({ probability: 0.2 });

        return prisma.product.create({
          data: {
            name,
            slug: faker.helpers.slugify(name).toLowerCase(),
            description: faker.commerce.productDescription(),
            originalPrice,
            price,
            discount,

            stock,
            categoryId: category.id,
            featured,
            images: Array.from({
              length: faker.number.int({ min: 1, max: 5 }),
            }).map(() =>
              faker.image.urlLoremFlickr({
                category: category.slug,
                width: 800,
                height: 600,
              })
            ),
          },
        });
      })
    )
  );

  // Create reviews for products
  console.log("Creating reviews...");

  const reviewsSet = new Set<string>(); // Set para rastrear userId-productId únicos

  await Promise.all(
    products.flatMap((product) => {
      const availableUsers = [...regularUsers]; // Copia de los usuarios disponibles

      return Array.from({ length: faker.number.int({ min: 0, max: 10 }) }).map(
        async () => {
          if (availableUsers.length === 0) return; // Si no hay más usuarios disponibles, salir

          const userIndex = faker.number.int({
            min: 0,
            max: availableUsers.length - 1,
          });
          const user = availableUsers.splice(userIndex, 1)[0]; // Sacamos un usuario sin repetir

          const reviewKey = `${user.id}-${product.id}`; // Clave única para verificar duplicados

          if (reviewsSet.has(reviewKey)) return; // Si ya existe, salir

          reviewsSet.add(reviewKey); // Agregar la combinación al set

          return prisma.review.create({
            data: {
              userId: user.id,
              productId: product.id,
              rating: faker.number.int({ min: 1, max: 5 }),
              comment: faker.lorem.paragraph(),
            },
          });
        }
      );
    })
  );

  // Create favorites
  console.log("Creating favorites...");
  await Promise.all(
    regularUsers.flatMap((user) =>
      faker.helpers.arrayElements(products, { min: 0, max: 8 }).map((product) =>
        prisma.favorite.create({
          data: {
            userId: user.id,
            productId: product.id,
          },
        })
      )
    )
  );

  // Create carts for users
  console.log("Creating carts...");
  const carts = await Promise.all(
    regularUsers.map((user) =>
      prisma.cart.create({
        data: {
          userId: user.id,
        },
      })
    )
  );

  // Add items to carts
  console.log("Adding items to carts...");
  await Promise.all(
    carts.flatMap((cart) =>
      faker.helpers.arrayElements(products, { min: 0, max: 5 }).map((product) =>
        prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 5 }),
          },
        })
      )
    )
  );

  // Create orders
  console.log("Creating orders...");
  await Promise.all(
    regularUsers.flatMap((user) =>
      Array.from({ length: faker.number.int({ min: 0, max: 5 }) }).map(
        async () => {
          const orderItems = faker.helpers
            .arrayElements(products, { min: 1, max: 5 })
            .map((product) => ({
              productId: product.id,
              quantity: faker.number.int({ min: 1, max: 3 }),
              price: product.price,
            }));

          const total = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const userAddress = faker.helpers.arrayElement(
            addresses.filter((address) => address.userId === user.id)
          );

          return prisma.order.create({
            data: {
              userId: user.id,
              total,
              status: faker.helpers.enumValue(OrderStatus),
              paymentMethod: faker.helpers.enumValue(PaymentMethod),
              shippingAddress: `${userAddress.street}, ${userAddress.city}, ${userAddress.state} ${userAddress.postalCode}, ${userAddress.country}`,
              orderItems: {
                create: orderItems,
              },
            },
          });
        }
      )
    )
  );

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
