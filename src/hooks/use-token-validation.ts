import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api-config";

interface UseTokenValidationOptions {
  intervalMs?: number; // Intervalo de validación en milisegundos (default: 30 segundos)
  onUnauthorized?: () => void; // Callback opcional cuando el token es inválido
}

/**
 * Hook que valida periódicamente que el token_sesion sigue siendo válido
 * Si el token es rechazado (401), redirige al usuario a /login/[id_mesa]
 *
 * @param options - Configuración del hook
 * @returns void
 */
export function useTokenValidation(options: UseTokenValidationOptions = {}) {
  const {
    intervalMs = 30000, // 30 segundos por defecto
    onUnauthorized,
  } = options;

  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isValidatingRef = useRef(false);

  const validateToken = useCallback(async () => {
    // Evitar múltiples validaciones concurrentes
    if (isValidatingRef.current) {
      return;
    }

    isValidatingRef.current = true;

    try {
      const tokenCookie = getCookie("token_sesion");
      const token = typeof tokenCookie === "string" ? tokenCookie : null;
      const sesionMesaIdCookie = getCookie("id_sesion_mesa");
      const sesionMesaId = typeof sesionMesaIdCookie === "string" ? sesionMesaIdCookie : null;

      if (!token || !sesionMesaId) {
        // Si no hay token o id_sesion_mesa, redirigir a login
        const mesaIdCookie = getCookie("mesaId");
        const mesaId =
          typeof mesaIdCookie === "string"
            ? mesaIdCookie
            : localStorage.getItem("mesaId") || "sin-mesa";
        router.push(`/login/${mesaId}`);
        return;
      }

      // Validar que la sesión de mesa sigue activa
      const response = await fetch(
        `${API_BASE_URL}/api/v1/sesiones-mesas/${sesionMesaId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Sesión no encontrada o error al validar
        const mesaIdCookie = getCookie("mesaId");
        const mesaId =
          typeof mesaIdCookie === "string"
            ? mesaIdCookie
            : localStorage.getItem("mesaId") || "sin-mesa";
        toast.error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        router.push(`/login/${mesaId}`);

        if (onUnauthorized) {
          onUnauthorized();
        }
        return;
      }

      // Verificar que la sesión está activa
      const sesion = (await response.json()) as { estado?: string };
      if (sesion.estado !== "activa") {
        // Sesión no está activa
        const mesaIdCookie = getCookie("mesaId");
        const mesaId =
          typeof mesaIdCookie === "string"
            ? mesaIdCookie
            : localStorage.getItem("mesaId") || "sin-mesa";
        toast.error("Tu sesión ha sido finalizada. Por favor inicia sesión nuevamente.");
        router.push(`/login/${mesaId}`);

        if (onUnauthorized) {
          onUnauthorized();
        }
        return;
      }
    } catch (error) {
      // Errores de red no son críticos - el usuario podría estar sin conexión
      // eslint-disable-next-line no-console
      console.warn(
        "Error validating token:",
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      isValidatingRef.current = false;
    }
  }, [router, onUnauthorized]);

  useEffect(() => {
    // Validar inmediatamente al montar
    void validateToken();

    // Configurar validación periódica
    intervalRef.current = setInterval(() => {
      void validateToken();
    }, intervalMs);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [validateToken, intervalMs]);
}
