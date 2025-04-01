import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <Search className="h-24 w-24 text-primary" />
        </div>
        <h1 className="mt-6 font-extrabold text-4xl text-gray-900 sm:text-5xl">
          ¡Ups! Página no encontrada
        </h1>
        <p className="mt-2 text-gray-600 text-lg">
          Lo sentimos, no pudimos encontrar la página que estás buscando. Pero
          no te preocupes, ¡hay muchas oportunidades laborales esperándote!
        </p>
        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Volver al inicio</Link>
          </Button>
          <div>
            <Button variant="outline" className="w-full" asChild>
              <Link
                href="/ofertas"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Explorar ofertas de empleo en Lules
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
