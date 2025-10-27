import { useState, useEffect, useCallback } from "react";

const defaultAlergenos = [
  { nombre: "Nueces", icono: "🥜" },
  { nombre: "Sésamo", icono: "🌰" },
  { nombre: "Crustáceo", icono: "🦐" },
  { nombre: "Huevo", icono: "🥚" },
  { nombre: "Gluten", icono: "🌾" },
  { nombre: "Pescado", icono: "🐟" },
  { nombre: "Cítricos", icono: "🍋" },
];

interface Alergeno {
  nombre: string;
  icono: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    items?: Array<{ nombre: string; icono: string }>;
    total?: number;
  };
  error?: string;
}

export function useAlergenos(id: string) {
  const [alergenos, setAlergenos] = useState<Alergeno[]>(defaultAlergenos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlergenos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/alergenos/${id}`);
      const result = (await response.json()) as ApiResponse;

      if (result.success && result.data?.items && result.data.items.length > 0) {
        const parsed = result.data.items.map((item) => ({
          nombre: item.nombre,
          icono: item.icono,
        }));
        setAlergenos(parsed);
      } else {
        setAlergenos(defaultAlergenos);
        if (result.error) setError(result.error);
      }
    } catch (err) {
      setAlergenos(defaultAlergenos);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      void fetchAlergenos();
    }
  }, [id, fetchAlergenos]);

  return {
    alergenos,
    loading,
    error,
    refetch: () => void fetchAlergenos(),
  };
}