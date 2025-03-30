"use client";

import { Brand } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface SidebarFiltersProps {
  brands: { name: string; id: string; _count: { products: number } }[];
  categories: { name: string; id: string; _count: { products: number } }[];
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  brands,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClearFilters = () => {
    // TODO: clear filters
  };

  const handleCategoryFilter = (categoryName: string, isChecked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    let categories = params.get("category")?.split(",") || [];

    if (isChecked) {
      categories.push(categoryName);
    } else {
      categories = categories.filter((c) => c !== categoryName);
    }

    if (categories.length > 0) {
      params.set("category", categories.join(","));
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePriceFilter = (minPrice: string, maxPrice: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          <div className="relative">
            <Input placeholder="Search products..." className="w-full" />
          </div>
        </div>
      </div>
      <Separator />
      <Accordion
        type="multiple"
        defaultValue={["categories", "price", "brands"]}
      >
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={
                      searchParams
                        .get("category")
                        ?.split(",")
                        .includes(category.name) || false
                    }
                    onCheckedChange={(isChecked) =>
                      handleCategoryFilter(category.name, !!isChecked)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex-1 text-sm font-normal cursor-pointer"
                  >
                    {category.name} ({category._count.products})
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-price">Min</Label>
                  <Input id="min-price" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-price">Max</Label>
                  <Input id="max-price" type="number" placeholder="1000" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const min = (
                    document.getElementById("min-price") as HTMLInputElement
                  ).value;
                  const max = (
                    document.getElementById("max-price") as HTMLInputElement
                  ).value;
                  handlePriceFilter(min, max);
                }}
              >
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox id={`brand-${brand.id}`} />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="flex-1 text-sm font-normal cursor-pointer"
                  >
                    {brand.name} ({brand._count.products})
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="flex-1 text-sm font-normal cursor-pointer flex items-center"
                  >
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted-foreground" />
                    ))}
                    <span className="ml-1">& Up</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="in-stock" />
                <Label
                  htmlFor="in-stock"
                  className="text-sm font-normal cursor-pointer"
                >
                  In Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="on-sale" />
                <Label
                  htmlFor="on-sale"
                  className="text-sm font-normal cursor-pointer"
                >
                  On Sale
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator />
      <Button variant="outline" className="w-full">
        Reset Filters
      </Button>
    </div>
  );
};
