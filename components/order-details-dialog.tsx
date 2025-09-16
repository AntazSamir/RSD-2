"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, User, MapPin, DollarSign, Edit, Calendar, Undo2, X } from "lucide-react"
import { mockMenuItems, mockUsers, mockTables, cancelOrder } from "@/lib/mock-data"
import type { Order } from "@/lib/types"
import { EditOrderDialog } from "./edit-order-dialog"
import { NewOrderDialog } from "./new-order-dialog"
import { LoadingSpinner } from "./ui/loading-spinner"

interface OrderDetailsDialogProps {
  order: Order
  children: React.ReactNode
  editable?: boolean
  onOrderUpdate?: () => void
}

export function OrderDetailsDialog({ order, children, editable = true, onOrderUpdate }: OrderDetailsDialogProps) {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const statusSteps: Order["status"][] = ["pending", "confirmed", "preparing", "ready", "served"]
  const getServiceType = (o: Order) => {
    const mod = Number.parseInt(o.id) % 3
    if (mod === 0) return "Delivery"
    if (mod === 1) return "Takeaway"
    return "Dine-in"
  }
  const getServiceBadgeClass = (service: string) => {
    switch (service) {
      case "Delivery":
        return "bg-sky-100 text-sky-800 border-sky-200"
      case "Takeaway":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
    }
  }

  const handleCancelOrder = async () => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      cancelOrder(order.id)
      if (onOrderUpdate) {
        onOrderUpdate()
      }
      setOpen(false)
    } catch (error) {
      console.error("Failed to cancel order:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold">ORD-{order.id.padStart(4, "0")}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                {(() => {
                  const svc = getServiceType(order)
                  return <Badge variant="outline" className={`text-xs ${getServiceBadgeClass(svc)}`}>{svc}</Badge>
                })()}
                {getServiceType(order) === "Dine-in" && (
                  <Badge variant="outline" className="text-xs">Table {order.tableNumber}</Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">${order.totalAmount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
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
              {order.notes && (
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded">{order.notes}</div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Updated {new Date(order.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                {order.estimatedReadyTime && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> ETA {new Date(order.estimatedReadyTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-muted/50">
                <div className="divide-y">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-3 py-2">
                      <div className="text-sm text-foreground">
                        {item.menuItem.name} × {item.quantity}
                        {item.specialInstructions ? (
                          <span className="ml-2 text-xs text-muted-foreground">{item.specialInstructions}</span>
                        ) : null}
                      </div>
                      <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <div className="flex gap-2 order-2 sm:order-1">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              {editable && (
                <NewOrderDialog editOrderId={order.id} preSelectedTable={String(order.tableNumber)}>
                  <Button variant="outline">
                    Modify
                  </Button>
                </NewOrderDialog>
              )}
            </div>
            {order.status !== "cancelled" && order.status !== "served" && (
              <Button 
                variant="destructive" 
                onClick={handleCancelOrder}
                disabled={isProcessing}
                className="order-1 sm:order-2"
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel Order
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
