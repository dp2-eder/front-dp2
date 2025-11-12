/**
 * Tipos centralizados para pedidos y órdenes
 */

/**
 * Item en el carrito de compras
 */
export interface CartItem {
  id: string
  dishId: number
  name: string
  description: string
  basePrice: number
  quantity: number
  image: string
  selectedOptions: {
    id: string
    type: string
    name: string
    price: number
  }[]
  totalPrice: number
  comments?: string
}

/**
 * Parámetros para enviar un pedido al backend
 * Usa el nuevo endpoint POST /api/v1/pedidos/enviar
 */
export interface SendOrderParams {
  cart: CartItem[]
  tokenSesion: string
  notasCliente?: string
  notasCocina?: string
}

/**
 * Parámetros legacy para compatibilidad hacia atrás
 * DEPRECATED: Usa SendOrderParams en su lugar
 */
export interface SendOrderParamsLegacy {
  cart: CartItem[]
  idMesa: string
  userId?: string
  notasCliente?: string
  notasCocina?: string
}

/**
 * Error de validación del API
 */
export interface ValidationError {
  loc?: string[]
  msg?: string
  input?: unknown
  type?: string
}

export interface PedidoProducto {
  id: string
  id_producto: string
  nombre_producto: string
  cantidad: number
  precio_unitario: string
  precio_opciones: string
  subtotal: string
  notas_personalizacion: string
  imagen_path?: string
  opciones: {
    id: string
    id_producto_opcion: string
    nombre_opcion: string
    precio_adicional: string
  }[]
}

export interface Pedido {
  id: string
  numero_pedido: string
  estado: "pendiente" | "confirmado" | "en_preparacion" | "listo" | "entregado"
  subtotal: string
  impuestos: string
  descuentos: string
  total: string
  notas_cliente: string
  notas_cocina: string
  fecha_creacion: string
  fecha_confirmado?: string
  fecha_en_preparacion?: string
  fecha_listo?: string
  fecha_entregado?: string
  productos: PedidoProducto[]
}

export interface HistorialResponse {
  token_sesion: string
  id_mesa: string
  total_pedidos: number
  pedidos: Pedido[]
}

/**
 * Item del historial de órdenes para mostrar en UI
 * (formato normalizado para componentes)
 */
export interface OrderHistoryItem {
  id: string
  name: string
  quantity: number
  subtotal: number
  additionals?: string[]
  comments?: string
  image?: string
  date: string
  pedidoId?: string
}

/**
 * Grupo de pago para división de cuenta (para PaymentGroups component)
 */
export interface PaymentGroup {
  id: string
  name: string
  items: Array<OrderHistoryItem & { selectedQuantity: number }>
  subtotal: number
}

/**
 * Item seleccionado en un grupo de pago
 */
export interface SelectedItem {
  name: string
  subtotal: number
  quantity: number
}

/**
 * Props para componente PaymentGroups
 */
export interface PaymentGroupsProps {
  orderHistory: OrderHistoryItem[]
  onGroupsChange?: (groups: PaymentGroup[], paidGroupIds: string[]) => void
}

/**
 * Props para componente SplitBill
 */
export interface SplitBillProps {
  totalAmount: number
  peopleCount: number
  onPeopleCountChange: (count: number) => void
}
