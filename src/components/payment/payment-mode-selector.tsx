"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PaymentModeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function PaymentModeSelector({ value, onChange }: PaymentModeSelectorProps) {
  const modes = [
    { id: "pago-inmediato", label: "Pago inmediato" },
    { id: "partes-iguales", label: "Partes iguales" },
    { id: "grupos-pago", label: "Grupos de pago" },
  ]

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white">
      <h3 className="text-lg font-bold mb-2">Selecciona la opción de pago</h3>
      <p className="text-sm text-gray-600 mb-4">Solo puedes elegir una de las opciones</p>

      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {modes.map((mode) => (
          <div key={mode.id} className="flex items-center space-x-3 pb-3 border-b last:border-b-0">
            <RadioGroupItem value={mode.id} id={mode.id} />
            <Label htmlFor={mode.id} className="text-base font-medium cursor-pointer m-0">
              {mode.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
