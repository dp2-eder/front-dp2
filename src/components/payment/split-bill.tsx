"use client"

import { Button } from "@/components/ui/button"

interface SplitBillProps {
  totalAmount: number
  peopleCount: number
  onPeopleCountChange: (count: number) => void
}

export function SplitBill({ totalAmount, peopleCount, onPeopleCountChange }: SplitBillProps) {
  // Método de redondeo progresivo: la mayoría paga redondeado hacia abajo,
  // la última persona paga la diferencia para que el total sea exacto
  const calculateSplitAmounts = () => {
    if (peopleCount === 0) {
      return { baseAmount: 0, lastPersonAmount: 0 }
    }

    const baseAmount = Math.floor((totalAmount * 100) / peopleCount) / 100
    const amountForMost = baseAmount

    // Calcular cuánto pagan los primeros (peopleCount - 1)
    const amountForFirstPeople = amountForMost * (peopleCount - 1)

    // La última persona paga la diferencia para que el total sea exacto
    const lastPersonAmount = Math.round((totalAmount - amountForFirstPeople) * 100) / 100

    return { baseAmount: amountForMost, lastPersonAmount }
  }

  const { baseAmount, lastPersonAmount } = calculateSplitAmounts()

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

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-4 text-center">Monto a pagar por persona:</p>

        {peopleCount === 1 ? (
          <div className="text-center">
            <p className="text-3xl font-bold text-[#004166]">S/ {totalAmount.toFixed(2)}</p>
          </div>
        ) : baseAmount === lastPersonAmount ? (
          // Si son iguales, mostrar un solo monto
          <div className="text-center">
            <p className="text-3xl font-bold text-[#004166]">S/ {baseAmount.toFixed(2)}</p>
          </div>
        ) : (
          // Si son diferentes, mostrar ambos
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
              <span className="text-sm text-gray-600">{peopleCount - 1} personas pagan:</span>
              <span className="font-bold text-[#004166]">S/ {baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded border border-blue-200 bg-blue-50">
              <span className="text-sm text-gray-600">Última persona paga:</span>
              <span className="font-bold text-[#0B4F6C]">S/ {lastPersonAmount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Total exacto: S/ {(baseAmount * (peopleCount - 1) + lastPersonAmount).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
