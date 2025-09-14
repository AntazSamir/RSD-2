"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Clock, EyeOff, Search, X } from "lucide-react"
import { mockMenuItems, toggleMenuItemAvailability } from "@/lib/mock-data"
import { EditMenuItemDialog } from "./edit-menu-item-dialog"
import type { MenuItem } from "@/lib/types"

export function UnavailableItemsSection() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [refreshKey, setRefreshKey] = useState(0)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const unavailableItems = mockMenuItems.filter((item) => !item.available)

  const filteredItems = unavailableItems.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
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

  const handleAvailabilityToggle = (menuItemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(menuItemId))

    setTimeout(() => {
      toggleMenuItemAvailability(menuItemId)
      setRefreshKey((prev) => prev + 1)
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(menuItemId)
        return newSet
      })
    }, 300) // Match animation duration
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeOff className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Unavailable Items</h2>
          <Badge variant="secondary" className="ml-2">
            {unavailableItems.length} items
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search unavailable items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="appetizer">Appetizers</SelectItem>
              <SelectItem value="main">Main Courses</SelectItem>
              <SelectItem value="dessert">Desserts</SelectItem>
              <SelectItem value="beverage">Beverages</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || categoryFilter !== "all") && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {(searchQuery || categoryFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {unavailableItems.length} unavailable items
        </div>
      )}

      {/* Content */}
      {unavailableItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <EyeOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-medium mb-2">All items are available!</p>
          <p className="text-sm">No menu items are currently marked as unavailable.</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No items found</p>
          <p className="text-sm">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
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
              {filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={`opacity-75 transition-all duration-300 ease-out ${
                    removingItems.has(item.id)
                      ? "opacity-0 scale-95 -translate-x-2"
                      : "opacity-75 scale-100 translate-x-0"
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
        </div>
      )}
    </div>
  )
}
