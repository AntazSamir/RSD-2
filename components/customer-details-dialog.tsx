"use client"

import { useState } from "react"
import { format } from "date-fns"
import { X, Mail, Phone, Calendar, Users, DollarSign, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type Customer } from "@/lib/mock-data"
// import { EditCustomerDialog } from "./edit-customer-dialog"
import { NewOrderDialog } from "./new-order-dialog"

interface CustomerDetailsDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailsDialog({ customer, open, onOpenChange }: CustomerDetailsDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false)

  const handleEditCustomer = () => {
    console.log("Edit customer clicked")
    // setIsEditDialogOpen(true)
  }

  const handleCreateReservation = () => {
    console.log("Create reservation clicked")
    // setIsReservationDialogOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Information and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{customer.name}</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{customer.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{customer.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">Last visit: {format(customer.lastVisit, "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-2xl font-bold text-foreground">{customer.totalVisits}</div>
                    <div className="text-sm text-muted-foreground">Total Visits</div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-2xl font-bold text-foreground">${customer.totalSpent.toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-2xl font-bold text-foreground">{customer.loyaltyPoints}</div>
                  <div className="text-sm text-muted-foreground">Loyalty Points</div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-6">
              {/* Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Preferences</h3>
                <div className="space-y-2">
                  {customer.preferences && customer.preferences.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {customer.preferences.map((preference, index) => (
                        <Badge key={index} variant="secondary">
                          {preference}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No preferences recorded</p>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Allergies</h3>
                <div className="space-y-2">
                  {customer.allergies && customer.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {customer.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No allergies recorded</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Notes</h3>
                <div className="bg-muted rounded-lg p-3">
                  <Textarea
                    value={customer.notes || ""}
                    readOnly
                    className="bg-transparent border-none text-muted-foreground resize-none focus:ring-0 focus:border-none"
                    placeholder="No notes recorded"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleEditCustomer}
                className=""
              >
                Edit Customer
              </Button>
              
              <Button
                onClick={handleCreateReservation}
                className=""
              >
                Create Reservation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      {/* <EditCustomerDialog
        customer={customer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      /> */}

      {/* Create Reservation Dialog */}
      <NewOrderDialog
        open={isReservationDialogOpen}
        onOpenChange={setIsReservationDialogOpen}
        preSelectedCustomer={customer}
        forceReservationMode={true}
      />
    </>
  )
}
