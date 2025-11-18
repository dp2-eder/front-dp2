"use client";

import { useState, useEffect } from "react";
import { Producto } from "@/types/productos";

export function useAdminProducto(id: string) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID de producto no proporcionado");
      return;
    }

    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/productos/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || "Error al cargar producto");
        }

        setProducto(data.data as Producto);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  return { producto, loading, error };
}
