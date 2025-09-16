"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Edit, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { updateCustomer, type Customer } from "@/lib/mock-data"

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  preferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

interface EditCustomerDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCustomerDialog({ customer, open, onOpenChange }: EditCustomerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preferences, setPreferences] = useState<string[]>(customer.preferences || [])
  const [allergies, setAllergies] = useState<string[]>(customer.allergies || [])
  const [newPreference, setNewPreference] = useState("")
  const [newAllergy, setNewAllergy] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      preferences: customer.preferences || [],
      allergies: customer.allergies || [],
      notes: customer.notes || "",
    },
  })

  // Reset form when customer changes
  useEffect(() => {
    reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      preferences: customer.preferences || [],
      allergies: customer.allergies || [],
      notes: customer.notes || "",
    })
    setPreferences(customer.preferences || [])
    setAllergies(customer.allergies || [])
  }, [customer, reset])

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true)
    
    try {
      const updatedCustomer: Customer = {
        ...customer,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferences,
        allergies,
        notes: data.notes,
      }

      updateCustomer(updatedCustomer)
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating customer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const addPreference = () => {
    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
      const updated = [...preferences, newPreference.trim()]
      setPreferences(updated)
      setValue("preferences", updated)
      setNewPreference("")
    }
  }

  const removePreference = (preference: string) => {
    const updated = preferences.filter(p => p !== preference)
    setPreferences(updated)
    setValue("preferences", updated)
  }

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      const updated = [...allergies, newAllergy.trim()]
      setAllergies(updated)
      setValue("allergies", updated)
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    const updated = allergies.filter(a => a !== allergy)
    setAllergies(updated)
    setValue("allergies", updated)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Customer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Enter phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferences</h3>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  placeholder="Add preference"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
                />
                <Button type="button" onClick={addPreference} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {preferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preferences.map((preference, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                    >
                      <span>{preference}</span>
                      <button
                        type="button"
                        onClick={() => removePreference(preference)}
                        className="hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Allergies</h3>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                />
                <Button type="button" onClick={addAllergy} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm"
                    >
                      <span>{allergy}</span>
                      <button
                        type="button"
                        onClick={() => removeAllergy(allergy)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Customer Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add any additional notes about the customer"
                rows={4}
                className={errors.notes ? "border-red-500" : ""}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

