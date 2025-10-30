"use client"

import { ShoppingCart, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

// Función para enviar pedido a cocina
import type { CartItem } from "@/hooks/use-cart";

interface SendOrderParams {
  cart: CartItem[];
  notasCliente?: string;
  notasCocina?: string;
}

// Helper para enviar pedido usando endpoint local (proxy en Next.js)
async function sendOrderToKitchen({ cart, notasCliente = "", notasCocina = "" }: SendOrderParams) {
  // Obtener id_mesa de localStorage
  const id_mesa = typeof window !== 'undefined' ? localStorage.getItem("mesaId") : null;
  if (!id_mesa) throw new Error("No se encontró el ID de la mesa");

  // Armar items
  const items = cart.map((item: CartItem) => {
    // id_producto debe ser el id real del producto (string largo)
    // El id_producto debe ser solo la parte antes del guion (producto.id)
    const id_producto = String(item.id).split('-')[0];
    // El precio_unitario debe ser SOLO el basePrice original del producto, sin adicionales
    const precio_unitario = Number(Number(item.basePrice).toFixed(2));
    // Opciones como array de objetos { id_producto_opcion, precio_adicional }
    const opciones = Array.isArray(item.selectedOptions)
      ? item.selectedOptions.map((opt: any) => ({
          id_producto_opcion: opt.id ? String(opt.id) : "",
          precio_adicional: Number(Number(opt.price || 0).toFixed(2))
        }))
      : [];
    return {
      id_producto,
      cantidad: Number(item.quantity),
      precio_unitario,
      opciones,
      notas_personalizacion: typeof item.comments === 'string' ? item.comments : null
    };
  });

  const payload = {
    id_mesa,
    items,
    notas_cliente: notasCliente,
    notas_cocina: notasCocina
  };
  // Debug: mostrar el payload que se enviará
  // eslint-disable-next-line no-console
  console.log('Enviando pedido a cocina:', payload);

  // Usar endpoint local, que puede ser proxy a backend externo
  const response = await fetch("/api/pedidos/completo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  let result: any = null;
  try {
    result = await response.json();
  } catch {
    result = await response.text();
  }
  if (!response.ok || (result && result.success === false)) {
    let msg = "Error al enviar pedido";
    if (typeof result === 'string') msg = result;
    else if (result?.error) msg = result.error;
    else if (result?.detail) msg = result.detail;
    else if (typeof result === 'object') msg = JSON.stringify(result);
    throw new Error(msg);
  }
  return result;
}

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface HistoryItem {
  id: string
  name: string
  quantity: number
  subtotal: number
  comments?: string
  additionals?: string[]
  date: string
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, total, clearCart, itemCount } = useCart()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [totalAccumulated, setTotalAccumulated] = useState(0)

  // Cargar historial desde localStorage al montar el componente
  useEffect(() => {
    const savedHistory = localStorage.getItem('orderHistory')
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as HistoryItem[]
      setHistory(parsedHistory)
      
      // Calcular monto acumulado
      const accumulated = parsedHistory.reduce((sum: number, item: HistoryItem) => sum + item.subtotal, 0)
      setTotalAccumulated(accumulated)
    }
  }, [])

  // Bloquear scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY
      // Bloquear scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      // Restaurar scroll
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Función para enviar el pedido a cocina y manejar historial/localStorage
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendOrder = async () => {
    if (cart.length === 0 || sending) return;
    setSendError(null);
    setSendSuccess(false);
    setSending(true);
    try {
      await sendOrderToKitchen({ cart });
      setSendSuccess(true);

      // Convertir items del carrito a items de historial
      const newHistoryItems: HistoryItem[] = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        subtotal: item.totalPrice,
        comments: item.comments || undefined,
        additionals: item.selectedOptions.length > 0 
          ? item.selectedOptions.map(opt => opt.name).sort()
          : undefined,
        date: new Date().toISOString()
      }));

      // Combinar con historial existente
      const updatedHistory = [...history, ...newHistoryItems];
      // Agrupar items idénticos (mismo nombre, adicionales y comentarios)
      const groupedHistory: HistoryItem[] = [];
      updatedHistory.forEach(item => {
        const existingIndex = groupedHistory.findIndex(grouped => {
          const sameBasics = grouped.name === item.name && grouped.comments === item.comments;
          const sameAdditionals = 
            (!grouped.additionals && !item.additionals) ||
            (grouped.additionals && item.additionals && 
             grouped.additionals.length === item.additionals.length &&
             grouped.additionals.every((add, idx) => add === item.additionals?.[idx]));
          return sameBasics && sameAdditionals;
        });
        if (existingIndex >= 0) {
          groupedHistory[existingIndex].quantity += item.quantity;
          groupedHistory[existingIndex].subtotal += item.subtotal;
          if (item.date > groupedHistory[existingIndex].date) {
            groupedHistory[existingIndex].date = item.date;
          }
        } else {
          groupedHistory.push({ ...item });
        }
      });
      // Guardar en localStorage
      localStorage.setItem('orderHistory', JSON.stringify(groupedHistory));
      setHistory(groupedHistory);
      // Calcular nuevo monto acumulado
      const newTotal = groupedHistory.reduce((sum, item) => sum + item.subtotal, 0);
      setTotalAccumulated(newTotal);
      // Limpiar el carrito
      clearCart();
    } catch (err: any) {
      setSendError(err?.message || 'Error al enviar pedido');
    } finally {
      setSending(false);
    }
  }

  // Función para verificar si se puede incrementar (límite por plato individual)
  const canIncrement = (itemId: string) => {
    const item = cart.find(item => item.id === itemId)
    return item ? item.quantity < 50 : true
  }

  // Función para convertir URL de Google Drive
  const convertGoogleDriveUrl = (url: string): string => {
    if (!url || url === 'null' || url === 'undefined' || !url.includes('drive.google.com')) {
      return '/placeholder-image.png'
    }
    
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)
    if (match) {
      const fileId = match[1]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    
    return url
  }

  return (
    <>
      {/* Overlay con efecto blur blanquecino */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-white/30 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[90%] max-w-[400px] md:w-[500px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header - título centrado */}
          <div className="bg-[#004166] text-white p-4 flex items-center justify-between relative">
            <div className="flex-1"></div>
            <h2 className="text-xl font-bold flex-1 text-center">Mi orden</h2>
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 relative"
              >
                <ShoppingCart className="!w-6 !h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full border-2 border-white text-white text-[10px] flex items-center justify-center font-bold leading-none">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y">
            <div className="px-3 pt-3 pb-3">
              <h3 className="text-base font-bold mb-3">Lista de pedidos</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-semibold text-gray-700">Sin artículos registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-start gap-2">
                        {/* Imagen del plato - tamaño fijo */}
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-gray-300/50">
                          <Image
                            src={convertGoogleDriveUrl(item.image)}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-image.png'
                            }}
                          />
                        </div>

                        {/* Info del plato */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold mb-0.5 line-clamp-1">{item.name}</h4>
                          
                          {/* Mostrar comentarios - solo si hay comentarios o no hay adicionales */}
                          {(item.comments && item.comments.trim() || item.selectedOptions.length === 0) && (
                            <p className="text-[10px] text-gray-500 mb-0.5 line-clamp-1">
                              Comentarios: {item.comments && item.comments.trim() ? item.comments : 'Sin comentarios'}
                            </p>
                          )}
                          
                          {/* Mostrar opciones adicionales si existen */}
                          {item.selectedOptions.length > 0 && (
                            <p className="text-[10px] text-gray-500 mb-0.5 line-clamp-1">
                              Adicionales: {item.selectedOptions.map(opt => opt.name).join(', ')}
                            </p>
                          )}

                          <p className="text-[10px] text-gray-600">
                            Precio unitario: S/{(item.basePrice + item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0)).toFixed(2)}
                          </p>

                          {!canIncrement(item.id) && (
                            <div className="flex items-center gap-1 mb-2">
                              <AlertTriangle className="w-3 h-3 text-orange-500" />
                              <span className="text-[10px] text-orange-600 font-medium">Límite alcanzado</span>
                            </div>
                          )}
                        </div>

                        {/* Controles de cantidad - tamaño fijo */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="flex items-center gap-1 bg-gray-200 rounded-lg px-1.5 py-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 p-0 text-sm font-bold hover:bg-gray-300 rounded-md"
                            >
                              -
                            </Button>
                            <span className="text-xs font-semibold min-w-[1rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => canIncrement(item.id) && updateQuantity(item.id, item.quantity + 1)}
                              disabled={!canIncrement(item.id)}
                              className={`w-5 h-5 p-0 text-sm font-bold rounded-md ${
                                !canIncrement(item.id) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                              }`}
                            >
                              +
                            </Button>
                          </div>
                          {/* Subtotal debajo de los botones */}
                          <p className="text-[10px] font-bold whitespace-nowrap">
                            Subtotal: S/ {item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                
              {/* Botón de envío después de la lista - siempre mostrar */}
              <div className="mt-3 flex flex-col items-center gap-2">
                <Button 
                  onClick={handleSendOrder}
                  className="w-[55%] bg-[#004166] hover:bg-[#003d5c] text-white py-3 text-base font-bold rounded-xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                  disabled={cart.length === 0 || sending}
                  aria-busy={sending}
                >
                  {sending ? 'Enviando...' : <>Enviar Pedido {cart.length > 0 && `S/ ${total.toFixed(2)}`}</>}
                </Button>
                {/*{sendSuccess && (
                  <span className="text-green-600 text-sm font-semibold">¡Pedido enviado correctamente!</span>
                )}
                {sendError && (
                  <span className="text-red-600 text-sm font-semibold">{sendError}</span>
                )}*/}
              </div>
                
              {/* Imagen decorativa del pescado */}
              <div className="flex justify-end mt-4 opacity-50">
                <div 
                  className="w-[75%] h-48 bg-[url('/pescado-inicio.jpg')] bg-no-repeat bg-right bg-contain"
                />
              </div>

              {/* Historial de pedido - con margen negativo para tapar al pescado */}
              <div className="-mt-12 mx-3 border border-gray-300 rounded-xl p-4 bg-white relative z-10">
                <h3 className="text-lg font-bold mb-3">Historial de pedido</h3>
                
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm font-semibold text-gray-700">Sin artículos registrados</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-600 mb-3">Hasta ahora has pedido:</p>
                    
                    {/* Lista de pedidos del historial */}
                    <div className="space-y-3">
                      {history.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex justify-between items-start pb-3 border-b last:border-b-0">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold mb-1">{item.name}</h4>
                            {item.additionals && item.additionals.length > 0 && (
                              <p className="text-xs text-gray-600">Adicionales: {item.additionals.join(", ")}</p>
                            )}
                            {item.comments && (
                              <p className="text-xs text-gray-600">Comentarios: {item.comments}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold mb-1">Cantidad: {item.quantity}</p>
                            <p className="text-xs font-bold">Subtotal: S/ {item.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Monto acumulado */}
                    <div className="mt-4 pt-3 border-t border-gray-300">
                      <p className="text-base font-bold text-center">
                        Monto acumulado: S/ {totalAccumulated.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Botón para borrar historial */}
                    {/*<div className="flex justify-end mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-3 py-1 border-gray-300"
                        onClick={() => {
                          localStorage.removeItem('orderHistory');
                          localStorage.removeItem('cart');
                          setHistory([]);
                          setTotalAccumulated(0);
                          clearCart();
                        }}
                      >
                        Borrar historial
                      </Button>
                    </div>*/}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}