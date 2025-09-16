"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { addInventoryItem, getNextInventoryItemId, type InventoryItem } from "@/lib/mock-data"

const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["protein", "vegetables", "dairy", "grains", "beverages", "condiments"]),
  currentStock: z.coerce.number().min(0, "Stock cannot be negative"),
  maxStock: z.coerce.number().min(1, "Max stock must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  costPerUnit: z.coerce.number().min(0, "Cost cannot be negative"),
  supplier: z.string().min(1, "Supplier is required"),
  expiresAt: z.string().min(1, "Expiry date is required"),
  lowStockThreshold: z.coerce.number().min(0, "Low stock threshold cannot be negative"),
})

type InventoryItemFormData = z.infer<typeof inventoryItemSchema>

interface AddInventoryItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categories = [
  { value: "protein", label: "Protein" },
  { value: "vegetables", label: "Vegetables" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "beverages", label: "Beverages" },
  { value: "condiments", label: "Condiments" },
]

const commonUnits = [
  "lbs", "kg", "g", "oz", "portions", "pieces", "bottles", "cans", "bags", "gallons", "liters", "bunches", "heads"
]

export function AddInventoryItemDialog({ open, onOpenChange }: AddInventoryItemDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      category: "protein",
      currentStock: 0,
      maxStock: 10,
      unit: "lbs",
      costPerUnit: 0,
      supplier: "",
      expiresAt: "",
      lowStockThreshold: 1,
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: InventoryItemFormData) => {
    setIsSubmitting(true)
    
    try {
      const newItem: InventoryItem = {
        id: getNextInventoryItemId(),
        name: data.name,
        category: data.category,
        currentStock: data.currentStock,
        maxStock: data.maxStock,
        unit: data.unit,
        costPerUnit: data.costPerUnit,
        totalValue: data.currentStock * data.costPerUnit,
        supplier: data.supplier,
        lastRestocked: new Date(),
        expiresAt: new Date(data.expiresAt),
        lowStockThreshold: data.lowStockThreshold,
      }

      addInventoryItem(newItem)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding inventory item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Inventory Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Salmon Fillet"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value) => setValue("category", value as any)}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  {...register("supplier")}
                  placeholder="e.g., Ocean Fresh Seafood"
                  className={errors.supplier ? "border-red-500" : ""}
                />
                {errors.supplier && (
                  <p className="text-sm text-red-500">{errors.supplier.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={watchedValues.unit}
                  onValueChange={(value) => setValue("unit", value)}
                >
                  <SelectTrigger className={errors.unit ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-sm text-red-500">{errors.unit.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stock Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  {...register("currentStock")}
                  placeholder="0"
                  className={errors.currentStock ? "border-red-500" : ""}
                />
                {errors.currentStock && (
                  <p className="text-sm text-red-500">{errors.currentStock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStock">Max Stock *</Label>
                <Input
                  id="maxStock"
                  type="number"
                  {...register("maxStock")}
                  placeholder="10"
                  className={errors.maxStock ? "border-red-500" : ""}
                />
                {errors.maxStock && (
                  <p className="text-sm text-red-500">{errors.maxStock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold *</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  {...register("lowStockThreshold")}
                  placeholder="1"
                  className={errors.lowStockThreshold ? "border-red-500" : ""}
                />
                {errors.lowStockThreshold && (
                  <p className="text-sm text-red-500">{errors.lowStockThreshold.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cost and Expiry Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cost & Expiry Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost Per Unit ($) *</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="0.01"
                  {...register("costPerUnit")}
                  placeholder="0.00"
                  className={errors.costPerUnit ? "border-red-500" : ""}
                />
                {errors.costPerUnit && (
                  <p className="text-sm text-red-500">{errors.costPerUnit.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiry Date *</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  {...register("expiresAt")}
                  className={errors.expiresAt ? "border-red-500" : ""}
                />
                {errors.expiresAt && (
                  <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
                )}
              </div>
            </div>

            {/* Total Value Display */}
            {watchedValues.currentStock && watchedValues.costPerUnit && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-lg font-semibold">
                  ${(watchedValues.currentStock * watchedValues.costPerUnit).toFixed(2)}
                </p>
              </div>
            )}
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
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
