import { renderHook, act } from "@testing-library/react"
import { useOrderForm } from "./use-order-form"
import type { MenuItem, OrderItem } from "@/lib/types"

const mockMenuItem: MenuItem = {
  id: "1",
  name: "Cheeseburger",
  description: "A classic cheeseburger",
  price: 10.99,
  category: "Burgers",
  imageUrl: "",
  isUnavailable: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockMenuItem2: MenuItem = {
  id: "2",
  name: "Fries",
  description: "Crispy fries",
  price: 3.99,
  category: "Sides",
  imageUrl: "",
  isUnavailable: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe("useOrderForm", () => {
  it("should have a valid initial state", () => {
    const { result } = renderHook(() => useOrderForm())

    expect(result.current.selectedTable).toBe("")
    expect(result.current.selectedWaiter).toBe("")
    expect(result.current.orderItems).toEqual([])
    expect(result.current.specialNote).toBe("")
    expect(result.current.totalAmount).toBe(0)
    expect(result.current.isValid).toBe(false)
  })

  it("should add an item to the order", () => {
    const { result } = renderHook(() => useOrderForm())

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    expect(result.current.orderItems).toHaveLength(1)
    expect(result.current.orderItems[0].menuItemId).toBe("1")
    expect(result.current.orderItems[0].quantity).toBe(1)
    expect(result.current.totalAmount).toBe(10.99)
  })

  it("should increase the quantity of an existing item", () => {
    const { result } = renderHook(() => useOrderForm())

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    expect(result.current.orderItems).toHaveLength(1)
    expect(result.current.orderItems[0].quantity).toBe(2)
    expect(result.current.totalAmount).toBe(21.98)
  })

  it("should remove an item from the order", () => {
    const { result } = renderHook(() => useOrderForm())

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    act(() => {
      result.current.removeFromOrder(mockMenuItem.id)
    })

    expect(result.current.orderItems).toHaveLength(0)
    expect(result.current.totalAmount).toBe(0)
  })

  it("should decrease the quantity of an existing item", () => {
    const { result } = renderHook(() => useOrderForm())

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    act(() => {
      result.current.removeFromOrder(mockMenuItem.id)
    })

    expect(result.current.orderItems).toHaveLength(1)
    expect(result.current.orderItems[0].quantity).toBe(1)
    expect(result.current.totalAmount).toBe(10.99)
  })

  it("should get the correct item quantity", () => {
    const { result } = renderHook(() => useOrderForm())

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    expect(result.current.getItemQuantity(mockMenuItem.id)).toBe(2)
    expect(result.current.getItemQuantity("non-existent-id")).toBe(0)
  })

  it("should calculate the total amount correctly", () => {
    const { result } = renderHook(() => useOrderForm())

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })

    act(() => {
      result.current.addToOrder(mockMenuItem2)
    })

    expect(result.current.totalAmount).toBe(14.98)
  })

  it("should reset the form", () => {
    const { result } = renderHook(() => useOrderForm())

    act(() => {
      result.current.setSelectedTable("Table 1")
      result.current.setSelectedWaiter("Waiter 1")
      result.current.addToOrder(mockMenuItem)
      result.current.setSpecialNote("Extra cheese")
    })

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.selectedTable).toBe("")
    expect(result.current.selectedWaiter).toBe("")
    expect(result.current.orderItems).toEqual([])
    expect(result.current.specialNote).toBe("")
    expect(result.current.totalAmount).toBe(0)
  })

  it("should validate the form", () => {
    const { result } = renderHook(() => useOrderForm())

    expect(result.current.isValid).toBe(false)

    act(() => {
      result.current.setSelectedTable("Table 1")
    })
    expect(result.current.isValid).toBe(false)

    act(() => {
      result.current.setSelectedWaiter("Waiter 1")
    })
    expect(result.current.isValid).toBe(false)

    act(() => {
      result.current.addToOrder(mockMenuItem)
    })
    expect(result.current.isValid).toBe(true)
  })
})
