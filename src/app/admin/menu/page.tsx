"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { LogOut, ChevronDown, ChevronUp, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductos } from "@/hooks/use-productos";
import { useDebounce } from "@/hooks/use-debounce";
import { Producto } from "@/types/productos";
import Loading from "@/app/loading";

export default function AdminMenuPage() {
  const router = useRouter();
  const { productos, loading } = useProductos();
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  // Generar categorías dinámicamente desde la API
  const categories = React.useMemo(() => {
    if (!productos.length) return ["Todos"];
    const uniqueCategories = Array.from(new Set(productos.map(item => item.categoria.nombre)));
    return ["Todos", ...uniqueCategories.sort()];
  }, [productos]);

  // Filtrar platos por categoría y búsqueda
  const filteredDishes = React.useMemo(() => {
    return productos.filter((dish) => {
      const matchesCategory = selectedCategory === "Todos" || dish.categoria.nombre === selectedCategory;
      const matchesSearch =
        (dish.nombre || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [productos, selectedCategory, debouncedSearchTerm]);

  // Agrupar platos por categoría
  const dishesByCategory = React.useMemo(() => {
    return filteredDishes.reduce((acc, dish) => {
      const category = dish.categoria.nombre;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(dish);
      return acc;
    }, {} as { [key: string]: Producto[] });
  }, [filteredDishes]);

  // Inicializar todas las categorías colapsadas
  useEffect(() => {
    if (categories.length > 0) {
      const initialExpanded = categories.reduce((acc, category) => {
        acc[category] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      setExpandedCategories(initialExpanded);
    }
  }, [categories]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem("token_sesion");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("usuario");
    localStorage.removeItem("userRole");
    localStorage.removeItem("fecha_expiracion");

    // Navegar al login de admin
    router.push("/admin/login");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#004166] text-white p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nuestro Menú</h1>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-20">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">Nuestro Menú</h1>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex justify-center md:justify-center lg:justify-start mb-4">
            <div className="relative w-full md:w-full lg:w-1/2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-50 h-5 w-5" />
              <Input
                placeholder="Buscar productos..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-12 text-lg rounded-[10px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                aria-label="Buscar productos"
                data-testid="search-input"
                data-cy="search-input"
              />
            </div>
          </div>

          {/* Renderizado condicional de filtros o recuento de búsqueda */}
          <div className="relative">
            {inputValue.length > 0 ? (
              // CUANDO HAY BÚSQUEDA: Mostrar recuento de resultados
              <div className="py-2">
                <div
                  className="inline-block bg-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm font-medium"
                  aria-live="polite"
                >
                  {filteredDishes.length} {filteredDishes.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                </div>
              </div>
            ) : (
              // CUANDO NO HAY BÚSQUEDA: Mostrar carrusel de categorías
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                role="group"
                aria-label="Filtros de categoría"
              >
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0 ${selectedCategory === category
                      ? "bg-[#004166] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    aria-pressed={selectedCategory === category}
                    data-testid={`category-${category.toLowerCase()}`}
                    data-cy={category === "Todos" ? "all-categories-btn" : "category-button"}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Menu Sections */}
        {filteredDishes.length > 0 ? (
          <>
            {selectedCategory === "Todos" ? (
              // Vista con contenedores expandibles cuando está en "Todos"
              Object.entries(dishesByCategory).map(([category, dishes]) => (
                <div key={category} className="mb-8">
                  <div className="bg-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-md">
                    {/* Header categoría */}
                    <div
                      className="flex items-center cursor-pointer mb-4 group"
                      onClick={() => toggleCategory(category)}
                    >
                      <h2 className="text-xl font-bold text-gray-800 flex-1 text-center group-hover:text-[#004166] transition-colors">
                        {category}
                      </h2>
                      {expandedCategories[category] ? (
                        <ChevronUp className="w-6 h-6 text-gray-600 group-hover:text-[#004166] transition-colors" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-600 group-hover:text-[#004166] transition-colors" />
                      )}
                    </div>

                    {/* Línea solo expandido */}
                    {expandedCategories[category] && <hr className="border-blue-700" />}

                    {/* Platos */}
                    <div className={!expandedCategories[category] ? 'hidden' : ''}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5" data-cy="plate-grid">
                        {dishes.map((dish) => (
                          <article
                            key={dish.id}
                            className="text-center cursor-pointer transition-transform duration-200 hover:scale-105"
                            data-cy="plate-card"
                          >
                            {/* Contenedor de imagen (vacío, solo placeholder) */}
                            <div className="relative bg-gray-300 aspect-[16/9] rounded-t-3xl flex items-center justify-center overflow-hidden">
                              {/* Placeholder gris donde iría la imagen */}
                            </div>

                            {/* Nombre del plato */}
                            <h3
                              className="bg-[#004166] text-white px-3 py-2 rounded-b-3xl text-sm font-medium truncate whitespace-nowrap overflow-hidden"
                              title={dish.nombre}
                              data-cy="plate-name"
                            >
                              {dish.nombre || "Nombre no disponible"}
                            </h3>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Vista sin contenedor cuando hay una categoría específica seleccionada
              Object.entries(dishesByCategory).map(([category, dishes]) => (
                <div key={category} className="mb-8">
                  {/* Solo el título de la categoría */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {category}
                  </h2>
                  {/* Cards directamente sin contenedor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-cy="plate-grid">
                    {dishes.map((dish) => (
                      <article
                        key={dish.id}
                        className="text-center cursor-pointer transition-transform duration-200 hover:scale-105"
                        data-cy="plate-card"
                      >
                        {/* Contenedor de imagen (vacío, solo placeholder) */}
                        <div className="relative bg-gray-300 aspect-[16/9] rounded-t-3xl flex items-center justify-center overflow-hidden">
                          {/* Placeholder gris donde iría la imagen */}
                        </div>

                        {/* Nombre del plato */}
                        <h3
                          className="bg-[#004166] text-white px-3 py-2 rounded-b-3xl text-sm font-medium truncate whitespace-nowrap overflow-hidden"
                          title={dish.nombre}
                          data-cy="plate-name"
                        >
                          {dish.nombre || "Nombre no disponible"}
                        </h3>
                      </article>
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="w-24 h-24 mx-auto mb-8 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay productos disponibles</h2>
            <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </main>
    </div>
  );
}
