"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Clock, DollarSign } from "lucide-react"
import { mockOrders, mockMenuItems, mockUsers } from "@/lib/mock-data"
import type { Order } from "@/lib/types"

export function OrderHistoryDialog() {
  const [open, setOpen] = useState(false)

  // Filter for completed orders (served or cancelled)
  const completedOrders = mockOrders
    .filter((order) => order.status === "served" || order.status === "cancelled")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getWaiterName = (waiterId: string) => {
    const waiter = mockUsers.find((user) => user.id === waiterId)
    return waiter?.name || "Unknown"
  }

  const getOrderItems = (order: Order) => {
    return order.items.map((item) => {
      const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
      return {
        name: menuItem?.name || "Unknown Item",
        quantity: item.quantity,
        price: menuItem?.price || 0,
      }
    })
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "served":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const totalRevenue = completedOrders
    .filter((order) => order.status === "served")
    .reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Order History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Order History
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{completedOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600">
                  Served: {completedOrders.filter((o) => o.status === "served").length}
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  Cancelled: {completedOrders.filter((o) => o.status === "cancelled").length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Table {order.tableNumber} • {getWaiterName(order.waiterId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      {order.status}
                    </Badge>
                    <p className="text-lg font-bold mt-1">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {getOrderItems(order).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            {completedOrders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed orders found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
