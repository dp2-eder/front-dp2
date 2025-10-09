/**
 * UNIT TEST: useCart Hook
 * US-FE-013: Carrito de Compras
 * 
 * Tests para validar:
 * - Agregar items al carrito
 * - Actualizar cantidades
 * - Eliminar items
 * - Calcular totales
 * - Persistencia en localStorage
 

import { renderHook, act } from '@testing-library/react'
import { useCart, CartItem } from '@/hooks/use-cart'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  const mockCartItem: CartItem = {
    id: 'test-item-1',
    dishId: 1,
    name: 'Ceviche Clásico',
    description: 'Ceviche fresco con pescado del día',
    basePrice: 25.0,
    quantity: 1,
    image: '/ceviche.jpg',
    selectedOptions: [
      {
        type: 'salsa',
        name: 'Ají picante',
        price: 2.0,
      },
    ],
    totalPrice: 27.0,
    comments: 'Sin cebolla por favor',
  }

  test('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart())

    expect(result.current.cart).toEqual([])
    expect(result.current.total).toBe(0)
    expect(result.current.itemCount).toBe(0)
  })

  test('should add item to cart correctly', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart(mockCartItem)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]).toEqual(mockCartItem)
    expect(result.current.itemCount).toBe(1)
    expect(result.current.total).toBe(27.0)
  })

  test('should update item quantity', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart(mockCartItem)
    })

    act(() => {
      result.current.updateQuantity('test-item-1', 3)
    })

    expect(result.current.cart[0].quantity).toBe(3)
    expect(result.current.cart[0].totalPrice).toBe(81.0) // (25 + 2) * 3
    expect(result.current.itemCount).toBe(3)
  })

  test('should remove item when quantity becomes 0', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart(mockCartItem)
    })

    act(() => {
      result.current.updateQuantity('test-item-1', 0)
    })

    expect(result.current.cart).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  test('should remove item from cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart(mockCartItem)
    })

    act(() => {
      result.current.removeFromCart('test-item-1')
    })

    expect(result.current.cart).toHaveLength(0)
  })

  test('should calculate total correctly with multiple items', () => {
    const { result } = renderHook(() => useCart())

    const item2: CartItem = {
      ...mockCartItem,
      id: 'test-item-2',
      dishId: 2,
      name: 'Lomo Saltado',
      basePrice: 30.0,
      selectedOptions: [],
      totalPrice: 30.0,
    }

    act(() => {
      result.current.addToCart(mockCartItem)
      result.current.addToCart(item2)
    })

    expect(result.current.total).toBe(57.0) // 27 + 30
    expect(result.current.itemCount).toBe(2)
  })

  test('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart(mockCartItem)
    })

    const savedCart = localStorage.getItem('cart')
    expect(savedCart).toBeTruthy()
    
    const parsedCart = JSON.parse(savedCart!)
    expect(parsedCart).toHaveLength(1)
    expect(parsedCart[0].id).toBe('test-item-1')
  })

  test('should load cart from localStorage on init', () => {
    localStorage.setItem('cart', JSON.stringify([mockCartItem]))

    const { result } = renderHook(() => useCart())

    // Wait for initialization
    setTimeout(() => {
      expect(result.current.cart).toHaveLength(1)
      expect(result.current.cart[0].id).toBe('test-item-1')
    }, 100)
  })

  test('should clear cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart(mockCartItem)
    })

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.cart).toHaveLength(0)
    expect(result.current.total).toBe(0)
    expect(result.current.itemCount).toBe(0)
  })

  test('should handle multiple items with different quantities', () => {
    const { result } = renderHook(() => useCart())

    const item1: CartItem = { ...mockCartItem, quantity: 2, totalPrice: 54.0 }
    const item2: CartItem = {
      ...mockCartItem,
      id: 'test-item-2',
      quantity: 3,
      totalPrice: 81.0,
    }

    act(() => {
      result.current.addToCart(item1)
      result.current.addToCart(item2)
    })

    expect(result.current.itemCount).toBe(5) // 2 + 3
    expect(result.current.total).toBe(135.0) // 54 + 81
  })
})
*/