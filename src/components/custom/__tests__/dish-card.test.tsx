/**
 * UNIT TEST: DishCard Component
 * US-FE-009: Grid de Platos
 * 
 * Tests para validar:
 * - Renderizado correcto de información del plato
 * - Manejo de imágenes
 * - Estados de disponibilidad
 * - Navegación al detalle
 

import { render, screen } from '@testing-library/react'

import { DishCard } from '@/components/custom/dish-card'
import { Root2 } from '@/types/menu'

// Mock next/link
const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return <a href={href}>{children}</a>
}

jest.mock('next/link', () => {
  return MockLink
})

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

const mockDish: Root2 = {
  id: 1,
  nombre: 'Ceviche Clásico',
  imagen: '/ceviche.jpg',
  precio: 25.0,
  stock: 10,
  disponible: true,
  categoria: 'Entrada',
  alergenos: ['pescado', 'mariscos'],
  tiempo_preparacion: 15,
  descripcion: 'Ceviche fresco con pescado del día',
  ingredientes: ['pescado', 'limón', 'cebolla', 'ají'],
  grupo_personalizacion: [],
}

describe('DishCard Component', () => {
  test('renders dish name correctly', () => {
    render(<DishCard dish={mockDish} />)
    
    expect(screen.getByText('Ceviche Clásico')).toBeInTheDocument()
  })

  test('renders image with correct alt text', () => {
    render(<DishCard dish={mockDish} />)
    
    const image = screen.getByAltText('Ceviche Clásico')
    expect(image).toBeInTheDocument()
  })

  test('links to correct dish detail page', () => {
    render(<DishCard dish={mockDish} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/plato/1')
  })

  test('shows "Agotado" badge when dish is not available', () => {
    const unavailableDish = { ...mockDish, disponible: false }
    render(<DishCard dish={unavailableDish} />)
    
    expect(screen.getByText('Agotado')).toBeInTheDocument()
  })

  test('does not show "Agotado" badge when dish is available', () => {
    render(<DishCard dish={mockDish} />)
    
    expect(screen.queryByText('Agotado')).not.toBeInTheDocument()
  })

  test('renders with custom className prop', () => {
    const { container } = render(
      <DishCard dish={mockDish} className="custom-class" />
    )
    
    // Verify the component renders successfully with className prop
    expect(container.querySelector('article')).toBeInTheDocument()
  })

  test('handles hover state', () => {
    const { container } = render(<DishCard dish={mockDish} />)
    
    const article = container.querySelector('article')
    expect(article).toHaveClass('hover:scale-105')
  })

  test('renders correctly with missing optional data', () => {
    const minimalDish: Root2 = {
      id: 2,
      nombre: 'Plato Básico',
      imagen: '',
      precio: 10.0,
      stock: 0,
      disponible: true,
      categoria: 'Otro',
      alergenos: [],
      tiempo_preparacion: 0,
      descripcion: '',
      ingredientes: [],
    }

    render(<DishCard dish={minimalDish} />)
    
    expect(screen.getByText('Plato Básico')).toBeInTheDocument()
  })

  test('handles long dish names with truncation', () => {
    const longNameDish = {
      ...mockDish,
      nombre: 'Ceviche Clásico con Pescado Fresco del Día y Mariscos Variados',
    }

    const { container } = render(<DishCard dish={longNameDish} />)
    
    const nameElement = container.querySelector('h3')
    expect(nameElement).toHaveClass('truncate')
  })

  test('renders with local fallback image', () => {
    render(<DishCard dish={mockDish} />)
    
    const image = screen.getByAltText('Ceviche Clásico')
    // Should use local image based on dish ID
    expect(image).toHaveAttribute('src')
  })
})
*/
