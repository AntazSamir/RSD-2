"use client"

import { useState, useCallback, useMemo, useEffect, lazy, Suspense, memo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  UserX,
  Package,
  User as UserIcon,
  LogOut,
} from "lucide-react"
import { mockOrders, mockTables, mockStaff, mockBranchStaff } from "@/lib/mock-data"
import { NewOrderDialog } from "@/components/new-order-dialog"
import { EditStaffTimeDialog } from "@/components/edit-staff-time-dialog"
import { OrderDetailsDialog } from "@/components/order-details-dialog"
import { cn } from "@/lib/utils"
import { ErrorBoundary } from "@/components/error-boundary"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/bar-chart"
import { ProtectedRoute } from "@/components/protected-route"
import { LogoutButton } from "@/components/logout-button"

const OrdersTable = lazy(() => import("@/components/orders-table").then(module => ({ default: module.OrdersTable })))
const MenuTable = lazy(() => import("@/components/menu-table").then(module => ({ default: module.MenuTable })))
const TablesGrid = lazy(() => import("@/components/tables-grid").then(module => ({ default: module.TablesGrid })))
const AnalyticsDashboard = lazy(() => import("@/components/analytics-dashboard").then(module => ({ default: module.AnalyticsDashboard })))
const BranchReports = lazy(() => import("@/components/branch-reports").then(module => ({ default: module.BranchReports })))
const CustomerManagement = lazy(() => import("@/components/customer-management").then(module => ({ default: module.default })))
const InventoryManagement = lazy(() => import("@/components/inventory-management").then(module => ({ default: module.InventoryManagement })))

const TabLoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

