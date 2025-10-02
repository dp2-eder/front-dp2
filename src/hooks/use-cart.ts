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

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const savedCart = localStorage.getItem('cart')
      console.log('Loading cart from localStorage:', savedCart)
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart)
            console.log('Cart loaded successfully:', parsedCart)
          }
        } catch (error) {
          console.error('Error loading cart:', error)
        }
      }
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Guardar carrito en localStorage cuando cambie (solo después de inicializar)
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      console.log('Saving cart to localStorage:', cart)
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isInitialized])

  const addToCart = (item: CartItem) => {
    console.log('Adding to cart:', item)
    setCart(prevCart => {
      const newCart = [...prevCart, item]
      console.log('New cart state:', newCart)
      return newCart
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(prevCart => {
      const newCart = prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity, totalPrice: (item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)) * quantity }
          : item
      )
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
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
