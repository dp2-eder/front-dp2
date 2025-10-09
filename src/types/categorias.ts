export interface Producto {
  id: string
  nombre: string
  imagen_path: string
}

export interface Categoria {
  id: string
  nombre: string
  imagen_path: string
  productos: Producto[]
}

export interface CategoriasResponse {
  items: Categoria[]
  total: number
}
