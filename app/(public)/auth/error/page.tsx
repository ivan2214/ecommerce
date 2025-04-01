import { ErrorCard } from "@/app/(routes)/auth/components/error-card";

type SearchParams = Promise<{ error?: string }>;

const AuthErrorPage = async ({
	searchParams,
}: {
	searchParams: SearchParams;
}) => {
	const params = await searchParams;
	return <ErrorCard error={params.error} />;
};

export default AuthErrorPage;
