"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {}

export const Pagination: React.FC<PaginationProps> = ({}) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" disabled>
          <span className="sr-only">Previous page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8" disabled>
          1
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8">
          2
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8">
          3
        </Button>
        <Button variant="outline" size="icon">
          <span className="sr-only">Next page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
