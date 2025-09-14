"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, DollarSign } from "lucide-react"
import { mockOrders, mockMenuItems, mockTables } from "@/lib/mock-data"
import type { Table } from "@/lib/types"
import { EditOrderDialog } from "./edit-order-dialog"

interface TableDetailsDialogProps {
  table: Table
  children: React.ReactNode
  onAssignTable?: (tableNumber: string) => void
}

export function TableDetailsDialog({ table, children, onAssignTable }: TableDetailsDialogProps) {
  const [open, setOpen] = useState(false)

  const handleMarkAsAvailable = () => {
    // Find and update the table status in mock data
    const tableIndex = mockTables.findIndex((t) => t.id === table.id)
    if (tableIndex !== -1) {
      mockTables[tableIndex].status = "available"
      // Close the dialog and trigger a refresh
      setOpen(false)
      // Force a page refresh to show updated status
      window.location.reload()
    }
  }

  const handleViewReservation = () => {
    // Placeholder for reservation viewing functionality
    console.log("View reservation for table", table.number)
  }

  const handleAssignTable = () => {
    if (onAssignTable) {
      onAssignTable(table.number.toString())
      setOpen(false)
    } else {
      // Fallback for backward compatibility
      console.log("Assign table", table.number)
    }
  }

  const getTableOrder = () => {
    if (!table.currentOrderId) return null
    return mockOrders.find((order) => order.id === table.currentOrderId)
  }

  const getMenuItem = (menuItemId: string) => {
    return mockMenuItems.find((item) => item.id === menuItemId)
  }

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200"
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cleaning":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const currentOrder = getTableOrder()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Table {table.number}</span>
            <Badge className={getStatusColor(table.status)} variant="outline">
              {table.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Table Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Capacity: {table.capacity} guests</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details or Status */}
          {currentOrder ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <EditOrderDialog order={currentOrder} />
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Order #{currentOrder.id}</span>
                    <Badge variant="outline" className="capitalize">
                      {currentOrder.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Ordered:{" "}
                        {new Date(currentOrder.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Total: ${currentOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {currentOrder.estimatedReadyTime && (
                    <div className="text-sm text-muted-foreground">
                      Estimated ready:{" "}
                      {new Date(currentOrder.estimatedReadyTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}

                  {currentOrder.notes && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">Special Notes:</p>
                      <p className="text-sm text-yellow-700">{currentOrder.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {currentOrder.items.map((item, index) => {
                      const menuItem = getMenuItem(item.menuItemId)
                      return (
                        <div key={index}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{menuItem?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} × ${(item.price / item.quantity).toFixed(2)}
                              </p>
                              {item.specialInstructions && (
                                <p className="text-sm text-blue-600 italic">Note: {item.specialInstructions}</p>
                              )}
                            </div>
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </div>
                          {index < currentOrder.items.length - 1 && <Separator className="mt-3" />}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-3">
                  {table.status === "available" && (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Users className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800">Available</h3>
                      <p className="text-muted-foreground">This table is ready for new guests</p>
                      <Button className="mt-4" onClick={handleAssignTable}>
                        Assign Table
                      </Button>
                    </>
                  )}

                  {table.status === "cleaning" && (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Clock className="h-8 w-8 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Cleaning</h3>
                      <p className="text-muted-foreground">This table is currently being cleaned</p>
                      <Button variant="outline" className="mt-4 bg-transparent" onClick={handleMarkAsAvailable}>
                        Mark as Available
                      </Button>
                    </>
                  )}

                  {table.status === "reserved" && (
                    <>
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                        <Users className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-yellow-800">Reserved</h3>
                      <p className="text-muted-foreground">This table has been reserved for guests</p>
                      <Button variant="outline" className="mt-4 bg-transparent" onClick={handleViewReservation}>
                        View Reservation
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
