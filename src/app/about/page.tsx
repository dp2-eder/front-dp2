"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"



const categoryImages: Record<string, string> = {
  Entrada: "/causa-limena-with-yellow-potato-and-avocado.jpg",
  'Bebida Alcoholica': "/mixed-seafood-ceviche-with-shrimp-and-octopus.jpg",
  'Bebidas Sin Alcohol': "/peruvian-seafood-rice-with-cilantro.jpg",
  'Plato Principal': "/chaudfa-de-mariscos-500x450.jpg",
  'Bebidas': "/6143e231d4bfcf3c4448e32e.jpg",
  // Puedes agregar más categorías e imágenes genéricas aquí
}

export default function AboutPage() {
  const [categories, setCategories] = useState<string[]>([])
  const router = useRouter()
  useEffect(() => {
    setCategories(["Bebida Alcohólica", "Bebida Sin Alcohol", "Plato Principal", "Postre", "Entrada"]);
  }, []);
  /*useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://backend-mockup.onrender.com/api/menu/items");
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        const data: MenuItem[] = await res.json();
        console.log("DATA DEL API:", data);
        const uniqueCategories = Array.from(
          new Set(data.map(item => item.categoria.toLowerCase()))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error al obtener datos del API:", error);

        setCategories(["Todos", "Criollo", "Pescados", "Bebidas", "Entradas"]);
        //console.log("No se extrajo data");
      }
    };
    fetchCategories();
  }, []);*/
  //console.log(`CATEGORIAS REGISTRADAS: ${  categories}`);

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
                &ldquo;Reconocido por su innovadora modalidad para brindarte
                una experiencia única y personalizada.&rdquo;
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

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories.map((cat) => (
                <CarouselItem
                  key={cat}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <div
                    className="group block cursor-pointer"
                    onClick={() =>
                      router.push(`/menu?categoria=${encodeURIComponent(cat)}`)
                    }
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <CardContent className="p-0">
                        <div className="relative h-32 md:h-40 lg:h-48">
                          <Image
                            src={categoryImages[cat] || "/placeholder-image.png"}
                            alt={cat}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                          <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4">
                            <h3 className="text-lg font-semibold text-white capitalize">
                              {cat}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Botones de navegación */}
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
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