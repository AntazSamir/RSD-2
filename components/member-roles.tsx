"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Search,
  Filter,
  Eye,
  Save,
  X,
} from "lucide-react"
import { mockMemberRoles, type MemberRole } from "@/lib/mock-data"

export default function MemberRoles() {
  const [roles, setRoles] = useState(mockMemberRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<MemberRole | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    level: 1,
    color: "#3B82F6",
    isActive: true,
  })

  const availablePermissions = [
    "view_orders",
    "update_orders",
    "manage_tables",
    "view_analytics",
    "staff_management",
    "customer_service",
    "wine_service",
    "manage_reservations",
    "inventory_access",
    "manage_bar",
    "financial_reports",
    "system_settings",
    "all",
  ]

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateRole = () => {
    setEditingRole(null)
    setFormData({
      name: "",
      description: "",
      permissions: [],
      level: 1,
      color: "#3B82F6",
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleEditRole = (role: MemberRole) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      level: role.level,
      color: role.color,
      isActive: role.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleSaveRole = () => {
    if (editingRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...formData }
          : role
      ))
    } else {
      // Create new role
      const newRole: MemberRole = {
        id: (roles.length + 1).toString(),
        ...formData,
      }
      setRoles([...roles, newRole])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteRole = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter(role => role.id !== roleId))
    }
  }

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const getPermissionColor = (permission: string) => {
    const colors: Record<string, string> = {
      "view_orders": "bg-blue-100 text-blue-800",
      "update_orders": "bg-green-100 text-green-800",
      "manage_tables": "bg-purple-100 text-purple-800",
      "view_analytics": "bg-orange-100 text-orange-800",
      "staff_management": "bg-red-100 text-red-800",
      "customer_service": "bg-cyan-100 text-cyan-800",
      "wine_service": "bg-yellow-100 text-yellow-800",
      "manage_reservations": "bg-pink-100 text-pink-800",
      "inventory_access": "bg-indigo-100 text-indigo-800",
      "manage_bar": "bg-amber-100 text-amber-800",
      "financial_reports": "bg-emerald-100 text-emerald-800",
      "system_settings": "bg-gray-100 text-gray-800",
      "all": "bg-red-100 text-red-800",
    }
    return colors[permission] || "bg-gray-100 text-gray-800"
  }

  const getLevelColor = (level: number) => {
    if (level >= 5) return "bg-red-100 text-red-800"
    if (level >= 4) return "bg-orange-100 text-orange-800"
    if (level >= 3) return "bg-yellow-100 text-yellow-800"
    if (level >= 2) return "bg-green-100 text-green-800"
    return "bg-blue-100 text-blue-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stuff Roles</h1>
          <p className="text-muted-foreground">Manage role permissions and access levels</p>
        </div>
        <Button onClick={handleCreateRole} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              {roles.filter(r => r.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Level Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter(r => r.level >= 4).length}
            </div>
            <p className="text-xs text-muted-foreground">Level 4+ roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter(r => r.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((roles.filter(r => r.isActive).length / roles.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(roles.reduce((sum, r) => sum + r.permissions.length, 0) / roles.length)}
            </div>
            <p className="text-xs text-muted-foreground">Per role</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {role.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{role.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(role.level)} variant="outline">
                      Level {role.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge
                          key={permission}
                          className={`${getPermissionColor(permission)} text-xs`}
                          variant="outline"
                        >
                          {permission.replace("_", " ")}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Access Level</Label>
                <Select
                  value={formData.level.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, level: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1 - Basic</SelectItem>
                    <SelectItem value="2">Level 2 - Standard</SelectItem>
                    <SelectItem value="3">Level 3 - Advanced</SelectItem>
                    <SelectItem value="4">Level 4 - Supervisor</SelectItem>
                    <SelectItem value="5">Level 5 - Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter role description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Role Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid gap-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      className="rounded"
                    />
                    <Label
                      htmlFor={permission}
                      className="flex-1 cursor-pointer"
                    >
                      <Badge
                        className={`${getPermissionColor(permission)} text-xs`}
                        variant="outline"
                      >
                        {permission.replace("_", " ")}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active Role</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveRole}>
                <Save className="h-4 w-4 mr-2" />
                {editingRole ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
