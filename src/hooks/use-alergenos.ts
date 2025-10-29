import { useState, useEffect, useCallback } from "react";

// Mapeo de iconos por defecto para cuando la API no devuelve icono
const defaultIcons: Record<string, string> = {
  "Nueces": "🥜",
  "Sésamo": "🌰",
  "Crustáceo": "🦐",
  "Mariscos": "🦐",
  "Huevo": "🥚",
  "Gluten": "🌾",
  "Pescado": "🐟",
  "Cítricos": "🍋",
  "Moluscos": "🐙",
  "Aj": "🧄",
};

interface AlergenoApi {
  nombre: string;
  descripcion?: string;
  icono: string | null;
  nivel_riesgo?: string;
  id?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

interface Alergeno {
  nombre: string;
  icono: string;
}

interface ApiResponse {
  success: boolean;
  data?: AlergenoApi[];
  error?: string;
}

export function useAlergenos(id: string) {
  const [alergenos, setAlergenos] = useState<Alergeno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlergenos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/productos/${id}/alergenos`);
      const result = (await response.json()) as ApiResponse;

      if (result.success && result.data && result.data.length > 0) {
        // Mapear la respuesta de la API a la estructura esperada
        const parsed = result.data.map((item) => ({
          nombre: item.nombre,
          // Usar el icono de la API si existe, sino buscar en el mapeo por defecto, sino usar un icono genérico
          icono: item.icono || defaultIcons[item.nombre] || "⚠️",
        }));
        setAlergenos(parsed);
      } else {
        // Si no hay alérgenos, devolver array vacío
        setAlergenos([]);
        if (result.error) setError(result.error);
      }
    } catch (err) {
      setAlergenos([]);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      void fetchAlergenos();
    } else {
      setAlergenos([]);
      setLoading(false);
    }
  }, [id, fetchAlergenos]);

  return {
    alergenos,
    loading,
    error,
    refetch: () => void fetchAlergenos(),
  };
}