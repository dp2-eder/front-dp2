"use client"

import { Check, Trash2 } from "lucide-react"
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
  onGroupsChange?: (groups: PaymentGroup[], paidGroupIds: string[]) => void
}

interface SelectedItem {
  name: string
  subtotal: number
  quantity: number
}

export function PaymentGroups({ orderHistory, onGroupsChange }: PaymentGroupsProps) {
  const [groupName, setGroupName] = useState("")
  const [groups, setGroups] = useState<PaymentGroup[]>([])
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [paidGroupIds, setPaidGroupIds] = useState<Set<string>>(new Set())

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

  // Agrupar items por nombre y subtotal
  const getGroupedAvailableItems = () => {
    const grouped: Record<string, OrderItem & { totalQuantity: number; allIds: string[] }> = {}

    orderHistory.forEach(item => {
      // Crear key única basada en nombre y subtotal
      const key = `${item.name}-${item.subtotal}`

      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          totalQuantity: 0,
          allIds: []
        }
      }

      grouped[key].totalQuantity += item.quantity
      grouped[key].allIds.push(item.id)
    })

    // Filtrar items que aún tengan cantidad disponible
    return Object.entries(grouped)
      .map(([, item]) => {
        // Calcular cuánto ha sido asignado a grupos ya creados
        const assignedInGroups = groups.reduce((sum, group) => {
          // Sumar TODOS los items del grupo que coincidan con este item agrupado
          const matchingItems = group.items.filter(i => item.allIds.includes(i.id))
          const groupTotal = matchingItems.reduce((qty, gi) => qty + gi.selectedQuantity, 0)
          return sum + groupTotal
        }, 0)

        return {
          ...item,
          availableQuantity: item.totalQuantity - assignedInGroups
        }
      })
      .filter(item => item.availableQuantity > 0)
  }

  const getMaxSelectableQuantity = (itemName: string, itemSubtotal: number) => {
    const grouped = getGroupedAvailableItems()
    const item = grouped.find(i => i.name === itemName && i.subtotal === itemSubtotal)
    return item?.availableQuantity || 0
  }

  const handleItemQuantityChange = (itemName: string, itemSubtotal: number, quantity: number) => {
    if (quantity < 0) return

    // Obtener la cantidad actualmente seleccionada de este item
    const currentQuantity = selectedItems.find(si => si.name === itemName && si.subtotal === itemSubtotal)?.quantity || 0

    // Obtener el máximo disponible
    const maxSelectable = getMaxSelectableQuantity(itemName, itemSubtotal)

    // Si es un item que ya estoy modificando, permitir cambiar hasta maxSelectable + currentQuantity
    // Si es un item nuevo, permitir seleccionar hasta maxSelectable
    const maxAllowed = currentQuantity > 0 ? maxSelectable + currentQuantity : maxSelectable

    if (quantity > maxAllowed) return

    setSelectedItems(prev => {
      const index = prev.findIndex(item => item.name === itemName && item.subtotal === itemSubtotal)

      if (index >= 0) {
        // Update existing item
        const newItems = [...prev]
        newItems[index].quantity = quantity
        return newItems
      } else if (quantity > 0) {
        // Add new item
        return [...prev, { name: itemName, subtotal: itemSubtotal, quantity }]
      }

      return prev
    })
  }

  const handleCreateGroup = () => {
    if (!groupName.trim()) return

    const newGroupItems: Array<OrderItem & { selectedQuantity: number }> = []

    // Procesar cada item seleccionado (agrupado)
    selectedItems.forEach(({ name: itemName, subtotal: itemSubtotal, quantity: selectedQuantity }) => {
      if (selectedQuantity <= 0) return

      // Encontrar todos los items originales con este nombre y subtotal
      const matchingItems = orderHistory.filter(
        item => item.name === itemName && item.subtotal === itemSubtotal
      )

      // Distribuir la cantidad seleccionada entre los items originales
      let remainingQty = selectedQuantity
      matchingItems.forEach(item => {
        if (remainingQty > 0) {
          const qtyToTake = Math.min(remainingQty, item.quantity)

          // Calcular cuánto ya fue asignado a otros grupos para este item
          const alreadyAssigned = groups.reduce((sum, group) => {
            const groupItem = group.items.find(gi => gi.id === item.id)
            return sum + (groupItem?.selectedQuantity || 0)
          }, 0)

          const availableForThisItem = item.quantity - alreadyAssigned
          const actualQtyToTake = Math.min(qtyToTake, availableForThisItem)

          if (actualQtyToTake > 0) {
            newGroupItems.push({
              ...item,
              selectedQuantity: actualQtyToTake
            })
            remainingQty -= actualQtyToTake
          }
        }
      })
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
    setSelectedItems([])
    onGroupsChange?.(updatedGroups, Array.from(paidGroupIds))
  }

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter(g => g.id !== groupId)
    setGroups(updatedGroups)
    // Remover el ID del grupo de los pagados
    const newPaidGroupIds = new Set(paidGroupIds)
    newPaidGroupIds.delete(groupId)
    setPaidGroupIds(newPaidGroupIds)
    onGroupsChange?.(updatedGroups, Array.from(newPaidGroupIds))
  }

  const handleTogglePaid = (groupId: string) => {
    const newPaidGroupIds = new Set(paidGroupIds)
    if (newPaidGroupIds.has(groupId)) {
      newPaidGroupIds.delete(groupId)
    } else {
      newPaidGroupIds.add(groupId)
    }
    setPaidGroupIds(newPaidGroupIds)
    onGroupsChange?.(groups, Array.from(newPaidGroupIds))
  }

  const availableItems = getGroupedAvailableItems()

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
              const itemKey = `${item.name}-${item.subtotal}`
              const selectedQty = selectedItems.find(si => si.name === item.name && si.subtotal === item.subtotal)?.quantity || 0
              const maxSelectable = getMaxSelectableQuantity(item.name, item.subtotal)

              return (
                <div key={itemKey} className="border-b pb-4 last:border-b-0">
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
                      <p className="text-xs text-gray-600">Disponibles: {maxSelectable}</p>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-2 py-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleItemQuantityChange(item.name, item.subtotal, selectedQty - 1)}
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
                          onClick={() => handleItemQuantityChange(item.name, item.subtotal, selectedQty + 1)}
                          disabled={selectedQty >= maxSelectable}
                          className="w-6 h-6 p-0 text-sm font-bold rounded disabled:opacity-50"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Button
          onClick={handleCreateGroup}
          disabled={selectedItems.every(item => item.quantity === 0) || !groupName.trim()}
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
            {groups.map((group) => {
              const isPaid = paidGroupIds.has(group.id)
              return (
                <div
                  key={group.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isPaid
                      ? "border-gray-400 bg-gray-100"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className={`text-base font-bold ${isPaid ? "text-gray-500" : ""}`}>
                      {group.name}
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTogglePaid(group.id)}
                        className={`w-10 h-10 md:w-8 md:h-8 p-0 ${
                          isPaid
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        <Check className="w-5 h-5 md:w-4 md:h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteGroup(group.id)}
                        className="w-10 h-10 md:w-8 md:h-8 p-0 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {(() => {
                      // Agrupar items por nombre y sumar cantidades
                      const groupedByName: Record<string, number> = {}
                      group.items.forEach(item => {
                        groupedByName[item.name] = (groupedByName[item.name] || 0) + item.selectedQuantity
                      })

                      return Object.entries(groupedByName).map(([name, totalQty]) => (
                        <p
                          key={`${group.id}-${name}`}
                          className={`text-xs ${isPaid ? "text-gray-500" : "text-gray-700"}`}
                        >
                          {name} <span className="font-semibold">(x{totalQty})</span>
                        </p>
                      ))
                    })()}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className={`text-sm font-bold ${isPaid ? "text-gray-500" : ""}`}>
                      Subtotal: S/ {group.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
