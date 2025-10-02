import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/layout/header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showFullNavigation={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/maxresdefault.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto gap-8">
            <div className="flex-1 max-w-lg text-center lg:text-left">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                Bienvenido a Dine Line
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-6 md:mb-8 leading-7">
                "Reconocido por su innovadora modalidad para brindarte 
                una experiencia única y personalizada."
              </p>
              <Link href="/menu">
                <Button 
                  size="lg" 
                  className="bg-background text-foreground hover:bg-background/90 shadow-lg"
                >
                  Ordene Ahora
                </Button>
              </Link>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <Image
                  src="/fresh-ceviche-with-red-onions-and-sweet-potato.jpg"
                  alt="Plato de ceviche fresco"
                  width={400}
                  height={300}
                  className="w-80 h-60 md:w-96 md:h-72 lg:w-[400px] lg:h-[300px] object-cover rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="scroll-m-20 text-3xl font-bold tracking-tight text-center text-primary mb-8 md:mb-12">
            Nuestras Categorías
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Entradas */}
            <Link href="/menu/entradas" className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-32 md:h-40 lg:h-48">
                    <Image
                      src="/causa-limena-with-yellow-potato-and-avocado.jpg"
                      alt="Entradas"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                      <h3 className="text-lg font-semibold text-white">Entradas</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Ceviches */}
            <Link href="/menu/ceviches" className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-32 md:h-40 lg:h-48">
                    <Image
                      src="/mixed-seafood-ceviche-with-shrimp-and-octopus.jpg"
                      alt="Ceviches"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                      <h3 className="text-lg font-semibold text-white">Ceviches</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Arroces */}
            <Link href="/menu/arroces" className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-32 md:h-40 lg:h-48">
                    <Image
                      src="/peruvian-seafood-rice-with-cilantro.jpg"
                      alt="Arroces"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                      <h3 className="text-lg font-semibold text-white">Arroces</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Sopas */}
            <Link href="/menu/sopas" className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-32 md:h-40 lg:h-48">
                    <Image
                      src="/chaudfa-de-mariscos-500x450.jpg"
                      alt="Sopas"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                      <h3 className="text-lg font-semibold text-white">Sopas</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Otros */}
            <Link href="/menu/otros" className="group col-span-2 md:col-span-1">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-32 md:h-40 lg:h-48">
                    <Image
                      src="/6143e231d4bfcf3c4448e32e.jpg"
                      alt="Otros"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                      <h3 className="text-lg font-semibold text-white">Otros</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer decorativo */}
      <footer className="bg-gradient-to-r from-primary to-primary/80 py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
            <Image
              src="/DINE LINE.svg"
              alt="Dine Line Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <p className="text-primary-foreground text-sm md:text-base leading-7">
              Dine Line - Experiencia culinaria única
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}