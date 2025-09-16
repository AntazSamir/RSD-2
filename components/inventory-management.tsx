"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Box, Search, Plus, AlertTriangle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { mockInventoryItems, type InventoryItem } from "@/lib/mock-data"
import { AddInventoryItemDialog } from "./add-inventory-item-dialog"
import { EditInventoryItemDialog } from "./edit-inventory-item-dialog"

const categories = [
  { id: "all", label: "All" },
  { id: "protein", label: "Protein" },
  { id: "vegetables", label: "Vegetables" },
  { id: "dairy", label: "Dairy" },
  { id: "grains", label: "Grains" },
  { id: "beverages", label: "Beverages" },
  { id: "condiments", label: "Condiments" },
]

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  // Filter items based on search and category
  const filteredItems = mockInventoryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get low stock items (current stock <= threshold)
  const lowStockItems = mockInventoryItems.filter(
    (item) => item.currentStock <= item.lowStockThreshold
  )

  // Get expiring items (expires within 3 days)
  const expiringItems = mockInventoryItems.filter((item) => {
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return item.expiresAt <= threeDaysFromNow
  })

  const getStockProgressColor = (item: InventoryItem) => {
    if (item.currentStock === 0) return "bg-red-500"
    if (item.currentStock <= item.lowStockThreshold) return "bg-orange-500"
    return "bg-green-500"
  }

  const getStockProgressPercentage = (item: InventoryItem) => {
    return (item.currentStock / item.maxStock) * 100
  }

  const isExpiringSoon = (expiresAt: Date) => {
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return expiresAt <= threeDaysFromNow
  }

  const handleRestock = (item: InventoryItem) => {
    // In a real app, this would open a restock dialog or API call
    console.log("Restock item:", item.name)
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Low Stock Alert */}
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockItems.length > 0 ? (
              <ul className="space-y-1">
                {lowStockItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-sm text-orange-600 dark:text-orange-400">
                    {item.name}
                  </li>
                ))}
                {lowStockItems.length > 3 && (
                  <li className="text-sm text-orange-600 dark:text-orange-400">
                    +{lowStockItems.length - 3} more...
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-orange-600 dark:text-orange-400">No low stock items</p>
            )}
          </CardContent>
        </Card>

        {/* Expiring Soon Alert */}
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringItems.length > 0 ? (
              <ul className="space-y-1">
                {expiringItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-sm text-red-600 dark:text-red-400">
                    {item.name}
                  </li>
                ))}
                {expiringItems.length > 3 && (
                  <li className="text-sm text-red-600 dark:text-red-400">
                    +{expiringItems.length - 3} more...
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">No items expiring soon</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Inventory Items</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Inventory Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {item.category}
                    </Badge>
                  </div>
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stock Level */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stock Level</span>
                    <span>
                      {item.currentStock}/{item.maxStock} {item.unit}
                    </span>
                  </div>
                  <Progress
                    value={getStockProgressPercentage(item)}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>{item.maxStock}</span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Cost/Unit:</span>
                    <div className="font-medium">${item.costPerUnit}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Value:</span>
                    <div className="font-medium">${item.totalValue.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Supplier:</span>
                    <div className="font-medium">{item.supplier}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Restocked:</span>
                    <div className="font-medium">{format(item.lastRestocked, "MMM dd")}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Expires:</span>
                    <div className={`font-medium ${isExpiringSoon(item.expiresAt) ? "text-red-600" : ""}`}>
                      {format(item.expiresAt, "MMM dd")}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestock(item)}
                    className="flex-1"
                  >
                    Restock
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No inventory items found</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddInventoryItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      
      {editingItem && (
        <EditInventoryItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
        />
      )}
    </div>
  )
}