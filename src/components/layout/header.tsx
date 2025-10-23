"use client"

import { Heart, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import CartSidebar from "@/components/cart/cart-sidebar"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface HeaderProps {
  showBackButton?: boolean
  backHref?: string
  backText?: string
  showFavorite?: boolean
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  showLogout?: boolean
  onLogout?: () => void
  userInfo?: string
  showUpdateButton?: boolean
  onUpdateClick?: () => void
  isUpdating?: boolean
  onHamburgerClick?: () => void
  showFullNavigation?: boolean
}

export default function Header({
  showFavorite = false,
  isFavorite = false,
  onFavoriteToggle
}: HeaderProps) {
  //const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      <header className="bg-[#004166] sticky top-0 z-50">
        <div className="max-w-[1110px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between w-full h-16">
              {/* Left side - Navigation links */}
              <div className="flex items-center space-x-40">
                <Link href="/menu" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Menú
                </Link>
                <Link href="/about" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Nosotros
                </Link>
              </div>

              {/* Logo al centro */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/menu" data-cy="logo">
                  <Image src="/DINE LINE.svg" alt="DINE LINE" width={64} height={64} className="h-16 w-auto transform translate-y-7" />
                </Link>
              </div>

              {/* Right side - Navigation links + acciones */}
              <div className="flex items-center space-x-40">
                <button 
                  onClick={() => setCartOpen(true)}
                  className="text-sm font-medium text-white hover:text-[#5CEFFA] relative"
                >
                  Mi Orden
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-5 h-5 w-5 rounded-full bg-white text-[#0056C6] text-xs flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </button>
                <Link href="/contact" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Contáctanos
                </Link>

                {/* Acciones opcionales */}
                {showFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onFavoriteToggle}
                    className={`text-white hover:bg-white/10 ${isFavorite ? "text-red-300" : ""}`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Header - SOLO ESTO */}
            <div className="md:hidden flex items-center justify-between w-full">
              {/* Menú más a la derecha */}
              <div className="flex-1 flex justify-center ml-3">
                <Link href="/menu" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Menú
                </Link>
              </div>
              
              {/* Logo al centro - SOLO UNO */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/menu">
                  <Image 
                    src="/DINE LINE.svg" 
                    alt="DINE LINE" 
                    width={56} 
                    height={56} 
                    className="h-14 w-auto transform translate-y-7" 
                  />
                </Link>
              </div>
              {/* Nosotros */}
              <div className="flex-1 flex justify-end items-center pr-16">
                <Link href="/about" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                  Nosotros
                </Link>
              </div>
              
              {/* Hamburguesa en esquina derecha absoluta */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 relative"
                  onClick={() => setCartOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white text-[#0056C6] text-xs flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
      />
    </>
  )
}