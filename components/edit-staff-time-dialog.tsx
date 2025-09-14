"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"

interface EditStaffTimeDialogProps {
  staff: {
    id: string
    name: string
    role: string
    shiftStart: string
    shiftEnd: string
  }
  onTimeUpdate: (staffId: string, shiftStart: string, shiftEnd: string) => void
  children: React.ReactNode
}

export function EditStaffTimeDialog({ staff, onTimeUpdate, children }: EditStaffTimeDialogProps) {
  const [open, setOpen] = useState(false)
  const [shiftStart, setShiftStart] = useState(staff.shiftStart)
  const [shiftEnd, setShiftEnd] = useState(staff.shiftEnd)

  const handleSave = () => {
    onTimeUpdate(staff.id, shiftStart, shiftEnd)
    setOpen(false)
  }

  const handleCancel = () => {
    setShiftStart(staff.shiftStart)
    setShiftEnd(staff.shiftEnd)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Edit Shift Time - {staff.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={staff.role} disabled className="bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shiftStart">Shift Start</Label>
              <Input id="shiftStart" type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shiftEnd">Shift End</Label>
              <Input id="shiftEnd" type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
