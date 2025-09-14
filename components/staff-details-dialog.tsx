"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Download, User, Phone, MapPin, Calendar, DollarSign, Clock } from "lucide-react"
import type { Staff } from "@/lib/types"

interface StaffDetailsDialogProps {
  staff: Staff | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffDetailsDialog({ staff, open, onOpenChange }: StaffDetailsDialogProps) {
  if (!staff) return null

  const handleExportStaffData = () => {
    // Create staff data for export
    const staffData = {
      "Full Name": staff.fullName,
      "National ID": staff.nationalId,
      Role: staff.role,
      "Contact Number": staff.contactNumber,
      Address: staff.address,
      "Date of Joining": staff.dateOfJoining.toLocaleDateString(),
      "Agreed Salary": `$${staff.agreedSalary}`,
      "Advanced Salary Taken": `$${staff.advancedSalaryTaken}`,
      "Remaining Salary": `$${staff.agreedSalary - staff.advancedSalaryTaken}`,
      "Current Status": staff.status,
      "Shift Hours": `${staff.shiftStart} - ${staff.shiftEnd}`,
      "Daily Hours": `${staff.dailyHours}h`,
      Efficiency: `${staff.efficiency}%`,
    }

    // Convert to CSV format
    const csvContent = Object.entries(staffData)
      .map(([key, value]) => `"${key}","${value}"`)
      .join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${staff.name.replace(/\s+/g, "_")}_details.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{staff.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{staff.fullName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={staff.status === "working" ? "default" : "secondary"}>{staff.status}</Badge>
                <span className="text-sm text-muted-foreground">{staff.role}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">National ID</label>
                <p className="font-medium">{staff.nationalId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {staff.contactNumber}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {staff.address}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Joining</label>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {staff.dateOfJoining.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Salary Information */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Salary Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Agreed Salary</label>
                <p className="text-lg font-bold text-green-600">${staff.agreedSalary}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Advanced Taken</label>
                <p className="text-lg font-bold text-orange-600">${staff.advancedSalaryTaken}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Remaining</label>
                <p className="text-lg font-bold text-blue-600">${staff.agreedSalary - staff.advancedSalaryTaken}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Work Schedule */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Work Schedule & Performance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Shift Hours</label>
                <p className="font-medium">
                  {staff.shiftStart} - {staff.shiftEnd}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Daily Hours</label>
                <p className="font-medium">{staff.dailyHours}h</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Today's Entry</label>
                <p className="font-medium">{staff.entryTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Today's Exit</label>
                <p className="font-medium">{staff.exitTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Efficiency</label>
                <p className="font-medium">{staff.efficiency}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Hours Worked Today</label>
                <p className="font-medium">{staff.hoursWorked}h</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Export Button */}
          <div className="flex justify-end">
            <Button onClick={handleExportStaffData} className="gap-2">
              <Download className="h-4 w-4" />
              Export Staff Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
