"use client"

import { useState, useMemo, useCallback, lazy, Suspense, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SettingsPanel } from "@/components/settings-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ChefHat,
  ClipboardList,
  Users,
  Clock,
  DollarSign,
  Settings,
  BarChart3,
  UtensilsCrossed,
  Grid3X3,
  UserCheck,
  Package,
} from "lucide-react"
import { mockOrders, mockTables, mockStaff } from "@/lib/mock-data"
import { NewOrderDialog } from "@/components/new-order-dialog"
import { EditStaffTimeDialog } from "@/components/edit-staff-time-dialog"
import { OrderDetailsDialog } from "@/components/order-details-dialog"
import { cn } from "@/lib/utils"

const OrdersTable = lazy(() => import("@/components/orders-table").then((module) => ({ default: module.OrdersTable })))
const MenuTable = lazy(() => import("@/components/menu-table").then((module) => ({ default: module.MenuTable })))
const TablesGrid = lazy(() => import("@/components/tables-grid").then((module) => ({ default: module.TablesGrid })))
const AnalyticsDashboard = lazy(() =>
  import("@/components/analytics-dashboard").then((module) => ({ default: module.AnalyticsDashboard })),
)
const BranchReports = lazy(() =>
  import("@/components/branch-reports").then((module) => ({ default: module.BranchReports })),
)
const CustomerManagement = lazy(() =>
  import("@/components/customer-management").then((module) => ({ default: module.CustomerManagement })),
)
const InventoryManagement = lazy(() =>
  import("@/components/inventory-management").then((module) => ({ default: module.InventoryManagement })),
)

const TabLoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [newOrderOpen, setNewOrderOpen] = useState(false)
  const [preSelectedTable, setPreSelectedTable] = useState<string>("")
  const [staffStatus, setStaffStatus] = useState<Record<string, "working" | "absent">>(
    mockStaff.reduce((acc, staff) => ({ ...acc, [staff.id]: staff.status }), {}),
  )
  const [staffTimes, setStaffTimes] = useState<Record<string, { shiftStart: string; shiftEnd: string }>>(
    mockStaff.reduce(
      (acc, staff) => ({ ...acc, [staff.id]: { shiftStart: staff.shiftStart, shiftEnd: staff.shiftEnd } }),
      {},
    ),
  )

  const [lastResetTime, setLastResetTime] = useState<Date>(new Date())
  const [holidays, setHolidays] = useState<string[]>([])
  const [autoResetEnabled, setAutoResetEnabled] = useState(true)
  const [resetInterval, setResetInterval] = useState(12)

  const addHoliday = useCallback((date: string) => {
    setHolidays((prev) => [...prev, date])
  }, [])

  const removeHoliday = useCallback((date: string) => {
    setHolidays((prev) => prev.filter((holiday) => holiday !== date))
  }, [])

  useEffect(() => {
    if (!autoResetEnabled) return

    const checkAutoReset = () => {
      const now = new Date()
      const currentDateStr = now.toISOString().split("T")[0]

      if (holidays.includes(currentDateStr)) {
        return
      }

      const hoursSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60)

      if (hoursSinceReset >= resetInterval) {
        setStaffStatus((prev) =>
          Object.keys(prev).reduce(
            (acc, staffId) => ({
              ...acc,
              [staffId]: "absent",
            }),
            {},
          ),
        )
        setLastResetTime(now)
        console.log("[v0] Auto-reset triggered: All staff marked as absent")
      }
    }

    checkAutoReset()
    const interval = setInterval(checkAutoReset, 60000)

    return () => clearInterval(interval)
  }, [lastResetTime, holidays, autoResetEnabled, resetInterval])

  const dashboardStats = useMemo(() => {
    const activeOrders = mockOrders.filter((order) =>
      ["pending", "confirmed", "preparing"].includes(order.status),
    ).length

    const occupiedTables = mockTables.filter((table) => table.status === "occupied").length
    const todayRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const avgOrderTime = 25
    const occupancyRate = Math.round((occupiedTables / mockTables.length) * 100)

    return {
      activeOrders,
      occupiedTables,
      todayRevenue,
      avgOrderTime,
      occupancyRate,
    }
  }, [])

  const recentOrders = useMemo(() => mockOrders.slice(0, 3), [])

  const getTableOrder = useCallback((tableNumber: number) => {
    return mockOrders.find(
      (order) => order.tableNumber === tableNumber && ["pending", "confirmed", "preparing"].includes(order.status),
    )
  }, [])

  const handleAssignTable = useCallback((tableNumber: string) => {
    const table = mockTables.find((t) => t.number === Number.parseInt(tableNumber))
    if (table?.status === "occupied") {
      return
    }
    setPreSelectedTable(tableNumber)
    setNewOrderOpen(true)
  }, [])

  const handleTableAssigned = useCallback(() => {
    setPreSelectedTable("")
  }, [])

  const handleNewOrderChange = useCallback((open: boolean) => {
    setNewOrderOpen(open)
  }, [])

  const toggleStaffStatus = useCallback((staffId: string) => {
    setStaffStatus((prev) => ({
      ...prev,
      [staffId]: prev[staffId] === "working" ? "absent" : "working",
    }))
  }, [])

  const updateStaffTime = useCallback((staffId: string, shiftStart: string, shiftEnd: string) => {
    setStaffTimes((prev) => ({
      ...prev,
      [staffId]: { shiftStart, shiftEnd },
    }))
  }, [])

  const manualReset = useCallback(() => {
    setStaffStatus((prev) =>
      Object.keys(prev).reduce(
        (acc, staffId) => ({
          ...acc,
          [staffId]: "absent",
        }),
        {},
      ),
    )
    setLastResetTime(new Date())
  }, [])

  const resetSettings = useCallback(() => {
    console.log("[v0] Reset button clicked - starting reset process")

    // Reset auto-reset settings to defaults
    setAutoResetEnabled(true)
    setResetInterval(12)
    setHolidays([])
    setLastResetTime(new Date())

    // Reset staff status to default (all absent)
    setStaffStatus((prev) =>
      Object.keys(prev).reduce(
        (acc, staffId) => ({
          ...acc,
          [staffId]: "absent",
        }),
        {},
      ),
    )

    console.log("[v0] Settings reset completed - autoReset: true, interval: 12, holidays cleared")
  }, []) // Added empty dependency array to prevent recreation on every render

  const navigationItems = [
    { id: "overview", label: "Overview", icon: ClipboardList },
    { id: "orders", label: "Orders", icon: UtensilsCrossed },
    { id: "menu", label: "Menu", icon: ChefHat },
    { id: "tables", label: "Tables", icon: Grid3X3 },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="fixed left-0 top-0 w-48 h-screen border-r bg-card flex flex-col z-40">
        <div className="h-14 sm:h-16 flex items-center px-6 justify-between border-b-0">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">DineFlow</h1>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2 text-slate-900">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all duration-300 ease-out",
                    "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm hover:translate-x-1",
                    "transform-gpu will-change-transform",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
                  <span className="font-normal text-sm">{item.label}</span>
                </button>
              )
            })}

            <div className="py-6">
              <div className="border-t border-border/50"></div>
            </div>

            <button
              onClick={() => setActiveTab("customers")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all duration-300 ease-out",
                "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm hover:translate-x-1",
                "transform-gpu will-change-transform",
                activeTab === "customers"
                  ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "text-muted-foreground",
              )}
            >
              <UserCheck className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
              <span className="font-normal text-sm">Customers</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all duration-300 ease-out",
                "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm hover:translate-x-1",
                "transform-gpu will-change-transform",
                activeTab === "inventory"
                  ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "text-muted-foreground",
              )}
            >
              <Package className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
              <span className="font-normal text-sm">Inventory</span>
            </button>

            <div className="py-3">
              <div className="border-t border-border/50"></div>
            </div>

            <button
              onClick={() => setActiveTab("business")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all duration-300 ease-out",
                "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm hover:translate-x-1",
                "transform-gpu will-change-transform",
                activeTab === "business"
                  ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "text-muted-foreground",
              )}
            >
              <Users className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
              <span className="font-normal text-sm">Business</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all duration-300 ease-out",
                "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm hover:translate-x-1",
                "transform-gpu will-change-transform",
                activeTab === "analytics"
                  ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "text-muted-foreground",
              )}
            >
              <BarChart3 className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
              <span className="font-normal text-sm">Analytics</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all duration-300 ease-out",
              "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm hover:translate-x-1",
              "transform-gpu will-change-transform",
              activeTab === "settings"
                ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                : "text-muted-foreground",
            )}
          >
            <Settings className="h-4 w-4 transition-transform duration-300 ease-out group-hover:scale-110" />
            <span className="font-normal text-sm">Settings</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col ml-48">
        <header className="sticky top-0 z-50 border-b bg-card">
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
            <div></div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Badge variant="outline" className="hidden xs:flex text-xs sm:text-sm">
                <Clock className="mr-1 h-3 w-3" />
                Live Dashboard
              </Badge>
              <Badge variant="secondary" className="hidden sm:flex text-xs">
                Next Reset:{" "}
                {Math.round(resetInterval - (new Date().getTime() - lastResetTime.getTime()) / (1000 * 60 * 60))}h
              </Badge>
              <NewOrderDialog
                open={newOrderOpen}
                onOpenChange={handleNewOrderChange}
                preSelectedTable={preSelectedTable}
                onTableAssigned={handleTableAssigned}
              />
            </div>

            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6">
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.activeOrders}</div>
                    <p className="text-xs text-muted-foreground">+2 from last hour</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupied Tables</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats.occupiedTables}/{mockTables.length}
                    </div>
                    <p className="text-xs text-muted-foreground">{dashboardStats.occupancyRate}% capacity</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${dashboardStats.todayRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Avg Order Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.avgOrderTime}m</div>
                    <p className="text-xs text-muted-foreground">-3m from last week</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base">Table {order.tableNumber}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {order.items.length} items • ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <Badge
                          variant={order.status === "preparing" ? "default" : "secondary"}
                          className="capitalize text-xs ml-2"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Table Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {mockTables.map((table) => {
                        const currentOrder = getTableOrder(table.number)
                        const isOccupied = table.status === "occupied" && currentOrder

                        const tableElement = (
                          <div
                            key={table.id}
                            className={`p-3 sm:p-4 border rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow min-h-[80px] sm:min-h-[auto] flex flex-col justify-center ${
                              table.status === "occupied"
                                ? "bg-red-100/80 dark:bg-red-950/40 border-red-600 dark:border-red-700/50 hover:bg-red-200/80 dark:hover:bg-red-900/50 text-red-900 dark:text-red-100"
                                : table.status === "available" || table.status === "cleaning"
                                  ? "bg-green-100/80 dark:bg-green-950/40 border-green-600 dark:border-green-700/50 hover:bg-green-200/80 dark:hover:bg-green-900/50 text-green-900 dark:text-green-100"
                                  : table.status === "reserved"
                                    ? "bg-yellow-100/80 dark:bg-yellow-950/40 border-yellow-600 dark:border-yellow-700/50 hover:bg-yellow-200/80 dark:hover:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100"
                                    : "bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-800/40 text-gray-800 dark:text-gray-300"
                            }`}
                            onClick={() => !isOccupied && handleAssignTable(table.number.toString())}
                          >
                            <p className="font-medium text-sm sm:text-base">Table {table.number}</p>
                            <p
                              className={`text-xs ${
                                table.status === "occupied"
                                  ? "text-red-800 dark:text-red-200"
                                  : table.status === "available" || table.status === "cleaning"
                                    ? "text-green-800 dark:text-green-200"
                                    : table.status === "reserved"
                                      ? "text-yellow-800 dark:text-yellow-200"
                                      : "text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              Seats {table.capacity}
                            </p>
                            <p
                              className={`text-xs capitalize ${
                                table.status === "occupied"
                                  ? "text-red-800 dark:text-red-200"
                                  : table.status === "available" || table.status === "cleaning"
                                    ? "text-green-800 dark:text-green-200"
                                    : table.status === "reserved"
                                      ? "text-yellow-800 dark:text-yellow-200"
                                      : "text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {table.status === "cleaning" ? "available" : table.status}
                            </p>
                          </div>
                        )

                        return isOccupied ? (
                          <OrderDetailsDialog key={table.id} order={currentOrder} editable={true}>
                            {tableElement}
                          </OrderDetailsDialog>
                        ) : (
                          tableElement
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">Staff Status</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Auto-reset: {autoResetEnabled ? "ON" : "OFF"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setActiveTab("analytics")}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Staff Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={manualReset}
                      className="text-xs px-2 py-1 h-auto bg-transparent"
                    >
                      Reset All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                    <div>
                      <h3 className="font-medium text-sm text-green-800 dark:text-green-300 mb-3">Currently Working</h3>
                      <div className="space-y-2">
                        {mockStaff
                          .filter((staff) => staffStatus[staff.id] === "working")
                          .map((staff) => (
                            <div
                              key={staff.id}
                              className="flex items-center gap-3 p-2 bg-green-100/80 dark:bg-green-950/40 border border-green-600 dark:border-green-700/50 rounded-lg"
                            >
                              <div className="w-8 h-8 bg-green-700 dark:bg-green-800/80 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {staff.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-green-900 dark:text-green-200">{staff.name}</p>
                                <p className="text-xs text-green-800 dark:text-green-300/80">{staff.role}</p>
                              </div>
                              <EditStaffTimeDialog
                                staff={{
                                  ...staff,
                                  shiftStart: staffTimes[staff.id]?.shiftStart || staff.shiftStart,
                                  shiftEnd: staffTimes[staff.id]?.shiftEnd || staff.shiftEnd,
                                }}
                                onTimeUpdate={updateStaffTime}
                              >
                                <button className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                  {staffTimes[staff.id]?.shiftStart || staff.shiftStart} -{" "}
                                  {staffTimes[staff.id]?.shiftEnd || staff.shiftEnd}
                                </button>
                              </EditStaffTimeDialog>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleStaffStatus(staff.id)}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                Mark Absent
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                        Currently Absent
                      </h3>
                      <div className="space-y-2">
                        {mockStaff
                          .filter((staff) => staffStatus[staff.id] === "absent")
                          .map((staff) => (
                            <div
                              key={staff.id}
                              className="flex items-center gap-3 p-2 bg-yellow-100/80 dark:bg-yellow-950/40 border border-yellow-600 dark:border-yellow-700/50 rounded-lg"
                            >
                              <div className="w-8 h-8 bg-yellow-700 dark:bg-yellow-800/80 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {staff.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-yellow-900 dark:text-yellow-100">{staff.name}</p>
                                <p className="text-xs text-yellow-800 dark:text-yellow-300/80">{staff.role}</p>
                              </div>
                              <EditStaffTimeDialog
                                staff={{
                                  ...staff,
                                  shiftStart: staffTimes[staff.id]?.shiftStart || staff.shiftStart,
                                  shiftEnd: staffTimes[staff.id]?.shiftEnd || staff.shiftEnd,
                                }}
                                onTimeUpdate={updateStaffTime}
                              >
                                <button className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                  {staffTimes[staff.id]?.shiftStart || staff.shiftStart} -{" "}
                                  {staffTimes[staff.id]?.shiftEnd || staff.shiftEnd}
                                </button>
                              </EditStaffTimeDialog>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleStaffStatus(staff.id)}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                Mark Present
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <Suspense fallback={<TabLoadingSpinner />}>
              <OrdersTable />
            </Suspense>
          )}

          {activeTab === "menu" && (
            <Suspense fallback={<TabLoadingSpinner />}>
              <MenuTable />
            </Suspense>
          )}

          {activeTab === "tables" && (
            <Suspense fallback={<TabLoadingSpinner />}>
              <TablesGrid />
            </Suspense>
          )}

          {activeTab === "analytics" && (
            <Suspense fallback={<TabLoadingSpinner />}>
              <AnalyticsDashboard />
            </Suspense>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  <h1 className="text-2xl font-bold">Restaurant Settings</h1>
                </div>
                <Button
                  variant="destructive"
                  onClick={resetSettings}
                  className="px-4 py-2"
                  title="Reset all settings to default values"
                  type="button" // Added explicit button type to prevent form submission
                >
                  Reset All Settings
                </Button>
              </div>

              <SettingsPanel
                autoResetEnabled={autoResetEnabled}
                setAutoResetEnabled={setAutoResetEnabled}
                resetInterval={resetInterval}
                setResetInterval={setResetInterval}
                holidays={holidays}
                addHoliday={addHoliday}
                removeHoliday={removeHoliday}
              />
            </div>
          )}

          {activeTab === "customers" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Customer Management</h1>
              </div>

              <Suspense fallback={<TabLoadingSpinner />}>
                <CustomerManagement />
              </Suspense>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Inventory Management</h1>
              </div>

              <Suspense fallback={<TabLoadingSpinner />}>
                <InventoryManagement />
              </Suspense>
            </div>
          )}

          {activeTab === "business" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Business Management</h1>
              </div>

              <Suspense fallback={<TabLoadingSpinner />}>
                <BranchReports />
              </Suspense>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
