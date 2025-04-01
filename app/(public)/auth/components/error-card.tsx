import { CardWrapper } from "@/app/(routes)/auth/components/card-wrapper";
import { Triangle } from "lucide-react";

export const ErrorCard = ({ error }: { error?: string }) => {
	return (
		<CardWrapper
			backButtonHref="/auth/login"
			backButtonLabel="Back to Login"
			headderLabel={error || "Oops! Something went wrong"}
		>
			<div className="flex w-full items-center justify-center">
				<Triangle className="text-destructive" />
			</div>
		</CardWrapper>
	);
};
