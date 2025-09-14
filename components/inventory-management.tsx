"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Plus, AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2, Calendar } from "lucide-react"

// Mock inventory data
const mockInventory = [
  {
    id: "1",
    name: "Tomatoes",
    category: "Vegetables",
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unit: "lbs",
    costPerUnit: 2.5,
    supplier: "Fresh Farm Co.",
    lastRestocked: "2024-01-10",
    expiryDate: "2024-01-20",
    status: "in-stock",
  },
  {
    id: "2",
    name: "Chicken Breast",
    category: "Meat",
    currentStock: 8,
    minStock: 15,
    maxStock: 40,
    unit: "lbs",
    costPerUnit: 6.99,
    supplier: "Premium Meats",
    lastRestocked: "2024-01-12",
    expiryDate: "2024-01-18",
    status: "low-stock",
  },
  {
    id: "3",
    name: "Olive Oil",
    category: "Oils & Condiments",
    currentStock: 12,
    minStock: 5,
    maxStock: 20,
    unit: "bottles",
    costPerUnit: 8.5,
    supplier: "Mediterranean Imports",
    lastRestocked: "2024-01-08",
    expiryDate: "2024-12-31",
    status: "in-stock",
  },
  {
    id: "4",
    name: "Salmon Fillet",
    category: "Seafood",
    currentStock: 2,
    minStock: 8,
    maxStock: 25,
    unit: "lbs",
    costPerUnit: 12.99,
    supplier: "Ocean Fresh",
    lastRestocked: "2024-01-14",
    expiryDate: "2024-01-17",
    status: "critical",
  },
  {
    id: "5",
    name: "Pasta",
    category: "Dry Goods",
    currentStock: 45,
    minStock: 20,
    maxStock: 60,
    unit: "boxes",
    costPerUnit: 1.25,
    supplier: "Italian Imports",
    lastRestocked: "2024-01-05",
    expiryDate: "2024-06-30",
    status: "in-stock",
  },
]

export default function InventoryManagement() {
  const [inventory, setInventory] = useState(mockInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newItemOpen, setNewItemOpen] = useState(false)

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalItems = inventory.length
  const lowStockItems = inventory.filter((item) => item.status === "low-stock" || item.status === "critical").length
  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)
  const criticalItems = inventory.filter((item) => item.status === "critical").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStockIcon = (item: any) => {
    if (item.currentStock <= item.minStock * 0.5) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    } else if (item.currentStock <= item.minStock) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    } else {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
  }

  const categories = [...new Set(inventory.map((item) => item.category))]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Badge variant="outline" className="text-xs">
              $
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <p className="text-xs text-muted-foreground">Immediate attention needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Item */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={newItemOpen} onOpenChange={setNewItemOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">
                  Name
                </Label>
                <Input id="itemName" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentStock" className="text-right">
                  Current Stock
                </Label>
                <Input id="currentStock" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minStock" className="text-right">
                  Min Stock
                </Label>
                <Input id="minStock" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <Input id="unit" className="col-span-3" placeholder="e.g., lbs, boxes, bottles" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="costPerUnit" className="text-right">
                  Cost/Unit
                </Label>
                <Input id="costPerUnit" type="number" step="0.01" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Supplier
                </Label>
                <Input id="supplier" className="col-span-3" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewItemOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setNewItemOpen(false)}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStockIcon(item)}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Last restocked: {item.lastRestocked}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {item.currentStock} {item.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${item.costPerUnit.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${(item.currentStock * item.costPerUnit).toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{item.supplier}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.expiryDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status.replace("-", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
