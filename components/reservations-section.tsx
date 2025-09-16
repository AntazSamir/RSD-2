"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Phone, MessageSquare, CheckCircle, XCircle, Utensils, Edit } from "lucide-react"
import { mockMenuItems } from "@/lib/mock-data"

// Mock reservation data
const mockReservations = [
  {
    id: "R001",
    customerName: "John Smith",
    phone: "+1 (555) 123-4567",
    partySize: 4,
    date: "2024-01-15",
    time: "19:00",
    tableNumber: 5,
    status: "confirmed" as const,
    specialRequests: "Birthday celebration, need high chair",
    createdAt: "2024-01-14T10:30:00Z",
    preOrderedItems: [
      { menuItemId: "1", quantity: 2, specialInstructions: "" },
      { menuItemId: "8", quantity: 1, specialInstructions: "Medium rare" },
      { menuItemId: "13", quantity: 1, specialInstructions: "" },
    ],
  },
  {
    id: "R002",
    customerName: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    partySize: 2,
    date: "2024-01-15",
    time: "20:30",
    tableNumber: 8,
    status: "pending" as const,
    specialRequests: "Anniversary dinner",
    createdAt: "2024-01-14T14:15:00Z",
    preOrderedItems: [
      { menuItemId: "2", quantity: 2, specialInstructions: "" },
      { menuItemId: "4", quantity: 2, specialInstructions: "" },
    ],
  },
  {
    id: "R003",
    customerName: "Mike Wilson",
    phone: "+1 (555) 456-7890",
    partySize: 6,
    date: "2024-01-16",
    time: "18:00",
    tableNumber: 12,
    status: "confirmed" as const,
    specialRequests: "Business dinner, quiet table preferred",
    createdAt: "2024-01-14T16:45:00Z",
    preOrderedItems: [
      { menuItemId: "5", quantity: 3, specialInstructions: "" },
      { menuItemId: "9", quantity: 4, specialInstructions: "" },
      { menuItemId: "11", quantity: 2, specialInstructions: "No cilantro" },
    ],
  },
  {
    id: "R004",
    customerName: "Emily Davis",
    phone: "+1 (555) 321-0987",
    partySize: 3,
    date: "2024-01-15",
    time: "19:30",
    tableNumber: 3,
    status: "cancelled" as const,
    specialRequests: "",
    createdAt: "2024-01-13T09:20:00Z",
    preOrderedItems: [],
  },
]

export function ReservationsSection() {
  const [reservations, setReservations] = useState(mockReservations)
  const [editOpen, setEditOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<typeof mockReservations[number] | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const updateReservationStatus = (reservationId: string, newStatus: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: newStatus as any } : reservation,
      ),
    )
  }

  const openEdit = (reservationId: string) => {
    const res = reservations.find((r) => r.id === reservationId) || null
    setEditingReservation(res ? { ...res } : null)
    setEditOpen(!!res)
  }

  const saveEdit = () => {
    if (!editingReservation) return
    setReservations((prev) => prev.map((r) => (r.id === editingReservation.id ? { ...editingReservation } : r)))
    setEditOpen(false)
    setEditingReservation(null)
  }

  const calculatePreOrderTotal = (preOrderedItems: any[]) => {
    return preOrderedItems.reduce((total, item) => {
      const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
      return total + (menuItem ? menuItem.price * item.quantity : 0)
    }, 0)
  }

  const todayReservations = reservations.filter((r) => r.date === "2024-01-15")
  const upcomingReservations = reservations.filter((r) => r.date > "2024-01-15")

  const renderMenuItems = (preOrderedItems: any[]) => {
    if (!preOrderedItems || preOrderedItems.length === 0) {
      return null
    }

    return (
      <div className="mt-2 pt-2 border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Utensils className="h-3 w-3" />
          <span className="font-medium">Pre-ordered Items:</span>
        </div>
        <div className="space-y-1">
          {preOrderedItems.map((item, index) => {
            const menuItem = mockMenuItems.find((mi) => mi.id === item.menuItemId)
            if (!menuItem) return null

            return (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {item.quantity}x {menuItem.name}
                </span>
                <span className="font-medium">${(menuItem.price * item.quantity).toFixed(2)}</span>
              </div>
            )
          })}
          <div className="flex justify-between items-center text-xs font-medium pt-1 border-t">
            <span>Total:</span>
            <span>${calculatePreOrderTotal(preOrderedItems).toFixed(2)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Reservations</h2>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Today&apos;s Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today&apos;s Reservations ({todayReservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayReservations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reservations for today</p>
            ) : (
              todayReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded-lg space-y-2 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{reservation.customerName}</h3>
                        <Badge className={`${getStatusColor(reservation.status)} text-xs`} variant="outline">
                          {reservation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reservation.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {reservation.partySize} guests
                        </div>
                        <div>Table {reservation.tableNumber}</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {reservation.phone}
                        </div>
                      </div>
                      {reservation.specialRequests && (
                        <div className="flex items-start gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3 mt-0.5" />
                          <span>{reservation.specialRequests}</span>
                        </div>
                      )}
                      {renderMenuItems(reservation.preOrderedItems)}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {reservation.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                        className="text-xs h-7"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirm
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(reservation.id)} className="text-xs h-7">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    {reservation.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                        className="text-xs h-7"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Reservations ({upcomingReservations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingReservations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming reservations</p>
            ) : (
              upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border rounded-lg space-y-2 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{reservation.customerName}</h3>
                        <Badge className={`${getStatusColor(reservation.status)} text-xs`} variant="outline">
                          {reservation.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(reservation.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {reservation.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {reservation.partySize} guests
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div>Table {reservation.tableNumber}</div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {reservation.phone}
                        </div>
                      </div>
                      {reservation.specialRequests && (
                        <div className="flex items-start gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3 mt-0.5" />
                          <span>{reservation.specialRequests}</span>
                        </div>
                      )}
                      {renderMenuItems(reservation.preOrderedItems)}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {reservation.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                        className="text-xs h-7"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirm
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(reservation.id)} className="text-xs h-7">
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    {reservation.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                        className="text-xs h-7"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Reservation {editingReservation ? `- ${editingReservation.id}` : ""}</DialogTitle>
          </DialogHeader>
          {editingReservation && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Customer Name</Label>
                  <Input
                    value={editingReservation.customerName}
                    onChange={(e) => setEditingReservation({ ...(editingReservation as any), customerName: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input
                    value={editingReservation.phone}
                    onChange={(e) => setEditingReservation({ ...(editingReservation as any), phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Party Size</Label>
                  <Input
                    type="number"
                    value={editingReservation.partySize}
                    onChange={(e) => setEditingReservation({ ...(editingReservation as any), partySize: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Table</Label>
                  <Input
                    type="number"
                    value={editingReservation.tableNumber}
                    onChange={(e) => setEditingReservation({ ...(editingReservation as any), tableNumber: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={editingReservation.status}
                    onValueChange={(v) => setEditingReservation({ ...(editingReservation as any), status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={editingReservation.date}
                    onChange={(e) => setEditingReservation({ ...(editingReservation as any), date: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Time</Label>
                  <Input
                    type="time"
                    value={editingReservation.time}
                    onChange={(e) => setEditingReservation({ ...(editingReservation as any), time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Special Requests</Label>
                <Textarea
                  rows={3}
                  value={editingReservation.specialRequests}
                  onChange={(e) => setEditingReservation({ ...(editingReservation as any), specialRequests: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
