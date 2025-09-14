"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, Edit } from "lucide-react"
import { mockTables, mockOrders } from "@/lib/mock-data"
import type { Table } from "@/lib/types"

export function TablesGrid() {
  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-100 dark:border-emerald-700/50"
      case "occupied":
        return "bg-red-900/20 text-red-950 border-red-800/60 dark:bg-red-950/40 dark:text-red-100 dark:border-red-700/50"
      case "reserved":
        return "bg-amber-100 text-amber-950 border-amber-600/50 dark:bg-amber-950/30 dark:text-amber-100 dark:border-amber-700/50"
      case "cleaning":
        return "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-100 dark:border-emerald-700/50"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTableOrder = (tableId: string) => {
    const table = mockTables.find((t) => t.id === tableId)
    if (!table?.currentOrderId) return null
    return mockOrders.find((order) => order.id === table.currentOrderId)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Table Management</CardTitle>
        <Button size="sm">Add Table</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockTables.map((table) => {
            const currentOrder = getTableOrder(table.id)
            return (
              <Card key={table.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Table {table.number}</CardTitle>
                    <Badge className={getStatusColor(table.status)} variant="outline">
                      {table.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Capacity: {table.capacity} guests
                  </div>

                  {currentOrder && (
                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Order #{currentOrder.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {currentOrder.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentOrder.items.length} items • ${currentOrder.totalAmount.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(currentOrder.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {table.status === "available" && (
                      <Button size="sm" className="flex-1">
                        Assign
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
