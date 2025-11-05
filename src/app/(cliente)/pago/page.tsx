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

interface OrderHistoryItem {
  id: string
  name: string
  quantity: number
  subtotal: number
  additionals?: string[]
  comments?: string
  image?: string
  date: string
}

interface PaymentGroup {
  id: string
  name: string
  subtotal: number
}

export default function PagoPage() {
  const [paymentMode, setPaymentMode] = useState("partes-iguales")
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([])
  const [totalAccumulated, setTotalAccumulated] = useState(0)
  const [peopleCount, setPeopleCount] = useState(2)
  const [paidGroupIds, setPaidGroupIds] = useState<string[]>([])
  const [groups, setGroups] = useState<PaymentGroup[]>([])

  // Cargar historial desde localStorage al montar el componente
  useEffect(() => {
    const savedHistory = localStorage.getItem('orderHistory')
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory) as OrderHistoryItem[]
      setOrderHistory(parsedHistory)

      // Calcular monto acumulado
      const accumulated = parsedHistory.reduce((sum: number, item: OrderHistoryItem) => sum + item.subtotal, 0)
      setTotalAccumulated(accumulated)
    }
  }, [])

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
