"use client";

import type { HTMLAttributes } from "react";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./social";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardWrapperProps {
	children: React.ReactNode;
	headderLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
	className?: HTMLAttributes<HTMLElement>["className"];
}

export const CardWrapper = ({
	children,
	headderLabel,
	backButtonLabel,
	backButtonHref,
	showSocial,
	className,
}: CardWrapperProps) => {
	return (
		<Card className={cn("mx-auto w-[400px] shadow-md", className)}>
			<CardHeader>
				<Header label={headderLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocial ? (
				<CardFooter>
					<Social />
				</CardFooter>
			) : null}
			<CardFooter>
				<BackButton href={backButtonHref} label={backButtonLabel} />
			</CardFooter>
		</Card>
	);
};
