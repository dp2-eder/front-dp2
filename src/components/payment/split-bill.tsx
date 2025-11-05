"use client"

import { Button } from "@/components/ui/button"

interface SplitBillProps {
  totalAmount: number
  peopleCount: number
  onPeopleCountChange: (count: number) => void
}

export function SplitBill({ totalAmount, peopleCount, onPeopleCountChange }: SplitBillProps) {
  const perPersonAmount = peopleCount > 0 ? totalAmount / peopleCount : 0

  const handleDecrement = () => {
    if (peopleCount > 1) {
      onPeopleCountChange(peopleCount - 1)
    }
  }

  const handleIncrement = () => {
    onPeopleCountChange(peopleCount + 1)
  }

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white">
      <h3 className="text-lg font-bold mb-2">¿Dividimos la cuenta?</h3>
      <p className="text-sm text-gray-600 mb-4">Ingresa la cantidad de personas para dividir el total</p>

      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-700">Cantidad de personas:</span>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 flex items-center justify-center"
            onClick={handleDecrement}
          >
            -
          </Button>
          <span className="text-lg font-bold w-8 text-center">{peopleCount}</span>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 flex items-center justify-center"
            onClick={handleIncrement}
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
        <span className="text-gray-700 font-medium">Total de la orden</span>
        <span className="text-lg font-bold">S/{totalAmount.toFixed(2)}</span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">El monto a pagar por persona es:</p>
        <p className="text-3xl font-bold text-[#004166]">S/ {perPersonAmount.toFixed(2)}</p>
      </div>
    </div>
  )
}
