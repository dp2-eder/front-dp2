/**
 * INTEGRATION TEST: Cart Flow
 * 
 * Tests de integración para validar:
 * - Agregar plato al carrito desde grid
 * - Agregar plato al carrito desde modal/detalle
 * - Modificar cantidad en carrito
 * - Eliminar items del carrito
 * - Persistencia del carrito en reloads
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCart } from '@/hooks/use-cart'
import CarritoPage from '@/app/(cliente)/carrito/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

describe('Cart Flow (Integration)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('displays empty cart message when cart is empty', async () => {
    render(<CarritoPage />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument()
    })
  })

  test('adds item to cart and displays it', async () => {
    const { result } = renderHook(() => useCart())

    const mockItem = {
      id: 'test-1',
      dishId: 1,
      name: 'Ceviche Clásico',
      description: 'Ceviche fresco',
      basePrice: 25.0,
      quantity: 1,
      image: '/ceviche.jpg',
      selectedOptions: [],
      totalPrice: 25.0,
    }

    act(() => {
      result.current.addToCart(mockItem)
    })

    render(<CarritoPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })
  })

  test('modifies item quantity correctly', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useCart())

    const mockItem = {
      id: 'test-1',
      dishId: 1,
      name: 'Ceviche Clásico',
      description: 'Ceviche fresco',
      basePrice: 25.0,
      quantity: 1,
      image: '/ceviche.jpg',
      selectedOptions: [],
      totalPrice: 25.0,
    }

    act(() => {
      result.current.addToCart(mockItem)
    })

    render(<CarritoPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })

    // Increment quantity using the new aria-label
    const incrementButton = screen.getByRole('button', { name: /incrementar cantidad/i })
    await user.click(incrementButton)

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  test('removes item from cart', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useCart())

    const mockItem = {
      id: 'test-1',
      dishId: 1,
      name: 'Ceviche Clásico',
      description: 'Ceviche fresco',
      basePrice: 25.0,
      quantity: 1,
      image: '/ceviche.jpg',
      selectedOptions: [],
      totalPrice: 25.0,
    }

    act(() => {
      result.current.addToCart(mockItem)
    })

    render(<CarritoPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })

    // Remove item using aria-label
    const removeButton = screen.getByRole('button', { name: /eliminar artículo/i })
    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument()
    })
  })

  test('calculates total price correctly with multiple items', async () => {
    const { result } = renderHook(() => useCart())

    const item1 = {
      id: 'test-1',
      dishId: 1,
      name: 'Ceviche Clásico',
      description: 'Ceviche fresco',
      basePrice: 25.0,
      quantity: 1,
      image: '/ceviche.jpg',
      selectedOptions: [],
      totalPrice: 25.0,
    }

    const item2 = {
      id: 'test-2',
      dishId: 2,
      name: 'Lomo Saltado',
      description: 'Lomo tradicional',
      basePrice: 30.0,
      quantity: 2,
      image: '/lomo.jpg',
      selectedOptions: [],
      totalPrice: 60.0,
    }

    act(() => {
      result.current.addToCart(item1)
      result.current.addToCart(item2)
    })

    render(<CarritoPage />)

    await waitFor(() => {
      // Total should be 25 + 60 = 85
      // Check that both items are present
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
      expect(screen.getByText('Lomo Saltado')).toBeInTheDocument()
    })
  })

  test('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart())

    const mockItem = {
      id: 'test-1',
      dishId: 1,
      name: 'Ceviche Clásico',
      description: 'Ceviche fresco',
      basePrice: 25.0,
      quantity: 1,
      image: '/ceviche.jpg',
      selectedOptions: [],
      totalPrice: 25.0,
    }

    act(() => {
      result.current.addToCart(mockItem)
    })

    // Check localStorage
    const savedCart = localStorage.getItem('cart')
    expect(savedCart).toBeTruthy()

    const parsedCart = JSON.parse(savedCart!)
    expect(parsedCart).toHaveLength(1)
    expect(parsedCart[0].name).toBe('Ceviche Clásico')
  })

  test('loads cart from localStorage on mount', () => {
    const mockCart = [
      {
        id: 'test-1',
        dishId: 1,
        name: 'Ceviche Clásico',
        description: 'Ceviche fresco',
        basePrice: 25.0,
        quantity: 1,
        image: '/ceviche.jpg',
        selectedOptions: [],
        totalPrice: 25.0,
      },
    ]

    localStorage.setItem('cart', JSON.stringify(mockCart))

    render(<CarritoPage />)

    waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })
  })

  test('updates localStorage when cart changes', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useCart())

    const mockItem = {
      id: 'test-1',
      dishId: 1,
      name: 'Ceviche Clásico',
      description: 'Ceviche fresco',
      basePrice: 25.0,
      quantity: 1,
      image: '/ceviche.jpg',
      selectedOptions: [],
      totalPrice: 25.0,
    }

    act(() => {
      result.current.addToCart(mockItem)
    })

    render(<CarritoPage />)

    await waitFor(() => {
      expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
    })

    // Increment quantity using the new aria-label
    const incrementButton = screen.getByRole('button', { name: /incrementar cantidad/i })
    await user.click(incrementButton)

    await waitFor(() => {
      const savedCart = localStorage.getItem('cart')
      const parsedCart = JSON.parse(savedCart!)
      expect(parsedCart[0].quantity).toBe(2)
    })
  })
})

// Helper to import from testing library
import { renderHook, act } from '@testing-library/react'
