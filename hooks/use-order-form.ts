"use client"

import { useState, useCallback, useMemo } from "react"
import type { MenuItem, OrderItem } from "@/lib/types"

interface UseOrderFormProps {
  initialItems?: OrderItem[]
  initialTable?: string
  initialWaiter?: string
  initialNote?: string
}

export function useOrderForm({
  initialItems = [],
  initialTable = "",
  initialWaiter = "",
  initialNote = "",
}: UseOrderFormProps = {}) {
  const [selectedTable, setSelectedTable] = useState(initialTable)
  const [selectedWaiter, setSelectedWaiter] = useState(initialWaiter)
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialItems)
  const [specialNote, setSpecialNote] = useState(initialNote)

  const addToOrder = useCallback((menuItem: MenuItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.menuItemId === menuItem.id)
      if (existingItem) {
        return prev.map((item) => (item.menuItemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          quantity: 1,
          price: menuItem.price,
          specialInstructions: "",
        },
      ]
    })
  }, [])

  const removeFromOrder = useCallback((menuItemId: string) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.menuItemId === menuItemId)
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity: item.quantity - 1 } : item))
      }
      return prev.filter((item) => item.menuItemId !== menuItemId)
    })
  }, [])

  const getItemQuantity = useCallback(
    (menuItemId: string) => {
      const item = orderItems.find((item) => item.menuItemId === menuItemId)
      return item?.quantity || 0
    },
    [orderItems],
  )

  const totalAmount = useMemo(() => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [orderItems])

  const resetForm = useCallback(() => {
    setSelectedTable("")
    setSelectedWaiter("")
    setOrderItems([])
    setSpecialNote("")
  }, [])

  const isValid = useMemo(() => {
    return selectedTable && selectedWaiter && orderItems.length > 0
  }, [selectedTable, selectedWaiter, orderItems.length])

  return {
    // State
    selectedTable,
    selectedWaiter,
    orderItems,
    specialNote,
    totalAmount,
    isValid,

    // Actions
    setSelectedTable,
    setSelectedWaiter,
    setSpecialNote,
    addToOrder,
    removeFromOrder,
    getItemQuantity,
    resetForm,
  }
}
