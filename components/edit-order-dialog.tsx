"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Clock, Edit } from "lucide-react"
import { mockMenuItems, mockUsers, updateOrder } from "@/lib/mock-data"
import { useOrderForm } from "@/hooks/use-order-form"
import type { Order } from "@/lib/types"

interface EditOrderDialogProps {
  order: Order
}

export function EditOrderDialog({ order }: EditOrderDialogProps) {
  const [estimatedTime, setEstimatedTime] = useState(30)
  const [open, setOpen] = useState(false)

  const orderForm = useOrderForm({
    initialItems: order.items,
    initialTable: order.tableNumber.toString(),
    initialWaiter: order.waiterId,
  })

  const waiters = mockUsers.filter((user) => user.role === "waiter")

  const updateEstimatedTime = () => {
    const totalTime = orderForm.orderItems.reduce((time, item) => {
      const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
      const dishTime =
        menuItem?.category === "appetizers"
          ? 10
          : menuItem?.category === "mains"
            ? 25
            : menuItem?.category === "desserts"
              ? 15
              : 20
      return time + dishTime * item.quantity * 0.8
    }, 0)
    setEstimatedTime(Math.max(15, Math.ceil(totalTime)))
  }

  const handleUpdateOrder = () => {
    if (!orderForm.isValid) {
      alert("Please fill in all required fields and add at least one item.")
      return
    }

    const updatedOrder: Order = {
      ...order,
      tableNumber: Number.parseInt(orderForm.selectedTable),
      waiterId: orderForm.selectedWaiter,
      items: orderForm.orderItems,
      totalAmount: orderForm.totalAmount,
      estimatedTime: estimatedTime,
      updatedAt: new Date().toISOString(),
    }

    updateOrder(updatedOrder)
    setOpen(false)
    alert("Order updated successfully!")
  }

  const handleReset = () => {
    orderForm.resetForm()
    setEstimatedTime(30)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen min-w-full max-w-none max-h-[95vh] overflow-y-auto m-0">
        <DialogHeader>
          <DialogTitle>Edit Order #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="table">Table Number</Label>
              <Select value={orderForm.selectedTable} onValueChange={orderForm.setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((table) => (
                    <SelectItem key={table} value={table.toString()}>
                      Table {table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waiter">Waiter</Label>
              <Select value={orderForm.selectedWaiter} onValueChange={orderForm.setSelectedWaiter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waiter" />
                </SelectTrigger>
                <SelectContent>
                  {waiters.map((waiter) => (
                    <SelectItem key={waiter.id} value={waiter.id}>
                      {waiter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimated-time">Estimated Time (minutes)</Label>
              <Input
                id="estimated-time"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number.parseInt(e.target.value) || 30)}
                min="5"
                max="120"
              />
            </div>

            {/* Current Order Summary */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Order Summary
                </h3>
                {orderForm.orderItems.length === 0 ? (
                  <p className="text-muted-foreground">No items in order</p>
                ) : (
                  <div className="space-y-2">
                    {orderForm.orderItems.map((item) => {
                      const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
                      return (
                        <div key={item.menuItemId} className="flex justify-between items-center">
                          <span className="text-sm">
                            {item.quantity}x {menuItem?.name}
                          </span>
                          <span className="text-sm font-medium">
                            ${((menuItem?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${orderForm.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Estimated time: {estimatedTime} minutes
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleUpdateOrder} className="flex-1">
                Update Order
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4">Menu Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
              {mockMenuItems.map((item) => {
                const quantity = orderForm.getItemQuantity(item.id)

                return (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant={item.available ? "default" : "secondary"} className="text-xs px-1 py-0">
                            {item.available ? "✓" : "✗"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => orderForm.removeFromOrder(item.id)}
                            disabled={quantity === 0}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => orderForm.addToOrder(item)}
                            className="h-8 w-8 p-0"
                            disabled={!item.available}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
