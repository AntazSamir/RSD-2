"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { mockOrders, mockMenuItems, mockUsers } from "@/lib/mock-data"
import type { Order } from "@/lib/types"
import { OrderDetailsDialog } from "./order-details-dialog"

export function OrderHistorySection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const completedOrders = mockOrders.filter((order) => order.status === "served" || order.status === "cancelled")

  const filteredOrders = useMemo(() => {
    let filtered = completedOrders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    if (dateFilter === "today") {
      filtered = filtered.filter((order) => new Date(order.createdAt) >= today)
    } else if (dateFilter === "week") {
      filtered = filtered.filter((order) => new Date(order.createdAt) >= thisWeek)
    } else if (dateFilter === "month") {
      filtered = filtered.filter((order) => new Date(order.createdAt) >= thisMonth)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((order) => {
        const waiterName = getWaiterName(order.waiterId).toLowerCase()
        const orderItems = getOrderItems(order).toLowerCase()
        const orderId = order.id.toLowerCase()
        const tableNumber = order.tableNumber.toString()

        return (
          orderId.includes(query) ||
          tableNumber.includes(query) ||
          waiterName.includes(query) ||
          orderItems.includes(query)
        )
      })
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [completedOrders, searchQuery, statusFilter, dateFilter])

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, table, waiter, or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="served">Served</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            {(searchQuery || statusFilter !== "all" || dateFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Order History ({filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                  ? "No orders found matching your filters."
                  : "No completed orders found."}
              </p>
            ) : (
              filteredOrders.map((order) => (
                <OrderDetailsDialog key={order.id} order={order} editable={false}>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge className={getStatusColor(order.status)} variant="outline">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Table & Waiter</p>
                        <p>
                          Table {order.tableNumber} • {getWaiterName(order.waiterId)}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground">Items</p>
                        <p className="truncate">{getOrderItems(order)}</p>
                      </div>
                    </div>
                  </div>
                </OrderDetailsDialog>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
