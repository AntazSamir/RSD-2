"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Clock, EyeOff } from "lucide-react"
import { mockMenuItems, toggleMenuItemAvailability } from "@/lib/mock-data"
import { EditMenuItemDialog } from "./edit-menu-item-dialog"
import type { MenuItem } from "@/lib/types"

export function UnavailableItemsDialog() {
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const unavailableItems = mockMenuItems.filter((item) => !item.available)

  const getCategoryColor = (category: MenuItem["category"]) => {
    switch (category) {
      case "appetizer":
        return "bg-green-100 text-green-800 border-green-200"
      case "main":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "dessert":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "beverage":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleAvailabilityToggle = (menuItemId: string) => {
    toggleMenuItemAvailability(menuItemId)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} key={refreshKey}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <EyeOff className="h-4 w-4" />
          Unavailable Items ({unavailableItems.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EyeOff className="h-5 w-5" />
            Unavailable Menu Items
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {unavailableItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">All items are available!</p>
              <p className="text-sm">No menu items are currently marked as unavailable.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Prep Time</TableHead>
                  <TableHead>Make Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unavailableItems.map((item) => (
                  <TableRow key={item.id} className="opacity-75">
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(item.category)} variant="outline">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {item.preparationTime}m
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={item.available} onCheckedChange={() => handleAvailabilityToggle(item.id)} />
                        <span className="text-sm text-green-600 font-medium">Make Available</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <EditMenuItemDialog menuItem={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