// Memoized components to prevent unnecessary re-renders
const TableTile = memo(({ table, currentOrder, isOccupied, handleAssignTable }: { 
  table: any, 
  currentOrder: any | null, 
  isOccupied: boolean, 
  handleAssignTable: (tableNumber: string) => void 
}) => {
  const bgByStatus =
    table.status === "occupied"
      ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-700/50"
      : table.status === "reserved"
        ? "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-700/50"
        : table.status === "cleaning"
          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-700/50"
          : "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-700/50"

  const dotByStatus =
    table.status === "occupied" ? "bg-red-500" :
    table.status === "reserved" ? "bg-yellow-500" :
    table.status === "cleaning" ? "bg-blue-500" : "bg-green-500"

  const pillText = table.status === "cleaning" ? "available" : table.status

  const tile = (
    <div
      className={`group border rounded-lg p-2 sm:p-3 hover:shadow-sm transition-colors ${bgByStatus}`}
      onClick={() => !isOccupied && handleAssignTable(table.number.toString())}
    >
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotByStatus}`}></span>
        <span className="font-medium text-sm">Table {table.number}</span>
      </div>
      <div className="mt-2">
        <span className="inline-block text-[11px] px-2 py-0.5 rounded-full border capitalize">
          {pillText}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Seats {table.capacity}</span>
        {isOccupied && currentOrder && (
          <span className="font-medium text-foreground">${currentOrder.totalAmount.toFixed(2)}</span>
        )}
      </div>
    </div>
  )

  return isOccupied && currentOrder ? (
    <OrderDetailsDialog key={table.id} order={currentOrder} editable={true}>
      {tile}
    </OrderDetailsDialog>
  ) : (
    tile
  )
})

TableTile.displayName = 'TableTile'

const StaffMember = memo(({ staff, staffStatus, staffTimes, toggleStaffStatus, updateStaffTime }: { 
  staff: any, 
  staffStatus: Record<string, "working" | "absent">,
  staffTimes: Record<string, { shiftStart: string; shiftEnd: string }>,
  toggleStaffStatus: (staffId: string) => void,
  updateStaffTime: (staffId: string, shiftStart: string, shiftEnd: string) => void
}) => {
  const isWorking = staffStatus[staff.id] === "working"

  return (
    <div key={staff.id} className="flex items-center gap-3 py-1.5 px-2">
      <div className={`w-6 h-6 bg-${isWorking ? 'green' : 'yellow'}-700 text-white rounded-full flex items-center justify-center text-[11px] font-medium`}>
        {staff.avatar}
      </div>
      <div className="flex-1 min-w-0 leading-tight">
        <p className="text-sm font-medium truncate">{staff.name}</p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">{staff.role}</span>
          <span className="hidden xs:inline">•</span>
          <EditStaffTimeDialog
            staff={{
              ...staff,
              shiftStart: staffTimes[staff.id]?.shiftStart || staff.shiftStart,
              shiftEnd: staffTimes[staff.id]?.shiftEnd || staff.shiftEnd,
            }}
            onTimeUpdate={updateStaffTime}
          >
            <button className="hover:text-primary">
              {(staffTimes[staff.id]?.shiftStart || staff.shiftStart) + " - " + (staffTimes[staff.id]?.shiftEnd || staff.shiftEnd)}
            </button>
          </EditStaffTimeDialog>
        </div>
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={() => toggleStaffStatus(staff.id)}
        className="h-7 w-7"
        title={isWorking ? "Mark Absent" : "Mark Present"}
      >
        {isWorking ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
        <span className="sr-only">{isWorking ? "Mark Absent" : "Mark Present"}</span>
      </Button>
    </div>
  )
})

StaffMember.displayName = 'StaffMember'

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [revenuePeriod, setRevenuePeriod] = useState<"monthly" | "weekly" | "today">("monthly")
  const [ordersPeriod, setOrdersPeriod] = useState<"monthly" | "weekly" | "today">("weekly")
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
  const [settingsResetTrigger, setSettingsResetTrigger] = useState(0)

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

  // Memoize expensive calculations
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
  }, []) // Only recompute when mock data changes

  // Memoize chart data to prevent recalculation on every render
  const overviewCharts = useMemo(() => {
    // Generate simple, deterministic-ish demo data using mockOrders totals
    const baseRevenue = mockOrders.reduce((s, o) => s + o.totalAmount, 0)
    const baseOrders = mockOrders.length

    const monthlyRevenue = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => ({
      month: m,
      income: Math.round(baseRevenue * (0.45 + 0.08 * i)),
      expenses: Math.round(baseRevenue * (0.30 + 0.05 * i)),
    }))

    const weeklyRevenue = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
      day: d,
      income: Math.round(baseRevenue * (0.10 + 0.02 * i)),
      expenses: Math.round(baseRevenue * (0.06 + 0.015 * i)),
    }))

    const todayRevenue = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"].map((t, i) => ({
      time: t,
      income: Math.round(baseRevenue * (0.02 + 0.01 * i)),
      expenses: Math.round(baseRevenue * (0.012 + 0.006 * i)),
    }))

    const ordersWeekly = ["Jun 24", "Jun 25", "Jun 26", "Jun 27"].map((d, i) => ({
      date: d,
      dineIn: Math.round(baseOrders * (0.15 + 0.05 * (i % 3))),
      takeAway: Math.round(baseOrders * (0.10 + 0.04 * (i % 2))),
      delivery: Math.round(baseOrders * (0.08 + 0.03 * i)),
    }))

    const ordersMonthly = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => ({
      date: m,
      dineIn: Math.round(baseOrders * (0.5 + 0.05 * i)),
      takeAway: Math.round(baseOrders * (0.35 + 0.03 * i)),
      delivery: Math.round(baseOrders * (0.25 + 0.02 * i)),
    }))

    const ordersToday = ["10AM", "12PM", "2PM", "4PM", "6PM", "8PM"].map((t, i) => ({
      date: t,
      dineIn: Math.round(baseOrders * (0.06 + 0.01 * i)),
      takeAway: Math.round(baseOrders * (0.04 + 0.008 * i)),
      delivery: Math.round(baseOrders * (0.03 + 0.006 * i)),
    }))

    return {
      revenue: { monthly: monthlyRevenue, weekly: weeklyRevenue, today: todayRevenue },
      orders: { monthly: ordersMonthly, weekly: ordersWeekly, today: ordersToday },
    }
  }, []) // Only calculate once

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

    // Trigger settings panel reset
    setSettingsResetTrigger(prev => prev + 1)

    console.log("[v0] Settings reset completed - autoReset: true, interval: 12, holidays cleared")
  }, [])

  const navigationItems = [
    { id: "overview", label: "Overview", icon: ClipboardList },
    { id: "orders", label: "Orders", icon: UtensilsCrossed },
    { id: "menu", label: "Menu", icon: ChefHat },
  ]

  return (
    <ProtectedRoute>
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
                <NewOrderDialog
                  open={newOrderOpen}
                  onOpenChange={handleNewOrderChange}
                  preSelectedTable={preSelectedTable}
                  onTableAssigned={handleTableAssigned}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium">
                    {mockBranchStaff[0]?.name || "Manager"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mockBranchStaff[0]?.role || "Administrator"}
                  </span>
                </div>
                <div className="relative group">
                  <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
                    <div className="bg-primary/10 rounded-full p-2">
                      <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent w-full">
                      <UserIcon className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <div className="px-4 py-2">
                      <LogoutButton />
                    </div>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-6">
            {activeTab === "overview" && (
              <ErrorBoundary>
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Menus</CardTitle>
                        <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">120</div>
                        <div className="text-xs text-muted-foreground">0%</div>
                        <Progress value={45} className="h-2" />
                        <div className="absolute right-3 top-3 bg-foreground text-background rounded-md px-2 py-1 text-[10px]">45%</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">{mockOrders.length}</div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>62%</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Client Today</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">240</div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>80%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Day Ratio</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">140</div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Row */}
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card>
                      <CardHeader className="flex items-center justify-between">
                        <CardTitle>Revenue</CardTitle>
                        <div className="flex gap-2 text-xs">
                          <Button variant={revenuePeriod === "monthly" ? "default" : "outline"} size="sm" onClick={() => setRevenuePeriod("monthly")}>Monthly</Button>
                          <Button variant={revenuePeriod === "weekly" ? "default" : "outline"} size="sm" onClick={() => setRevenuePeriod("weekly")}>Weekly</Button>
                          <Button variant={revenuePeriod === "today" ? "default" : "outline"} size="sm" onClick={() => setRevenuePeriod("today")}>Today</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={
                            revenuePeriod === "monthly" ? overviewCharts.revenue.monthly :
                            revenuePeriod === "weekly" ? overviewCharts.revenue.weekly : overviewCharts.revenue.today
                          }>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={revenuePeriod === "monthly" ? "month" : revenuePeriod === "weekly" ? "day" : "time"} />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="income" stroke="#111827" strokeWidth={2} />
                            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex items-center justify-between">
                        <CardTitle>Orders Summary</CardTitle>
                        <div className="flex gap-2 text-xs">
                          <Button variant={ordersPeriod === "monthly" ? "default" : "outline"} size="sm" onClick={() => setOrdersPeriod("monthly")}>Monthly</Button>
                          <Button variant={ordersPeriod === "weekly" ? "default" : "outline"} size="sm" onClick={() => setOrdersPeriod("weekly")}>Weekly</Button>
                          <Button variant={ordersPeriod === "today" ? "default" : "outline"} size="sm" onClick={() => setOrdersPeriod("today")}>Today</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer
                          config={{
                            dineIn: {
                              label: "Dine In",
                              color: "#111827",
                            },
                            takeAway: {
                              label: "Take Away",
                              color: "#c7d2fe",
                            },
                            delivery: {
                              label: "Delivery",
                              color: "#9ca3af",
                            },
                          }}
                          className="h-[280px] w-full"
                        >
                          <BarChart
                            data={ordersPeriod === "monthly" ? overviewCharts.orders.monthly : ordersPeriod === "weekly" ? overviewCharts.orders.weekly : overviewCharts.orders.today}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 20,
                            }}
                          >
                            <CartesianGrid vertical={false} />
                            <XAxis
                              dataKey="date"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="dineIn" fill="var(--color-dineIn)" radius={4} />
                            <Bar dataKey="takeAway" fill="var(--color-takeAway)" radius={4} />
                            <Bar dataKey="delivery" fill="var(--color-delivery)" radius={4} />
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order List */}
                  <Card>
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle>Order List</CardTitle>
                      <div className="hidden sm:flex gap-2 text-xs">
                        <Button variant="outline" size="sm">Monthly</Button>
                        <Button variant="outline" size="sm">Weekly</Button>
                        <Button variant="default" size="sm">Today</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-muted-foreground">
                              <th className="text-left py-2">No</th>
                              <th className="text-left py-2">ID</th>
                              <th className="text-left py-2">Date</th>
                              <th className="text-left py-2">Customer Name</th>
                              <th className="text-left py-2">Location</th>
                              <th className="text-left py-2">Amount</th>
                              <th className="text-left py-2">Status Order</th>
                              <th className="text-left py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockOrders.slice(0, 8).map((order, idx) => (
                              <tr key={order.id} className="border-b">
                                <td className="py-2">{idx + 1}</td>
                                <td className="py-2">#{order.id}</td>
                                <td className="py-2">{order.createdAt.toLocaleDateString()}</td>
                                <td className="py-2">Table {order.tableNumber}</td>
                                <td className="py-2">Corner Street 5th Londo</td>
                                <td className="py-2">${order.totalAmount.toFixed(2)}</td>
                                <td className="py-2">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
                                    <Badge variant={order.status === "pending" ? "secondary" : order.status === "preparing" ? "default" : "outline"} className="text-xs capitalize">
                                      {order.status === "pending" ? "New Order" : order.status}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="py-2">
                                  <OrderDetailsDialog order={order} editable={true}>
                                    <Button size="sm" variant="outline">View</Button>
                                  </OrderDetailsDialog>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Table Status and Staff Status */}
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Table Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Legend */}
                        <div className="mb-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Occupied</span>
                          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Available</span>
                          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Reserved</span>
                          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Cleaning</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                          {mockTables.map((table) => {
                            const currentOrder = getTableOrder(table.number)
                            const isOccupied = table.status === "occupied" && currentOrder ? true : false

                            return (
                              <TableTile
                                key={table.id}
                                table={table}
                                currentOrder={currentOrder || null}
                                isOccupied={isOccupied}
                                handleAssignTable={handleAssignTable}
                              />
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

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
                            <div className="rounded-md border divide-y">
                              {mockStaff
                                .filter((staff) => staffStatus[staff.id] === "working")
                                .map((staff) => (
                                  <StaffMember
                                    key={staff.id}
                                    staff={staff}
                                    staffStatus={staffStatus}
                                    staffTimes={staffTimes}
                                    toggleStaffStatus={toggleStaffStatus}
                                    updateStaffTime={updateStaffTime}
                                  />
                                ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-sm text-yellow-800 dark:text-yellow-300 mb-3">Currently Absent</h3>
                            <div className="rounded-md border divide-y">
                              {mockStaff
                                .filter((staff) => staffStatus[staff.id] === "absent")
                                .map((staff) => (
                                  <StaffMember
                                    key={staff.id}
                                    staff={staff}
                                    staffStatus={staffStatus}
                                    staffTimes={staffTimes}
                                    toggleStaffStatus={toggleStaffStatus}
                                    updateStaffTime={updateStaffTime}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ErrorBoundary>
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
                    className="px-4 py-2 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
                    title="Reset all settings to default values"
                    type="button"
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
                  resetTrigger={settingsResetTrigger}
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
    </ProtectedRoute>
  )
}
