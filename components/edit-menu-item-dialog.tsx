"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit } from "lucide-react"
import { updateMenuItem } from "@/lib/mock-data"
import type { MenuItem } from "@/lib/types"

interface EditMenuItemDialogProps {
  menuItem: MenuItem
}

export function EditMenuItemDialog({ menuItem }: EditMenuItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: menuItem.name,
    description: menuItem.description || "",
    price: menuItem.price.toString(),
    category: menuItem.category,
    preparationTime: menuItem.preparationTime.toString(),
    available: menuItem.available,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category || !formData.price || !formData.preparationTime) {
      alert("Please fill in all required fields")
      return
    }

    const updatedMenuItem: MenuItem = {
      ...menuItem,
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      preparationTime: Number.parseInt(formData.preparationTime),
      available: formData.available,
    }

    updateMenuItem(updatedMenuItem)
    setOpen(false)
    window.location.reload() // Simple refresh to show updated item
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as MenuItem["category"] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizer">Appetizer</SelectItem>
                  <SelectItem value="main">Main Course</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                  <SelectItem value="beverage">Beverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">Preparation Time (minutes) *</Label>
              <Input
                id="prepTime"
                type="number"
                min="1"
                value={formData.preparationTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, preparationTime: e.target.value }))}
                placeholder="15"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, available: checked as boolean }))}
            />
            <Label htmlFor="edit-available">Available for ordering</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Menu Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
