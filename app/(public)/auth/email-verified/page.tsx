import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmailVerifiedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">
            Email Verified
          </CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now log in to
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Thank you for verifying your email address. Your account is now
            fully activated.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Login to your account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
