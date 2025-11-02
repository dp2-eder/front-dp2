"use client"

import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OrderItem {
  id: string
  name: string
  quantity: number
  subtotal: number
  image?: string
  additionals?: string[]
  comments?: string
}

interface PaymentGroup {
  id: string
  name: string
  items: Array<OrderItem & { selectedQuantity: number }>
  subtotal: number
}

interface PaymentGroupsProps {
  orderHistory: OrderItem[]
  onGroupsChange?: (groups: PaymentGroup[]) => void
}

export function PaymentGroups({ orderHistory, onGroupsChange }: PaymentGroupsProps) {
  const [groupName, setGroupName] = useState("")
  const [groups, setGroups] = useState<PaymentGroup[]>([])
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({})

  // Función para convertir URL de Google Drive
  const convertGoogleDriveUrl = (url?: string): string => {
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

  const getAvailableItems = () => {
    return orderHistory.filter(item => {
      // Calcular cuánto ha sido asignado a grupos
      const assignedInGroups = groups.reduce((sum, group) => {
        const groupItem = group.items.find(i => i.id === item.id)
        return sum + (groupItem?.selectedQuantity || 0)
      }, 0)

      // El item está disponible si aún tiene cantidad no asignada
      return assignedInGroups < item.quantity
    })
  }

  const getMaxSelectableQuantity = (itemId: string) => {
    const item = orderHistory.find(i => i.id === itemId)
    if (!item) return 0

    // Cuánto ha sido asignado a grupos
    const assignedInGroups = groups.reduce((sum, group) => {
      const groupItem = group.items.find(i => i.id === itemId)
      return sum + (groupItem?.selectedQuantity || 0)
    }, 0)

    // Máximo que se puede seleccionar es lo que no ha sido asignado
    return item.quantity - assignedInGroups
  }

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    const maxSelectable = getMaxSelectableQuantity(itemId)

    if (quantity < 0 || quantity > maxSelectable) return

    setSelectedItems(prev => ({
      ...prev,
      [itemId]: quantity
    }))
  }

  const handleCreateGroup = () => {
    if (!groupName.trim()) return

    const newGroupItems = Object.entries(selectedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, selectedQuantity]) => {
        const item = orderHistory.find(i => i.id === itemId)
        return {
          ...(item as OrderItem),
          selectedQuantity
        }
      })

    if (newGroupItems.length === 0) return

    const subtotal = newGroupItems.reduce((sum, item) => {
      return sum + (item.subtotal * item.selectedQuantity / item.quantity)
    }, 0)

    const newGroup: PaymentGroup = {
      id: Date.now().toString(),
      name: groupName,
      items: newGroupItems,
      subtotal
    }

    const updatedGroups = [...groups, newGroup]
    setGroups(updatedGroups)
    setGroupName("")
    setSelectedItems({})
    onGroupsChange?.(updatedGroups)
  }

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter(g => g.id !== groupId)
    setGroups(updatedGroups)
    onGroupsChange?.(updatedGroups)
  }

  const availableItems = getAvailableItems()

  return (
    <div className="space-y-4">
      {/* Card para crear grupo de pago */}
      <div className="border border-gray-300 rounded-xl p-6 bg-white">
        <h3 className="text-lg font-bold mb-4">Crea tu grupo de pago</h3>

        <Input
          placeholder="Asigna un nombre al grupo de pago*"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mb-4 py-2 px-3"
        />

        {availableItems.length === 0 ? (
          <div className="text-center py-6 text-gray-600">
            <p className="text-sm">Sin platillos disponibles para añadir a los grupos de pago</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {availableItems.map((item) => {
              const selectedQty = selectedItems[item.id] || 0
              const maxSelectable = getMaxSelectableQuantity(item.id)

              return (
                <div key={item.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex gap-4">
                    {/* Imagen del plato */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={convertGoogleDriveUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info del plato */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">
                        Precio unitario: S/{(item.subtotal / item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">Cantidad solicitada: {maxSelectable}</p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-2 py-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleItemQuantityChange(item.id, selectedQty - 1)}
                          className="w-6 h-6 p-0 text-sm font-bold hover:bg-gray-300 rounded"
                        >
                          -
                        </Button>
                        <span className="text-xs font-semibold min-w-[1.5rem] text-center">
                          {selectedQty}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleItemQuantityChange(item.id, selectedQty + 1)}
                          disabled={selectedQty >= maxSelectable}
                          className="w-6 h-6 p-0 text-sm font-bold rounded disabled:opacity-50"
                        >
                          +
                        </Button>
                      </div>
                      {/* 
                      <p className="text-xs text-gray-600 text-right mt-1">
                        Solicitado: {item.quantity}
                      </p>
                      */}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Button
          onClick={handleCreateGroup}
          disabled={Object.values(selectedItems).every(qty => qty === 0) || !groupName.trim()}
          className="w-full bg-[#004166] hover:bg-[#003d5c] text-white py-3 font-bold rounded-lg"
        >
          Crear grupo de pago
        </Button>
      </div>

      {/* Card de grupos creados */}
      <div className="border border-gray-300 rounded-xl p-6 bg-white">
        <h3 className="text-lg font-bold mb-4">Grupos de pago actuales</h3>

        {groups.length === 0 ? (
          <div className="text-center py-6 text-gray-600">
            <p className="text-sm">Sin grupos de pago actualmente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-base font-bold">{group.name}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteGroup(group.id)}
                    className="w-8 h-8 p-0 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-3">
                  {group.items.map((item) => (
                    <p key={`${group.id}-${item.id}`} className="text-xs text-gray-700">
                      {item.name} <span className="font-semibold">(x{item.selectedQuantity})</span>
                    </p>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-bold">
                    Subtotal: S/ {group.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
