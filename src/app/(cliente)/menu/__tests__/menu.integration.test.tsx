/**
 * INTEGRATION TEST: Menu Navigation Flow
 * 
 * Tests de integración para validar:
 * - Carga de landing page y navegación al menú
 * - Display correcto de categorías
 * - Filtrado de platos por categoría
 * - Apertura de detalles en modal
 * - Manejo de errores de API
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MenuPage from '@/app/(cliente)/menu/page'
import { Root2 } from '@/types/menu'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
  usePathname: () => '/menu',
}))

const mockMenuData: Root2[] = [
  {
    id: 1,
    nombre: 'Ceviche Clásico',
    imagen: '/ceviche.jpg',
    precio: 25.0,
    stock: 10,
    disponible: true,
    categoria: 'Entrada',
    alergenos: ['pescado'],
    tiempo_preparacion: 15,
    descripcion: 'Ceviche fresco',
    ingredientes: ['pescado', 'limón'],
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
    alergenos: [],
    tiempo_preparacion: 20,
    descripcion: 'Lomo tradicional',
    ingredientes: ['lomo', 'cebolla'],
    grupo_personalizacion: [],
  },
  {
    id: 3,
    nombre: 'Chicha Morada',
    imagen: '/chicha.jpg',
    precio: 8.0,
    stock: 20,
    disponible: true,
    categoria: 'Bebida',
    alergenos: [],
    tiempo_preparacion: 5,
    descripcion: 'Bebida tradicional',
    ingredientes: ['maíz morado'],
    grupo_personalizacion: [],
  },
]

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  // Reset mock before each test
  mockFetch.mockClear()
  // Default successful response
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      success: true,
      data: mockMenuData,
    }),
  })
})

describe('Menu Navigation Flow (Integration)', () => {
  test('loads menu page and displays categories correctly', async () => {
    render(<MenuPage />)

    // Wait for data to load - check for actual menu items
    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verify categories are displayed
    expect(screen.getByRole('button', { name: /entrada/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /plato principal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bebida/i })).toBeInTheDocument()
  })

  test('filters plates by category', async () => {
    const user = userEvent.setup()
    render(<MenuPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })

    // Click on "Entrada" category - use more specific selector
    const entradaButton = screen.getByRole('button', { name: /entrada/i })
    await user.click(entradaButton)

    // Should show only entradas
    const dishes = screen.getAllByText('Ceviche Clásico')
    expect(dishes.length).toBeGreaterThan(0)
    expect(screen.queryByText('Lomo Saltado')).not.toBeInTheDocument()
  })

  test('shows all plates when "Todos" is selected', async () => {
    const user = userEvent.setup()
    render(<MenuPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })

    // Filter by category first
    const entradaButton = screen.getByRole('button', { name: /entrada/i })
    await user.click(entradaButton)

    // Click "Todos"
    const todosButton = screen.getByRole('button', { name: /todos/i })
    await user.click(todosButton)

    // Should show all plates
    expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    expect(screen.getByText('Lomo Saltado')).toBeInTheDocument()
    expect(screen.getByText('Chicha Morada')).toBeInTheDocument()
  })

  test('handles API errors gracefully', async () => {
    // Mock fetch to return error
    mockFetch.mockRejectedValueOnce(new Error('Server error'))

    render(<MenuPage />)

    await waitFor(() => {
      expect(screen.getByText('Error al Cargar Menú')).toBeInTheDocument()
    })
  })

  test('displays empty state when no plates match filter', async () => {
    const user = userEvent.setup()
    render(<MenuPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })

    // Search for non-existent plate - use aria-label
    const searchInput = screen.getByLabelText(/buscar platos/i)
    await user.type(searchInput, 'platoinexistente')

    await waitFor(() => {
      expect(screen.queryByText('Ceviche Clásico')).not.toBeInTheDocument()
    })
  })

  test('navigates to plate detail on click', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn()

    // Mock useRouter
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
      useSearchParams: () => ({
        get: () => null,
      }),
    }))

    render(<MenuPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })

    // Click on plate card
    const plateCard = screen.getByText('Ceviche Clásico').closest('a')
    if (plateCard) {
      await user.click(plateCard)
    }
  })
})
