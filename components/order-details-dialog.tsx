"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, User, MapPin, DollarSign, Edit } from "lucide-react"
import { mockMenuItems, mockUsers, mockTables } from "@/lib/mock-data"
import type { Order } from "@/lib/types"
import { EditOrderDialog } from "./edit-order-dialog"

interface OrderDetailsDialogProps {
  order: Order
  children: React.ReactNode
  editable?: boolean
}

export function OrderDetailsDialog({ order, children, editable = true }: OrderDetailsDialogProps) {
  const [open, setOpen] = useState(false)

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "served":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getWaiterName = (waiterId: string) => {
    const waiter = mockUsers.find((user) => user.id === waiterId)
    return waiter?.name || "Unknown"
  }

  const getTableInfo = (tableNumber: number) => {
    const table = mockTables.find((t) => t.number === tableNumber)
    return table || { number: tableNumber, capacity: 0, status: "available" }
  }

  const getOrderItems = () => {
    return order.items.map((item) => {
      const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
      return {
        ...item,
        menuItem: menuItem || { name: "Unknown Item", price: 0, category: "unknown" },
      }
    })
  }

  const orderItems = getOrderItems()
  const tableInfo = getTableInfo(order.tableNumber)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - #{order.id}</span>
            <Badge className={getStatusColor(order.status)} variant="outline">
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Table {order.tableNumber} (Capacity: {tableInfo.capacity})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Waiter: {getWaiterName(order.waiterId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Ordered: {new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total: ${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              {order.specialInstructions && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Special Instructions:</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{order.specialInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.menuItem.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{item.menuItem.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {item.quantity}</p>
                      <p className="text-sm text-muted-foreground">${item.menuItem.price.toFixed(2)} each</p>
                      <p className="font-medium">${(item.quantity * item.menuItem.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            {editable && (
              <EditOrderDialog order={order}>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Order
                </Button>
              </EditOrderDialog>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
