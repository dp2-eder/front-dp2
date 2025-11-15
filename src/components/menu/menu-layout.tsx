import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Producto } from '@/types/productos'

interface MenuLayoutProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  inputValue: string
  onInputChange: (value: string) => void
  filteredDishes: Producto[]
  dishesByCategory: { [key: string]: Producto[] }
  expandedCategories: { [key: string]: boolean }
  onToggleCategory: (category: string) => void
  renderProductCard: (dish: Producto) => React.ReactNode
  searchPlaceholder?: string
  maxProductsPerCategory?: number
  renderMoreOptions?: (category: string, dish: Producto | undefined) => React.ReactNode
  renderCategorySkeleton?: (category: string) => React.ReactNode
  showSearch?: boolean
}

export function MenuLayout({
  categories,
  selectedCategory,
  onCategoryChange,
  inputValue,
  onInputChange,
  filteredDishes,
  dishesByCategory,
  expandedCategories,
  onToggleCategory,
  renderProductCard,
  searchPlaceholder = 'Buscar productos...',
  maxProductsPerCategory,
  renderMoreOptions,
  renderCategorySkeleton,
  showSearch = true
}: MenuLayoutProps) {
  return (
    <>
      {/* Search and Filters - Only shown if showSearch is true */}
      {showSearch && (
        <div className="mb-8">
          <div className="flex justify-center md:justify-center lg:justify-start mb-4">
            <div className="relative w-full md:w-full lg:w-1/2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black-50 h-5 w-5" />
              <Input
                placeholder={searchPlaceholder}
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
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
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full px-4 py-2 whitespace-nowrap flex-shrink-0 ${selectedCategory === category
                      ? 'bg-[#004166] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    aria-pressed={selectedCategory === category}
                    data-testid={`category-${category.toLowerCase()}`}
                    data-cy={category === 'Todos' ? 'all-categories-btn' : 'category-button'}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Sections */}
      {filteredDishes.length > 0 ? (
        <>
          {selectedCategory === 'Todos' ? (
            // Vista con contenedores expandibles cuando está en "Todos"
            Object.entries(dishesByCategory).map(([category, dishes]) => (
              <div key={category} className="mb-8">
                <div className="bg-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-md">
                  {/* Header categoría */}
                  <div
                    className="flex items-center cursor-pointer mb-4 group"
                    onClick={() => onToggleCategory(category)}
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

                  {/* Productos */}
                  <div className={!expandedCategories[category] ? 'hidden' : ''}>
                    {renderCategorySkeleton?.(category) || (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5" data-cy="plate-grid">
                        {dishes.slice(0, maxProductsPerCategory).map((dish) => (
                          <div key={dish.id}>
                            {renderProductCard(dish)}
                          </div>
                        ))}
                        {maxProductsPerCategory && dishes.length > maxProductsPerCategory && renderMoreOptions && (
                          <div key={`${category}-more`}>
                            {renderMoreOptions(category, dishes[0])}
                          </div>
                        )}
                      </div>
                    )}
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
                {/* Cards directamente sin contenedor - Mostrar TODOS los productos cuando hay categoría seleccionada */}
                {renderCategorySkeleton?.(category) || (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-cy="plate-grid">
                    {dishes.map((dish) => (
                      <div key={dish.id}>
                        {renderProductCard(dish)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </>
      ) : showSearch ? (
        <Card className="p-8 text-center bg-unavailable rounded-3xl">
          <div className="flex flex-col items-center">
            <Search
              className="w-24 h-24 mt-5 mb-16 text-foreground"
              strokeWidth={0.5}
              stroke="currentColor"
            />
            <h2 className="text-4xl font-medium mb-8">Ítem No Disponible, Ingrese Otro</h2>
            <p className="text-foreground text-3xl font-normal mb-4">&ldquo;{inputValue}&rdquo;</p>
            <p className="text-foreground mt-2 text-xl">
              No Encontramos Ningún Ítem Con Tu Búsqueda<br />
              Revisa Ortografía O Prueba Con Términos Más Generales
            </p>
          </div>
        </Card>
      ) : null}
    </>
  )
}
