"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

import { API_BASE_URL } from "@/lib/api-config"
import { Pedido, HistorialResponse } from "@/types/orders"

// Re-export los tipos para compatibilidad
export type {
  Pedido,
  PedidoProducto,
  HistorialResponse,
  OrderHistoryItem,
  PaymentGroup,
  CartItem,
  SendOrderParams,
  SendOrderParamsLegacy,
  ValidationError
} from "@/types/orders"

interface OrderHistoryContextType {
  historial: Pedido[]
  isLoading: boolean
  error: string | null
  fetchHistorial: (tokenSesion: string, isPolling?: boolean) => Promise<void>
  clearError: () => void
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined)

export function OrderHistoryProvider({ children }: { children: ReactNode }) {
  const [historial, setHistorial] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistorial = useCallback(async (tokenSesion: string, isPolling = false) => {
    if (!tokenSesion) {
      setError("Token de sesión no disponible")
      return
    }

    // Solo mostrar loading si no es polling (fetch manual desde sidebar)
    if (!isPolling) {
      setIsLoading(true)
      setError(null)
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/pedidos/historial/${tokenSesion}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json() as unknown

      if (!res.ok) {
        const errorMsg = (data as Record<string, unknown>)?.error || `HTTP ${res.status}`
        throw new Error(String(errorMsg))
      }

      const historialData = data as HistorialResponse
      setHistorial(historialData.pedidos || [])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido"
      // Solo actualizar error si no es polling (para no mostrar errores de polling al usuario)
      if (!isPolling) {
        setError(errorMsg)
        console.error("❌ Error al obtener historial:", errorMsg)
      } else {
        console.error("⚠️ Error en polling del historial:", errorMsg)
      }
    } finally {
      // Solo limpiar loading si no es polling
      if (!isPolling) {
        setIsLoading(false)
      }
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <OrderHistoryContext.Provider
      value={{
        historial,
        isLoading,
        error,
        fetchHistorial,
        clearError,
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  )
}

export function useOrderHistory() {
  const context = useContext(OrderHistoryContext)
  if (context === undefined) {
    throw new Error("useOrderHistory debe usarse dentro de OrderHistoryProvider")
  }
  return context
}
