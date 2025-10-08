/**
 * UNIT TEST: useMenu Hook
 * US-FE-009: Grid de Platos
 * 
 * Tests para validar:
 * - Fetch de datos del menú
 * - Estados de loading y error
 * - Funcionalidad de refetch
 * - Manejo de respuestas de API
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useMenu } from '@/hooks/use-menu'
import { Root2 } from '@/types/menu'

// Mock fetch
global.fetch = jest.fn()

const mockMenuData: Root2[] = [
  {
    id: 1,
    nombre: 'Ceviche Clásico',
    imagen: '/ceviche.jpg',
    precio: 25.0,
    stock: 10,
    disponible: true,
    categoria: 'Entrada',
    alergenos: ['pescado', 'mariscos'],
    tiempo_preparacion: 15,
    descripcion: 'Ceviche fresco con pescado del día',
    ingredientes: ['pescado', 'limón', 'cebolla', 'ají'],
    grupo_personalizacion: [],
  },
  {
    id: 2,
    nombre: 'Lomo Saltado',
    imagen: '/lomo.jpg',
    precio: 30.0,
    stock: 5,
    disponible: true,
    categoria: 'Plato Principal',
    alergenos: ['gluten'],
    tiempo_preparacion: 20,
    descripcion: 'Lomo saltado tradicional',
    ingredientes: ['lomo', 'cebolla', 'tomate', 'papas fritas'],
    grupo_personalizacion: [],
  },
]

describe('useMenu Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockReset()
  })

  test('should initialize with loading state', () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    const { result } = renderHook(() => useMenu())

    expect(result.current.loading).toBe(true)
    expect(result.current.menuItems).toEqual([])
    expect(result.current.error).toBeNull()
  })

  test('should fetch menu items successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMenuData,
      }),
    })

    const { result } = renderHook(() => useMenu())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.menuItems).toEqual(mockMenuData)
    expect(result.current.error).toBeNull()
  })

  test('should handle API error correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Server error',
      }),
    })

    const { result } = renderHook(() => useMenu())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.menuItems).toEqual([])
    expect(result.current.error).toBe('Server error')
  })

  test('should handle network error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useMenu())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network error')
  })

  test('should refetch data when refetch is called', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMenuData,
      }),
    })

    const { result } = renderHook(() => useMenu())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear mock and set up new response
    ;(global.fetch as jest.Mock).mockClear()
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [...mockMenuData, { ...mockMenuData[0], id: 3 }],
      }),
    })

    result.current.refetch()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  test('should call correct API endpoint', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMenuData,
      }),
    })

    renderHook(() => useMenu())

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/menu/items')
    })
  })

  test('should handle empty menu data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    })

    const { result } = renderHook(() => useMenu())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.menuItems).toEqual([])
    expect(result.current.error).toBeNull()
  })

  test('should handle malformed API response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        // Missing error message
      }),
    })

    const { result } = renderHook(() => useMenu())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
  })
})
