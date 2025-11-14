"use client"

import { LogIn } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { ImmediatePayment } from "@/components/payment/immediate-payment"
import { PaymentGroups } from "@/components/payment/payment-groups"
import { PaymentModeSelector } from "@/components/payment/payment-mode-selector"
import { SplitBill } from "@/components/payment/split-bill"
import { Button } from "@/components/ui/button"
import { useOrderHistory } from "@/context/order-history-context"
import { OrderHistoryItem, PaymentGroup } from "@/types/orders"

const POLLING_INTERVAL = 10000 // 10 segundos

export default function PagoPage() {
  const [paymentMode, setPaymentMode] = useState("pago-inmediato")
  const { historial, fetchHistorial } = useOrderHistory()
  const [peopleCount, setPeopleCount] = useState(2)
  const [paidGroupIds, setPaidGroupIds] = useState<string[]>([])
  const [groups, setGroups] = useState<PaymentGroup[]>([])
  const [productImages, setProductImages] = useState<Record<string, string>>({})

  // Cargar mapeo de imágenes y estado persistente desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Cargar imágenes
      const savedImages = localStorage.getItem('productImages')
      if (savedImages) {
        try {
          setProductImages(JSON.parse(savedImages) as Record<string, string>)
        } catch (error) {
          //console.error('Error al cargar imágenes:', error)
        }
      }

      // Cargar modo de pago
      const savedPaymentMode = localStorage.getItem('paymentMode')
      if (savedPaymentMode) {
        setPaymentMode(savedPaymentMode)
      }

      // Cargar configuración de partes iguales
      const savedPeopleCount = localStorage.getItem('paymentConfig_peopleCount')
      if (savedPeopleCount) {
        setPeopleCount(parseInt(savedPeopleCount, 10))
      }

      // Cargar configuración de grupos de pago
      const savedGroups = localStorage.getItem('paymentConfig_groups')
      const savedPaidGroupIds = localStorage.getItem('paymentConfig_paidGroupIds')
      if (savedGroups) {
        try {
          setGroups(JSON.parse(savedGroups) as PaymentGroup[])
        } catch (error) {
          //console.error('Error al cargar grupos:', error)
        }
      }
      if (savedPaidGroupIds) {
        try {
          setPaidGroupIds(JSON.parse(savedPaidGroupIds) as string[])
        } catch (error) {
          //console.error('Error al cargar IDs pagados:', error)
        }
      }
    }
  }, [])

  // Calcular monto acumulado del historial
  const totalAccumulated = historial.reduce((sum, pedido) => {
    return sum + parseFloat(pedido.total || "0")
  }, 0)

  // Convertir historial a formato compatible con PaymentGroups
  const orderHistory: OrderHistoryItem[] = historial.flatMap(pedido =>
    pedido.productos.map(producto => {
      // Obtener el ID base del producto para buscar la imagen
      const productId = String(producto.id_producto || producto.id).split("-")[0]
      const imageUrl = productImages[productId] || producto.imagen_path || undefined

      return {
        id: producto.id,
        name: producto.nombre_producto,
        quantity: producto.cantidad,
        subtotal: parseFloat(producto.subtotal || "0"),
        additionals: producto.opciones.map(op => op.nombre_opcion),
        comments: producto.notas_personalizacion,
        image: imageUrl,
        date: pedido.fecha_creacion,
        pedidoId: pedido.id
      }
    })
  )

  // Guardar modo de pago en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && paymentMode) {
      try {
        localStorage.setItem('paymentMode', paymentMode)
      } catch (error) {
        console.error('Error al guardar modo de pago:', error)
      }
    }
  }, [paymentMode])

  // Guardar configuración de partes iguales con debounce
  useEffect(() => {
    if (typeof window !== 'undefined' && peopleCount > 0) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('paymentConfig_peopleCount', String(peopleCount))
        } catch (error) {
          console.error('Error al guardar peopleCount:', error)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [peopleCount])

  // Guardar configuración de grupos de pago con debounce para evitar guardados excesivos
  useEffect(() => {
    if (typeof window !== 'undefined' && groups.length > 0) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('paymentConfig_groups', JSON.stringify(groups))
          localStorage.setItem('paymentConfig_paidGroupIds', JSON.stringify(paidGroupIds))
        } catch (error) {
          console.error('Error al guardar grupos:', error)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [groups, paidGroupIds])

  // Cargar historial al montar y configurar polling
  useEffect(() => {
    const tokenSesion = localStorage.getItem("token_sesion")
    if (!tokenSesion) return

    // Cargar historial inicial (fetch manual, no polling)
    void fetchHistorial(tokenSesion, false)

    // Configurar polling cada 10 segundos (indicar que es polling)
    const pollingInterval = setInterval(() => {
      void fetchHistorial(tokenSesion, true)
    }, POLLING_INTERVAL)

    // Cleanup: detener polling al desmontar la página
    return () => {
      clearInterval(pollingInterval)
    }
  }, [fetchHistorial])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showFullNavigation={true} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 pb-20 md:pb-24">
          {/* Back button */}
          <Link href="/about" className="flex items-center gap-2 mb-6">
            <LogIn className="w-7 h-7" style={{ transform: 'scaleX(-1)' }} />
          </Link>

          {/* Page title */}
          {/*
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitar Cobro</h1>
            <p className="text-gray-600">Monto acumulado: <span className="font-bold">S/ {totalAccumulated.toFixed(2)}</span></p>
          </div>
            */}
          {orderHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No tienes pedidos para cobrar</p>
              <Link href="/">
                <Button className="bg-[#004166] hover:bg-[#003d5c] text-white">
                  Volver al menú
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Mode Selector */}
              <PaymentModeSelector value={paymentMode} onChange={setPaymentMode} />

              {/* Conditional components based on payment mode */}
              {paymentMode === "partes-iguales" && (
                <SplitBill
                  totalAmount={totalAccumulated}
                  peopleCount={peopleCount}
                  onPeopleCountChange={setPeopleCount}
                />
              )}

              {paymentMode === "grupos-pago" && (
                <>
                  <PaymentGroups
                    orderHistory={orderHistory}
                    initialGroups={groups}
                    initialPaidGroupIds={paidGroupIds}
                    onGroupsChange={(updatedGroups, updatedPaidGroupIds) => {
                      setGroups(updatedGroups)
                      setPaidGroupIds(updatedPaidGroupIds)
                    }}
                  />

                  {/* Monto pendiente por pagar */}
                  {(() => {
                    const paidTotal = groups.reduce((sum, group) => {
                      if (paidGroupIds.includes(group.id)) {
                        return sum + group.subtotal
                      }
                      return sum
                    }, 0)
                    const pendingAmount = totalAccumulated - paidTotal

                    return (
                      <div className="border border-gray-300 rounded-xl p-6 bg-white">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Monto pendiente por pagar</p>
                          <p className={`text-4xl font-bold ${pendingAmount > 0 ? "text-red-600" : "text-green-600"}`}>
                            S/ {pendingAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })()}
                </>
              )}

              {paymentMode === "pago-inmediato" && (
                <ImmediatePayment totalAmount={totalAccumulated} />
              )}

              {/* Action buttons */}
              { /*
              <div className="flex gap-3 pb-6">
                <Link href="/about" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 py-3 font-bold rounded-lg"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  className="flex-1 bg-[#004166] hover:bg-[#003d5c] text-white py-3 font-bold rounded-lg"
                >
                  Confirmar Cobro
                </Button>
              </div>
              */}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
