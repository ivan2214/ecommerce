import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("container mx-auto p-6", className)}>{children}</div>
  );
};
