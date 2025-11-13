"use client"

interface ImmediatePaymentProps {
  totalAmount: number
}

export function ImmediatePayment({ totalAmount }: ImmediatePaymentProps) {
  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white">
      <h3 className="text-lg font-bold mb-4">Monto total a pagar</h3>

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 mb-2">El monto total es:</p>
        <p className="text-4xl font-bold text-[#004166]">S/ {totalAmount.toFixed(2)}</p>
      </div>
    </div>
  )
}
