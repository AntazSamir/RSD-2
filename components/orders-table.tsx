"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Clock, Trash2, MoreHorizontal, Calendar } from "lucide-react"
import { mockOrders, mockMenuItems, mockUsers, cancelOrder } from "@/lib/mock-data"
import type { Order } from "@/lib/types"
import { NewOrderForm } from "./new-order-form"
import { EditOrderDialog } from "./edit-order-dialog"
import { OrderDetailsDialog } from "./order-details-dialog"
import { OrderHistorySection } from "./order-history-section"
import { ReservationsSection } from "./reservations-section"

export function OrdersTable() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [orders, setOrders] = useState(mockOrders)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeSection, setActiveSection] = useState<"orders" | "history" | "reservations" | "new-order">("orders")
  const [cancellingOrders, setCancellingOrders] = useState<Set<string>>(new Set())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false)

  useEffect(() => {
    setOrders([...mockOrders])
  }, [refreshKey])

  const activeOrders = orders.filter((order) => order.status !== "served" && order.status !== "cancelled")
  const filteredOrders = activeOrders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  const refreshOrders = async () => {
    setIsRefreshing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setRefreshKey((prev) => prev + 1)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setCancellingOrders((prev) => new Set(prev).add(orderId))

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        cancelOrder(orderId)
        refreshOrders()
      } finally {
        setCancellingOrders((prev) => {
          const newSet = new Set(prev)
          newSet.delete(orderId)
          return newSet
        })
      }
    }
  }

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

  const getOrderItems = (order: Order) => {
    return order.items
      .map((item) => {
        const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
        return `${item.quantity}x ${menuItem?.name || "Unknown Item"}`
      })
      .join(", ")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <Button
          variant={activeSection === "new-order" ? "default" : "outline"}
          onClick={() => setActiveSection("new-order")}
          className="w-full sm:w-[140px] justify-center"
        >
          New Order
        </Button>
        <Button
          variant={activeSection === "orders" ? "default" : "outline"}
          onClick={() => setActiveSection("orders")}
          className="w-full sm:w-[140px] justify-center"
          disabled={isRefreshing}
        >
          {isRefreshing && activeSection === "orders" ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Loading...
            </>
          ) : (
            "Current Orders"
          )}
        </Button>
        <Button
          variant={activeSection === "reservations" ? "default" : "outline"}
          onClick={() => setActiveSection("reservations")}
          className="w-full sm:w-[140px] justify-center"
          disabled={isRefreshing}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Reservations
        </Button>
        <Button
          variant={activeSection === "history" ? "default" : "outline"}
          onClick={() => setActiveSection("history")}
          className="w-full sm:w-[140px] justify-center"
          disabled={isRefreshing}
        >
          Order History
        </Button>
      </div>

      {activeSection === "new-order" && (
        <NewOrderForm
          onOrderCreated={() => {
            refreshOrders()
            setActiveSection("orders")
          }}
          onCancel={() => setActiveSection("orders")}
        />
      )}

      {activeSection === "orders" && (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-base sm:text-lg">Order Management</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isRefreshing}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {isRefreshing ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoadingSpinner size="md" />
                  <span>Refreshing orders...</span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Order ID</TableHead>
                      <TableHead className="w-[80px]">Table</TableHead>
                      <TableHead className="w-[100px] hidden sm:table-cell">Waiter</TableHead>
                      <TableHead className="min-w-[150px]">Items</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[80px]">Total</TableHead>
                      <TableHead className="w-[80px] hidden md:table-cell">Time</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const isCancelling = cancellingOrders.has(order.id)
                      return (
                        <OrderDetailsDialog key={order.id} order={order}>
                          <TableRow className={`cursor-pointer hover:bg-muted/50 ${isCancelling ? "opacity-50" : ""}`}>
                            <TableCell className="font-medium text-xs sm:text-sm">#{order.id}</TableCell>
                            <TableCell className="text-xs sm:text-sm">Table {order.tableNumber}</TableCell>
                            <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                              {getWaiterName(order.waiterId)}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate text-xs sm:text-sm">
                              {getOrderItems(order)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(order.status)} text-xs`} variant="outline">
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm font-medium">
                              ${order.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <div className="hidden sm:flex items-center gap-1">
                                  <EditOrderDialog order={order} />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCancelOrder(order.id)}
                                    disabled={isCancelling}
                                  >
                                    {isCancelling ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <div className="sm:hidden">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </OrderDetailsDialog>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {!isRefreshing && filteredOrders.length === 0 && (
              <div className="text-center py-8 px-4 text-muted-foreground">
                <p className="text-sm sm:text-base">No orders found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeSection === "reservations" && <ReservationsSection />}

      {activeSection === "history" && <OrderHistorySection />}
    </div>
  )
}
