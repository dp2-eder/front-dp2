import Image from "next/image"
import Link from "next/link"

export default function MainHeader() {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link 
              href="/nosotros" 
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors text-sm md:text-base font-medium"
            >
              Nosotros
            </Link>
            <Link 
              href="/menu" 
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors text-sm md:text-base font-medium"
            >
              Menú
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link href="/nosotros">
              <Image
                src="/DINE LINE.svg"
                alt="Dine Line Logo"
                width={60}
                height={60}
                className="w-10 h-10 md:w-15 md:h-15 hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link 
              href="/carrito" 
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors text-sm md:text-base font-medium"
            >
              Mi Orden
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}