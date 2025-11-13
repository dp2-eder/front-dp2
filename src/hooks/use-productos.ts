import { useState, useEffect } from "react"

import { ProductosResponse } from "@/types/productos"

// Cache global compartido entre montajes
let cachedProductos: ProductosResponse["items"] | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// 🔹 Helper: convierte URL de Google Drive en enlace directo
const convertGoogleDriveUrl = (url: string | null | undefined): string => {
  if (!url || url === "null" || url === "undefined") return "/placeholder-image.png"
  if (!url.includes("drive.google.com")) return url
  const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url
}

export function useProductos() {
  const [productos, setProductos] = useState<ProductosResponse["items"]>(cachedProductos || [])
  const [loading, setLoading] = useState(
    !cachedProductos || !cacheTimestamp || Date.now() - cacheTimestamp > CACHE_DURATION
  )
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState<boolean>(!!cachedProductos)

  const fetchProductos = async (force = false) => {
    try {
      const isCacheValid =
        cachedProductos && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION

      // 🔹 Si hay cache válido y no es forzado, úsalo directamente
      if (!force && isCacheValid) {
        setProductos(cachedProductos ?? [])
        setFromCache(true)
        setLoading(false)
        return
      }

      // 🔹 Si hay cache pero está vencido, mostrar los datos viejos mientras refresca
      if (!force && cachedProductos && !isCacheValid) {
        setProductos(cachedProductos ?? [])
        setFromCache(true)
        setLoading(true)
      } else if (force) {
        setFromCache(false)
        setLoading(true)
      }

      const response = await fetch("/api/productos", { next: { revalidate: 300 } })
      const result = (await response.json()) as {
        success: boolean
        data: ProductosResponse
        error?: string
      }

      if (!result.success) throw new Error(result.error || "Error al cargar los productos")

      const productosConImagenes = result.data.items.map((producto) => {
        const productoImagenUrl = convertGoogleDriveUrl(producto.imagen_path)
        const categoriaImagenUrl = convertGoogleDriveUrl(producto.categoria.imagen_path)

        const shouldUseProxyProducto =
          productoImagenUrl.startsWith("http://") ||
          productoImagenUrl.startsWith("https://") ||
          productoImagenUrl.includes("drive.google.com")

        const shouldUseProxyCategoria =
          categoriaImagenUrl.startsWith("http://") ||
          categoriaImagenUrl.startsWith("https://") ||
          categoriaImagenUrl.includes("drive.google.com")

        return {
          ...producto,
          imagen_path: shouldUseProxyProducto
            ? `/api/image-proxy?url=${encodeURIComponent(productoImagenUrl)}`
            : productoImagenUrl,
          categoria: {
            ...producto.categoria,
            imagen_path: shouldUseProxyCategoria
              ? `/api/image-proxy?url=${encodeURIComponent(categoriaImagenUrl)}`
              : categoriaImagenUrl,
          },
        }
      })

      // 🔹 Actualiza el cache global
      cachedProductos = productosConImagenes
      cacheTimestamp = Date.now()

      setProductos(productosConImagenes)
      setFromCache(false)
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Cargar al montar SOLO si no hay cache válido
  useEffect(() => {
    const isCacheValid =
      cachedProductos && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION
    
    // Si hay cache válido, solo actualizar el estado sin hacer fetch
    if (isCacheValid) {
      setProductos(cachedProductos ?? [])
      setFromCache(true)
      setLoading(false)
      return
    }
    
    // Solo hacer fetch si no hay cache o está vencido
    void fetchProductos()
  }, [])

  // 🔹 Auto refrescar en segundo plano cada 5 min sin borrar el estado
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchProductos(true)
    }, CACHE_DURATION)
    return () => clearInterval(interval)
  }, [])

  return {
    productos,
    loading,
    fromCache,
    error,
    refetch: () => void fetchProductos(true),
  }
}