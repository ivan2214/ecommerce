import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export default async function CategoriesPage() {
  // Get all categories with product count
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <div className="group relative overflow-hidden rounded-lg border h-[200px]">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white z-20">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="text-sm mt-1">
                  {category._count.products} Products
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
