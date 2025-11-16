"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { API_BASE_URL } from "@/lib/api-config"

interface AforoContextType {
  aforoTotal: number
  isLoading: boolean
  error: string | null
  fetchAforo: () => Promise<void>
  clearError: () => void
}

const AforoContext = createContext<AforoContextType | undefined>(undefined)

export function AforoProvider({ children }: { children: ReactNode }) {
  const [aforoTotal, setAforoTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAforo = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/mesas?skip=0&limit=100`)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json() as { items: Array<{ capacidad?: number }> }

      const total = data.items.reduce(
        (sum: number, mesa: { capacidad?: number }) => sum + (mesa.capacidad || 0),
        0
      )

      setAforoTotal(total)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMsg)
      console.error("❌ Error obteniendo aforo:", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <AforoContext.Provider
      value={{
        aforoTotal,
        isLoading,
        error,
        fetchAforo,
        clearError,
      }}
    >
      {children}
    </AforoContext.Provider>
  )
}

export function useAforo() {
  const context = useContext(AforoContext)
  if (context === undefined) {
    throw new Error("useAforo debe usarse dentro de AforoProvider")
  }
  return context
}
