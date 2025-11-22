export interface CategoriaProducto {
  id: string
  nombre: string
  imagen_path: string
}

export interface Alergeno {
  nombre: string
  icono?: string
}

export interface Producto {
  id: string
  nombre: string
  descripcion?: string
  imagen_path: string
  precio_base: string
  categoria: CategoriaProducto
  alergenos?: Alergeno[]
}

export interface ProductosResponse {
  items: Producto[]
  total: number
}

/**
 * Opción de un producto (ej: tamaño, temperatura, etc)
 */
export interface Opcion {
  id: string
  nombre: string
  precio_adicional: string
  activo: boolean
  orden: number
  id_producto: string
  id_tipo_opcion: string
  fecha_creacion: string
  fecha_modificacion: string
}

/**
 * Tipo de opción agrupada (ej: todas las opciones de "Tamaño")
 */
export interface TipoOpcion {
  id_tipo_opcion: string
  nombre_tipo: string
  seleccion_maxima: number
  opciones: Opcion[]
}

/**
 * Producto con sus opciones disponibles
 */
export interface ProductoConOpciones {
  id: string
  nombre: string
  descripcion: string
  precio_base: string
  imagen_path: string | null
  disponible: boolean
  opciones: Opcion[]
  tipos_opciones?: TipoOpcion[]
}
