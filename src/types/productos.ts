export interface CategoriaProducto {
  id: string
  nombre: string
  imagen_path: string
}

export interface Producto {
  id: string
  nombre: string
  imagen_path: string
  precio_base: string
  categoria: CategoriaProducto
}

export interface ProductosResponse {
  items: Producto[]
  total: number
}
