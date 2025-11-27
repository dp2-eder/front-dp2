"use client"

import { Heart, ShoppingCart, CircleUserRound } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  showNavigation?: boolean
}

export default function Header({
  showFavorite = false,
  isFavorite = false,
  onFavoriteToggle,
  showLogout = false,
  onLogout,
  showNavigation = true
}: HeaderProps) {
  //const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemCount } = useCart()
  const pathname = usePathname()

  return (
    <>
      <header className="bg-[#004166] sticky top-0 z-50">
        <div className="max-w-[1110px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between w-full h-16">
              {/* Left side - Navigation links - Solo si showNavigation es true */}
              {showNavigation && (
                <div className="flex items-center space-x-40">
                  <Link
                    href="/about"
                    className={`text-base font-medium hover:text-[#5CEFFA] ${
                      pathname?.startsWith('/about')
                        ? 'text-white underline underline-offset-4 decoration-2'
                        : 'text-white'
                    }`}
                  >
                    Nosotros
                  </Link>
                  <Link
                    href="/menu"
                    className={`text-base font-medium hover:text-[#5CEFFA] ${
                      pathname?.startsWith('/menu')
                        ? 'text-white underline underline-offset-4 decoration-2'
                        : 'text-white'
                    }`}
                  >
                    Menú
                  </Link>
                </div>
              )}

              {/* Logo al centro */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/menu" data-cy="logo">
                  <Image src="/DINE LINE.svg" alt="DINE LINE" width={64} height={64} className="h-16 w-auto transform translate-y-7" />
                </Link>
              </div>

              {/* Right side - Navigation links + acciones */}
              {showNavigation ? (
                <div className="flex items-center space-x-40">
                  <button
                    onClick={() => setCartOpen(true)}
                    className="text-base font-medium text-white hover:text-[#5CEFFA] relative"
                  >
                    Mi Orden
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-5 h-5 w-5 rounded-full border-2 border-white text-white text-xs flex items-center justify-center font-bold">
                        {itemCount}
                      </span>
                    )}
                  </button>

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
              ) : (
                <>
                  {showLogout && (
                    <Button
                      onClick={onLogout}
                      className="absolute right-4 bg-[#004166] hover:bg-[#003350] text-white flex items-center gap-4 rounded-lg px-6 py-2"
                    >
                      Cerrar Sesión
                      <CircleUserRound className="!w-8 !h-8" />
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Header - SOLO ESTO */}
            <div className="md:hidden flex items-center justify-between w-full">
              {/* Nosotros más a la izquierda - Solo si showNavigation es true */}
              {showNavigation && (
                <div className="flex-1 flex justify-center">
                  <Link
                    href="/about"
                    className={`text-base font-medium hover:text-[#5CEFFA] ${
                      pathname?.startsWith('/about')
                        ? 'text-white underline underline-offset-4 decoration-2'
                        : 'text-white'
                    }`}
                  >
                    Nosotros
                  </Link>
                </div>
              )}

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

              {/* Menú - Solo si showNavigation es true */}
              {showNavigation && (
                <div className="flex-1 flex justify-center items-center">
                  <Link
                    href="/menu"
                    className={`text-base font-medium hover:text-[#5CEFFA] ${
                      pathname?.startsWith('/menu')
                        ? 'text-white underline underline-offset-4 decoration-2'
                        : 'text-white'
                    }`}
                  >
                    Menú
                  </Link>
                </div>
              )}

              {/* Acción derecha - Carrito o Cerrar sesión */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {showNavigation ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 relative"
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingCart className="!w-6 !h-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full border-2 border-white text-white text-[10px] flex items-center justify-center font-bold leading-none">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                ) : (
                  showLogout && (
                    <Button
                      onClick={onLogout}
                      className="bg-[#004166] hover:bg-[#003350] text-white flex items-center gap-2 rounded-lg text-sm px-4 py-2"
                    >
                      Cerrar Sesión
                      <CircleUserRound className="!w-8 !h-8" />
                    </Button>
                  )
                )}
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