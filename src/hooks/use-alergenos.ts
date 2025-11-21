import { useState, useEffect, useCallback, useRef } from "react";

import { API_BASE_URL } from "@/lib/api-config";

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

// Caché global para alérgenos
const alergenosCache = new Map<string, { data: Alergeno[]; timestamp: number }>()
const CACHE_DURATION = 3 * 60 * 1000 // 3 minutos

// Control de requests en curso para evitar duplicados
const pendingAlergenosRequests = new Map<string, Promise<Alergeno[]>>()

// Función compartida para prefetch que guarda en caché
export async function prefetchAlergenos(id: string): Promise<void> {
  // Si ya está en caché, no hacer nada
  const cached = alergenosCache.get(id)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return
  }

  // Si ya hay un request en curso, esperar a que termine
  const pendingRequest = pendingAlergenosRequests.get(id)
  if (pendingRequest) {
    await pendingRequest.catch(() => {})
    return
  }

  // Crear nuevo request y guardarlo
  const requestPromise = fetch(`${API_BASE_URL}/api/v1/productos/${id}/alergenos`)
    .then(async (response) => {
      const result = (await response.json()) as ApiResponse
      if (result.success && result.data && result.data.length > 0) {
        const parsed = result.data.map((item) => ({
          nombre: item.nombre,
          icono: item.icono || defaultIcons[item.nombre] || "⚠️",
        }))
        alergenosCache.set(id, { data: parsed, timestamp: Date.now() })
        return parsed
      } else {
        const emptyArray: Alergeno[] = []
        alergenosCache.set(id, { data: emptyArray, timestamp: Date.now() })
        return emptyArray
      }
    })
    .finally(() => {
      pendingAlergenosRequests.delete(id)
    })

  pendingAlergenosRequests.set(id, requestPromise)
  await requestPromise.catch(() => {})
}

export function useAlergenos(id: string) {
  const [alergenos, setAlergenos] = useState<Alergeno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAlergenos = useCallback(async () => {
    console.log('🧬 useAlergenos - Iniciando fetch para ID:', id);

    // Verificar caché primero
    const cached = alergenosCache.get(id)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('🧬 useAlergenos - Usando caché para ID:', id, 'Datos:', cached.data);
      setAlergenos(cached.data)
      setLoading(false)
      return
    }

    // Si ya hay un request en curso para este ID, esperar a que termine
    const pendingRequest = pendingAlergenosRequests.get(id)
    if (pendingRequest) {
      console.log('🧬 useAlergenos - Request pendiente encontrado para ID:', id);
      try {
        const data = await pendingRequest
        console.log('🧬 useAlergenos - Request pendiente completado para ID:', id, 'Datos:', data);
        setAlergenos(data)
        setLoading(false)
        return
      } catch (err) {
        // Si falla el request pendiente, continuar con uno nuevo
        console.log('🧬 useAlergenos - Request pendiente falló para ID:', id, 'Error:', err);
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Si ya hay un request pendiente (del prefetch), reutilizarlo
      const existingPending = pendingAlergenosRequests.get(id)
      if (existingPending) {
        console.log('🧬 useAlergenos - Encontrado request pendiente del prefetch para ID:', id);
        try {
          const data = await existingPending
          console.log('🧬 useAlergenos - Prefetch completado para ID:', id, 'Datos:', data);
          setAlergenos(data)
          setLoading(false)
          return
        } catch (err) {
          // Si falla, continuar con uno nuevo
          console.log('🧬 useAlergenos - Prefetch falló para ID:', id);
        }
      }

      // Cancelar request anterior del hook si existe (solo si es diferente)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const url = `${API_BASE_URL}/api/v1/productos/${id}/alergenos`;
      console.log('🧬 useAlergenos - Haciendo fetch a:', url);

      // Crear el request y guardarlo en el mapa de pendientes
      const requestPromise = fetch(url, {
        signal: abortControllerRef.current.signal
      }).then(async (response) => {
        console.log('🧬 useAlergenos - Response status para ID:', id, 'Status:', response.status);
        const text = await response.text();
        console.log('🧬 useAlergenos - Response text para ID:', id, 'Text:', text.substring(0, 200));

        let result: ApiResponse;
        try {
          result = JSON.parse(text) as ApiResponse;
        } catch (parseErr) {
          console.error('🧬 useAlergenos - Error parsing JSON para ID:', id, 'Error:', parseErr);
          throw new Error(`JSON parse error: ${  parseErr}`);
        }

        console.log('🧬 useAlergenos - Result para ID:', id, 'Result:', result);

        if (result.success && result.data && result.data.length > 0) {
          // Mapear la respuesta de la API a la estructura esperada
          const parsed = result.data.map((item) => ({
            nombre: item.nombre,
            // Usar el icono de la API si existe, sino buscar en el mapeo por defecto, sino usar un icono genérico
            icono: item.icono || defaultIcons[item.nombre] || "⚠️",
          }));
          console.log('🧬 useAlergenos - Alérgenos parseados para ID:', id, 'Count:', parsed.length, 'Data:', parsed);
          // Guardar en caché
          alergenosCache.set(id, { data: parsed, timestamp: Date.now() })
          return parsed
        } else {
          // Si no hay alérgenos, devolver array vacío y guardar en caché
          console.log('🧬 useAlergenos - Sin alérgenos para ID:', id, 'Success:', result.success, 'Data length:', result.data?.length);
          const emptyArray: Alergeno[] = []
          alergenosCache.set(id, { data: emptyArray, timestamp: Date.now() })
          return emptyArray
        }
      })

      // Guardar el request pendiente
      pendingAlergenosRequests.set(id, requestPromise)

      const alergenosData = await requestPromise
      console.log('🧬 useAlergenos - Final data set para ID:', id, 'Data:', alergenosData);
      setAlergenos(alergenosData)
      setLoading(false)

      // Limpiar el request pendiente
      pendingAlergenosRequests.delete(id)
    } catch (err) {
      // Limpiar el request pendiente en caso de error
      pendingAlergenosRequests.delete(id)

      // No mostrar error si fue cancelado
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🧬 useAlergenos - Request cancelado para ID:', id);
        return
      }

      console.error('🧬 useAlergenos - ERROR para ID:', id, 'Error:', err);
      setAlergenos([]);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && hasFetched.current !== id) {
      hasFetched.current = id;
      void fetchAlergenos();
    } else if (!id) {
      setAlergenos([]);
      setLoading(false);
    }

    // Cleanup: cancelar request si el componente se desmonta o cambia el ID
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [id, fetchAlergenos]);

  return {
    alergenos,
    loading,
    error,
    refetch: () => void fetchAlergenos(),
  };
}