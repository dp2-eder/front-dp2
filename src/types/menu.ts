export type Root = Root2[]

export interface Root2 {
  id: string
  nombre: string
  imagen: string
  precio: number
  stock: number
  disponible: boolean
  categoria: string
  alergenos: string[]
  tiempo_preparacion: number
  descripcion: string
  ingredientes: string[]
  grupo_personalizacion?: GrupoPersonalizacion[] | null
}

export interface Ingrediente {
  id: number
  nombre: string
  categoria_alergeno?: string | null
}

export interface GrupoPersonalizacion {
  etiqueta: string
  tipo: string
  max_selecciones: number
  opciones: Opcione[]
}

export interface Opcione {
  etiqueta: string
  precio_adicional: number
  es_default: boolean
  seleccionado: boolean
}
