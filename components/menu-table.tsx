"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Clock, Trash2, Search, EyeOff } from "lucide-react"
import { mockMenuItems, deleteMenuItem, toggleMenuItemAvailability } from "@/lib/mock-data"
import { useMenuFilters } from "@/hooks/use-menu-filters"
import { AddMenuItemDialog } from "./add-menu-item-dialog"
import { EditMenuItemDialog } from "./edit-menu-item-dialog"
import { UnavailableItemsSection } from "./unavailable-items-section"
import type { MenuItem } from "@/lib/types"

export function MenuTable() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set())
  const [togglingItems, setTogglingItems] = useState<Set<string>>(new Set())

  const menuFilters = useMenuFilters(mockMenuItems)

  const filteredItems = menuFilters.filteredItems.filter((item) => {
    const isAvailable = item.available || removingItems.has(item.id)
    return isAvailable
  })

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

  const handleDelete = async (menuItemId: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      setDeletingItems((prev) => new Set(prev).add(menuItemId))

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        deleteMenuItem(menuItemId)
        window.location.reload()
      } finally {
        setDeletingItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(menuItemId)
          return newSet
        })
      }
    }
  }

  const handleAvailabilityToggle = async (menuItemId: string) => {
    const item = mockMenuItems.find((i) => i.id === menuItemId)

    setTogglingItems((prev) => new Set(prev).add(menuItemId))

    try {
      if (item?.available) {
        setRemovingItems((prev) => new Set(prev).add(menuItemId))

        setTimeout(async () => {
          await new Promise((resolve) => setTimeout(resolve, 300))
          toggleMenuItemAvailability(menuItemId)
          setRemovingItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(menuItemId)
            return newSet
          })
          setRefreshKey((prev) => prev + 1)
        }, 300)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500))
        toggleMenuItemAvailability(menuItemId)
        setRefreshKey((prev) => prev + 1)
      }
    } finally {
      setTimeout(
        () => {
          setTogglingItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(menuItemId)
            return newSet
          })
        },
        item?.available ? 600 : 500,
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <Button
          variant={!showUnavailable ? "default" : "outline"}
          onClick={() => setShowUnavailable(false)}
          className="flex-1 sm:flex-none"
        >
          Menu Management
        </Button>
        <Button
          variant={showUnavailable ? "default" : "outline"}
          onClick={() => setShowUnavailable(true)}
          className="flex-1 sm:flex-none gap-2"
        >
          <EyeOff className="h-4 w-4" />
          Unavailable Items ({mockMenuItems.filter((item) => !item.available).length})
        </Button>
      </div>

      {showUnavailable ? (
        <UnavailableItemsSection />
      ) : (
        <Card key={refreshKey}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Menu Management</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={menuFilters.searchQuery}
                  onChange={(e) => menuFilters.setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={menuFilters.selectedCategory} onValueChange={menuFilters.setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="appetizer">Appetizers</SelectItem>
                  <SelectItem value="main">Main Courses</SelectItem>
                  <SelectItem value="dessert">Desserts</SelectItem>
                  <SelectItem value="beverage">Beverages</SelectItem>
                </SelectContent>
              </Select>
              <AddMenuItemDialog />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Prep Time</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const isDeleting = deletingItems.has(item.id)
                  const isToggling = togglingItems.has(item.id)

                  return (
                    <TableRow
                      key={item.id}
                      className={`transition-all duration-300 ease-out ${
                        removingItems.has(item.id)
                          ? "opacity-0 transform scale-95 -translate-x-2"
                          : isDeleting || isToggling
                            ? "opacity-50"
                            : "opacity-100 transform scale-100 translate-x-0"
                      }`}
                    >
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
                        <div className="flex items-center gap-2 transition-all duration-300 ease-in-out">
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => handleAvailabilityToggle(item.id)}
                            className="transition-all duration-200 ease-in-out"
                            disabled={isToggling}
                          />
                          <span
                            className={`text-sm transition-all duration-300 ease-in-out transform ${
                              item.available ? "text-green-600 scale-100" : "text-red-500 scale-95"
                            }`}
                          >
                            {isToggling ? "Updating..." : item.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditMenuItemDialog menuItem={item} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.name)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No menu items found matching your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
