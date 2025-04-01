"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <Settings className="mx-auto h-24 w-24 animate-spin text-gray-400" />
          <h2 className="mt-6 font-extrabold text-3xl text-gray-900">
            Oops, algo salió mal
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Estamos experimentando dificultades técnicas. Nuestro equipo está
            trabajando para resolverlo lo antes posible.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button onClick={() => reset()} className="w-full">
            Intentar de nuevo
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
        <p className="mt-2 text-gray-500 text-xs">
          Si el problema persiste, por favor contáctanos en
          soporte@tusitioempleos.com
        </p>
      </div>
    </div>
  );
}
