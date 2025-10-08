"use client"

import { Heart, ShoppingCart, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

interface HeaderProps {
  showBackButton?: boolean
  backHref?: string
  backText?: string
  showCart?: boolean
  cartItems?: number
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
  showCart = false,
  cartItems = 0,
  showFavorite = false,
  isFavorite = false,
  onFavoriteToggle
}: HeaderProps) {

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-[#004166] sticky top-0 z-50">
      <div className="max-w-[1110px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile - Logo al centro con posición absoluta */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 mt-16">
            <Link href="/menu">
              <Image src="/DINE LINE.svg" alt="DINE LINE" width={56} height={56} className="h-14 w-auto" />
            </Link>
          </div>

          {/* Desktop Header - FLEX en lugar de GRID */}
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

            {/* Logo al centro - ABSOLUTO */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/menu" data-cy="logo">
                <Image src="/DINE LINE.svg" alt="DINE LINE" width={64} height={64} className="h-16 w-auto transform translate-y-7" />
              </Link>
            </div>

            {/* Right side - Navigation links + acciones */}
            <div className="flex items-center space-x-40">
              <Link href="/carrito" className="text-sm font-medium text-white hover:text-[#5CEFFA]">
                Mi Orden
              </Link>
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

              {showCart && (
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative" data-cy="cart-button">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-[#0056C6] text-xs flex items-center justify-center font-bold" data-cy="cart-count">
                      {cartItems}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Hamburguesa - Mobile */}
          <div className="md:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay + Menú Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          {/* Fondo translúcido con blur (cierra al hacer clic) */}
          <div
            className="absolute inset-0 bg-[#ECF1F4]/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>

          {/* Menú desplegable debajo del header */}
          <div className="relative md:hidden bg-[#0056C6] text-white px-6 py-4 space-y-3 text-center z-50">
            {/* Botón X para cerrar */}
            <div className="flex justify-end">
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6 text-white hover:text-[#5CEFFA]" />
              </button>
            </div>

            <Link
              href="/menu"
              className="block hover:text-[#5CEFFA] border-b-2 border-white/30 pb-2"
            >
              Menú
            </Link>
            <Link
              href="/about"
              className="block hover:text-[#5CEFFA] border-b-2 border-white/30 pb-2"
            >
              Nosotros
            </Link>
            <Link
              href="/carrito"
              className="block hover:text-[#5CEFFA] border-b-2 border-white/30 pb-2"
            >
              Mi Orden
            </Link>
            <Link
              href="/contact"
              className="block hover:text-[#5CEFFA] pb-2"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}