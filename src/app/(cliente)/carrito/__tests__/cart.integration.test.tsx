/**
 * INTEGRATION TEST: Cart Flow
 * 
 * Tests de integración para validar:
 * - Agregar plato al carrito desde grid
 * - Agregar plato al carrito desde modal/detalle
 * - Modificar cantidad en carrito
 * - Eliminar items del carrito
 * - Persistencia del carrito en reloads


import { render, screen, waitFor, renderHook, act } from '@testing-library/react'

import CarritoPage from '@/app/(cliente)/carrito/page'
import { useCart } from '@/hooks/use-cart'


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
  default: (props: Record<string, unknown>) => {
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

    const savedCart = localStorage.getItem('cart')
    expect(savedCart).toBeTruthy()

    const parsedCart = JSON.parse(savedCart!) as Array<{ name: string }>
    expect(parsedCart).toHaveLength(1)
    expect(parsedCart[0].name).toBe('Ceviche Clásico')
  })
})
 */