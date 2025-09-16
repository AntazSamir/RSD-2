"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Clock, Trash2, MoreHorizontal, Calendar, Undo2 } from "lucide-react"
import { mockOrders, mockMenuItems, mockUsers } from "@/lib/mock-data"
import type { Order } from "@/lib/types"
import { NewOrderForm } from "./new-order-form"
import { NewOrderDialog } from "./new-order-dialog"
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

  // Cancel action is handled inside the order details dialog; no inline cancel on cards

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

  const statusSteps: Order["status"][] = ["pending", "confirmed", "preparing", "ready", "served"]

  // The screenshot shows Delivery/Takeaway/Dine-in; mock a service type from id
  const getServiceType = (order: Order) => {
    const mod = Number.parseInt(order.id) % 3
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

  const handleRevert = async (orderId: string) => {
    setCancellingOrders((prev) => new Set(prev).add(orderId))
    try {
      await new Promise((r) => setTimeout(r, 500))
      const original = mockOrders.find((o) => o.id === orderId)
      if (original) {
        original.status = "pending"
        original.updatedAt = new Date()
      }
      refreshOrders()
    } finally {
      setCancellingOrders((prev) => {
        const n = new Set(prev)
        n.delete(orderId)
        return n
      })
    }
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
          <CardContent className="p-4">
            {isRefreshing ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoadingSpinner size="md" />
                  <span>Refreshing orders...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredOrders.map((order) => {
                  const isProcessing = cancellingOrders.has(order.id)
                  const service = getServiceType(order)
                  const stepIndex = Math.max(0, statusSteps.indexOf(order.status))
                  return (
                    <OrderDetailsDialog key={order.id} order={order} onOrderUpdate={refreshOrders}>
                      <div className={`rounded-lg border p-4 bg-card cursor-pointer ${isProcessing ? "opacity-50" : ""}`}>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm">ORD-{order.id.padStart(4, "0")}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                              <Badge variant="outline" className={`text-xs ${getServiceBadgeClass(service)}`}>{service}</Badge>
                              {service === "Dine-in" && (
                                <Badge variant="outline" className="text-xs">Table {order.tableNumber}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">${order.totalAmount.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-red-500">
                          {(() => {
                            const totalDishes = order.items.reduce((sum, it) => sum + (it.quantity || 1), 0)
                            const segments = Math.min(4, Math.max(1, totalDishes))
                            return Array.from({ length: segments }).map((_, idx) => (
                              <span key={`seg-${order.id}-${idx}`} className="flex items-center gap-2">
                                <span aria-hidden className="h-2 w-2 rounded-full bg-red-500"></span>
                                {idx < segments - 1 && (
                                  <span aria-hidden className="h-0.5 w-10 rounded-full bg-red-500"></span>
                                )}
                              </span>
                            ))
                          })()}
                        </div>

                        <div className="mt-3 rounded-md border bg-muted/50">
                          <div className="divide-y">
                            {order.items.map((item) => {
                              const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
                              return (
                                <div key={item.id} className="flex items-center justify-between px-3 py-2">
                                  <div className="text-sm text-foreground">
                                    {(menuItem?.name || "Item")} × {item.quantity}
                                    {item.specialInstructions ? (
                                      <span className="ml-2 text-xs text-muted-foreground">{item.specialInstructions}</span>
                                    ) : null}
                                  </div>
                                  <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-2 text-xs text-muted-foreground">{order.notes}</div>
                        )}

                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Updated {new Date(order.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="px-2 h-8" onClick={() => handleRevert(order.id)} onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} disabled={isProcessing}>
                              {isProcessing ? <LoadingSpinner size="sm" /> : <><Undo2 className="h-4 w-4 mr-1" /> Revert</>}
                            </Button>
                            <NewOrderDialog editOrderId={order.id} preSelectedTable={String(order.tableNumber)}>
                              <Button variant="outline" size="sm" className="h-8" onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>Modify</Button>
                            </NewOrderDialog>
                          </div>
                        </div>
                      </div>
                    </OrderDetailsDialog>
                  )
                })}
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

