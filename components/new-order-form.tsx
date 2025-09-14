"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus, Minus, ShoppingCart, Search, CheckCircle, Calendar, Clock, User, Phone } from "lucide-react"
import { mockMenuItems, mockTables, mockUsers, addOrder, getNextOrderId } from "@/lib/mock-data"
import { useOrderForm } from "@/hooks/use-order-form"
import { useMenuFilters } from "@/hooks/use-menu-filters"

interface NewOrderFormProps {
  onOrderCreated?: () => void
  onCancel?: () => void
}

export function NewOrderForm({ onOrderCreated, onCancel }: NewOrderFormProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set())
  const [isReservation, setIsReservation] = useState(false)

  const orderForm = useOrderForm({
    initialTable: "",
  })

  const menuFilters = useMenuFilters(mockMenuItems)

  const availableTables = mockTables.filter((table) => table.status === "available")
  const waiters = mockUsers.filter((user) => user.role === "waiter")

  const handlePlaceOrder = async () => {
    if (isReservation) {
      if (
        !reservationData.customerName ||
        !reservationData.phoneNumber ||
        !reservationData.date ||
        !reservationData.time ||
        !orderForm.selectedTable
      ) {
        alert("Please fill in all required reservation fields")
        return
      }
    } else {
      if (!orderForm.isValid) {
        alert("Please select a table, waiter, and add items to the order")
        return
      }
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (isReservation) {
        console.log("Creating reservation:", reservationData)
      } else {
        const newOrder = {
          id: getNextOrderId(),
          tableNumber: Number.parseInt(orderForm.selectedTable),
          waiterId: orderForm.selectedWaiter,
          items: orderForm.orderItems.map((item, index) => ({
            id: `${Date.now()}-${index}`,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price * item.quantity,
            specialInstructions: item.specialInstructions,
          })),
          status: "pending" as const,
          totalAmount: orderForm.totalAmount,
          createdAt: new Date(),
          updatedAt: new Date(),
          estimatedReadyTime: new Date(Date.now() + 25 * 60 * 1000),
          notes: orderForm.specialNote,
        }

        addOrder(newOrder)
      }

      setShowConfirmation(true)
      setTimeout(() => {
        setShowConfirmation(false)
      }, 2000)

      orderForm.resetForm()
      setReservationData({
        customerName: "",
        phoneNumber: "",
        date: "",
        time: "",
        partySize: "",
        specialRequests: "",
      })

      onOrderCreated?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddToOrder = async (item: any) => {
    setAddingItems((prev) => new Set(prev).add(item.id))

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      orderForm.addToOrder(item)
    } finally {
      setAddingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }
  }

  const handleReset = () => {
    orderForm.resetForm()
    menuFilters.resetFilters()
  }

  const [reservationData, setReservationData] = useState({
    customerName: "",
    phoneNumber: "",
    date: "",
    time: "",
    partySize: "",
    specialRequests: "",
  })

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-[calc(100vh-200px)]">
        <div className="w-full lg:w-80 flex-shrink-0 space-y-3 sm:space-y-4 overflow-y-auto">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Order Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={!isReservation ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsReservation(false)}
                  className="flex-1"
                >
                  Dine In
                </Button>
                <Button
                  variant={isReservation ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsReservation(true)}
                  className="flex-1"
                >
                  Reservation
                </Button>
              </div>
            </CardContent>
          </Card>

          {isReservation ? (
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Reservation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Name *
                  </label>
                  <Input
                    value={reservationData.customerName}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </label>
                  <Input
                    value={reservationData.phoneNumber}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date *</label>
                    <Input
                      type="date"
                      value={reservationData.date}
                      onChange={(e) => setReservationData((prev) => ({ ...prev, date: e.target.value }))}
                      disabled={isSubmitting}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time *
                    </label>
                    <Input
                      type="time"
                      value={reservationData.time}
                      onChange={(e) => setReservationData((prev) => ({ ...prev, time: e.target.value }))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Party Size</label>
                  <Select
                    value={reservationData.partySize}
                    onValueChange={(value) => setReservationData((prev) => ({ ...prev, partySize: value }))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select party size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Table *</label>
                  <Select
                    value={orderForm.selectedTable}
                    onValueChange={orderForm.setSelectedTable}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map((table) => (
                        <SelectItem key={table.id} value={table.number.toString()}>
                          Table {table.number} ({table.capacity} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Special Requests</label>
                  <textarea
                    value={reservationData.specialRequests}
                    onChange={(e) => setReservationData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requests or dietary requirements..."
                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                    maxLength={200}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button onClick={handlePlaceOrder} className="flex-1 text-sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Making Reservation...
                      </>
                    ) : (
                      "Make Reservation"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="text-sm bg-transparent"
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Table</label>
                    <Select
                      value={orderForm.selectedTable}
                      onValueChange={orderForm.setSelectedTable}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose table" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTables.map((table) => (
                          <SelectItem key={table.id} value={table.number.toString()}>
                            Table {table.number} ({table.capacity} seats)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Assign Waiter</label>
                    <Select
                      value={orderForm.selectedWaiter}
                      onValueChange={orderForm.setSelectedWaiter}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose waiter" />
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
                    <label className="text-sm font-medium mb-2 block">Special Note</label>
                    <textarea
                      value={orderForm.specialNote}
                      onChange={(e) => orderForm.setSpecialNote(e.target.value)}
                      placeholder="Add special instructions or notes for this order..."
                      className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                      maxLength={200}
                      disabled={isSubmitting}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {orderForm.specialNote.length}/200 characters
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orderForm.orderItems.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No items added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {orderForm.orderItems.map((item) => {
                        const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
                        return (
                          <div
                            key={item.menuItemId}
                            className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/30"
                          >
                            <div className="flex-1">
                              <span className="font-medium">
                                {item.quantity}x {menuItem?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => orderForm.removeFromOrder(item.menuItemId)}
                                disabled={isSubmitting}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                      <div className="border-t pt-2 font-semibold">Total: ${orderForm.totalAmount.toFixed(2)}</div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 text-sm"
                      disabled={!orderForm.isValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="text-sm bg-transparent"
                      disabled={isSubmitting}
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-shrink-0 border-b bg-background p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg mb-3 sm:mb-4">Menu Items</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search menu items..."
                  value={menuFilters.searchQuery}
                  onChange={(e) => menuFilters.setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                  disabled={isSubmitting}
                />
              </div>
              <Select
                value={menuFilters.selectedCategory}
                onValueChange={menuFilters.setSelectedCategory}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {menuFilters.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : `${category.charAt(0).toUpperCase()}${category.slice(1)}s`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {["appetizer", "main", "dessert", "beverage"].map((category) => {
                const categoryItems = menuFilters.filteredItems.filter((item) => item.category === category)
                if (categoryItems.length === 0) return null

                return (
                  <div key={category} className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold capitalize bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {category}s
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {categoryItems.map((item) => {
                        const isAdding = addingItems.has(item.id)
                        return (
                          <Card key={item.id} className="relative hover:shadow-md transition-shadow">
                            <CardContent className="p-3">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-sm sm:text-base leading-tight">{item.name}</h4>
                                  <Badge
                                    variant={item.available ? "default" : "secondary"}
                                    className="text-xs px-1 py-0"
                                  >
                                    {item.available ? "✓" : "✗"}
                                  </Badge>
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>

                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-sm">${item.price.toFixed(2)}</span>
                                  <div className="flex items-center gap-1">
                                    {orderForm.getItemQuantity(item.id) > 0 && (
                                      <span className="w-6 text-center text-xs font-medium">
                                        {orderForm.getItemQuantity(item.id)}
                                      </span>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 sm:h-6 sm:w-6 p-0 bg-transparent"
                                      onClick={() => handleAddToOrder(item)}
                                      disabled={!item.available || isSubmitting || isAdding}
                                    >
                                      {isAdding ? <LoadingSpinner size="sm" /> : <Plus className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <Card className="w-80 shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h3 className="text-lg font-semibold text-green-700">
                  {isReservation ? "Reservation Made Successfully!" : "Order Placed Successfully!"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isReservation ? "Your table has been reserved" : "Your order has been sent to the kitchen"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
