import DishCard from '@/components/custom/dish-card'
import { Producto } from '@/types/productos'

interface ClientDishCardProps {
  dish: Producto
  showPrice?: boolean
  priority?: boolean
  disableAnimation?: boolean
}

export function ClientDishCard({
  dish,
  showPrice = true,
  priority = false,
  disableAnimation = false
}: ClientDishCardProps) {
  return (
    <DishCard
      dish={{
        id: dish.id,
        nombre: dish.nombre || 'Sin nombre',
        imagen: dish.imagen_path || '/placeholder-image.png',
        precio: parseFloat(dish.precio_base),
        stock: 10,
        disponible: true,
        categoria: dish.categoria.nombre,
        alergenos: [],
        tiempo_preparacion: 15,
        descripcion: '',
        ingredientes: [],
        grupo_personalizacion: []
      }}
      showPrice={showPrice}
      priority={priority}
      disableAnimation={disableAnimation}
    />
  )
}
