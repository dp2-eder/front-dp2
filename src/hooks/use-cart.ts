import { useState, useEffect } from 'react'

export interface CartItem {
  id: string
  dishId: number
  name: string
  description: string
  basePrice: number
  quantity: number
  image: string
  selectedOptions: {
    type: string
    name: string
    price: number
  }[]
  totalPrice: number
  comments?: string
}

// Estado global del carrito
let globalCart: CartItem[] = []
let cartListeners: Array<() => void> = []

// Función para notificar a todos los listeners
const notifyListeners = () => {
  cartListeners.forEach(listener => listener())
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(globalCart)
  const [isInitialized, setIsInitialized] = useState(false)

  // Listener para cambios globales
  useEffect(() => {
    const listener = () => {
      setCart([...globalCart])
    }
    cartListeners.push(listener)
    
    return () => {
      cartListeners = cartListeners.filter(l => l !== listener)
    }
  }, [])

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart) as CartItem[]
          if (Array.isArray(parsedCart)) {
            globalCart = parsedCart
            setCart(parsedCart)
          }
        } catch (error) {
          //console.error('Error loading cart:', error)
        }
      }
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Escuchar cambios en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'cart' && e.newValue) {
          try {
            const newCart = JSON.parse(e.newValue) as CartItem[]
            if (Array.isArray(newCart)) {
              setCart(newCart)
            }
          } catch (error) {
            //console.error('Error parsing cart from localStorage:', error)
          }
        }
      }

      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie (solo después de inicializar)
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isInitialized])

  const addToCart = (item: CartItem) => {
    const newCart = [...globalCart, item]
    globalCart = newCart
    setCart(newCart)
    notifyListeners()
  }

  const removeFromCart = (itemId: string) => {
    const newCart = globalCart.filter(item => item.id !== itemId)
    globalCart = newCart
    setCart(newCart)
    notifyListeners()
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const newCart = globalCart.map(item => 
      item.id === itemId 
        ? { ...item, quantity, totalPrice: (item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) * quantity }
        : item
    )
    globalCart = newCart
    setCart(newCart)
    notifyListeners()
  }

  const clearCart = () => {
    globalCart = []
    setCart([])
    notifyListeners()
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const getItemCount = () => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    return count
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount()
  }
}
