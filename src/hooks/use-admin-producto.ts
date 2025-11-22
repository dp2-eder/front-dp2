"use client";

import { useState, useEffect } from "react";

import { API_BASE_URL } from "@/lib/api-config";
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

        const url = `${API_BASE_URL}/api/v1/productos/${id}`;
        console.log('📦 useAdminProducto - Haciendo fetch a:', url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json() as unknown;
        console.log('📦 useAdminProducto - Producto cargado:', data);

        setProducto(data as Producto);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        console.error('📦 useAdminProducto - ERROR:', msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchProducto();
  }, [id]);

  return { producto, loading, error };
}
