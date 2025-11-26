"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Página de redirect para /login
 * Extrae el ID de mesa de los query parameters y redirige a /login/[id_mesa]
 */
export default function LoginRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Soporta ?mesa=ID o un parámetro "key-only" tipo ?01K8...
    const mesaId =
      searchParams.get("mesa") ?? Array.from(searchParams.keys())[0] ?? "sin-mesa";

    // Redirigir a la ruta dinámica con el ID de mesa
    router.push(`/login/${mesaId}`);
  }, [router, searchParams]);

  // Mostrar un loading mientras redirige
  return (
    <div className="min-h-screen bg-[#5B9BB8] flex items-center justify-center">
      <div className="text-white text-lg">Cargando...</div>
    </div>
  );
}
