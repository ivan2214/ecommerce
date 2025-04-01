"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortItemsProps {}

export const SortItems: React.FC<SortItemsProps> = ({}) => {
  return (
    <div className="flex items-center space-x-2">
      <Select defaultValue="featured">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
