"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Download,
  Users,
  UserCheck,
  UserX,
  Timer,
} from "lucide-react"
import { mockOrders, mockMenuItems, mockStaff as centralMockStaff } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StaffDetailsDialog } from "./staff-details-dialog"
import type { Staff } from "@/lib/types" // Import the correct Staff type

const COLORS = ["#00AEEF", "#FF6B35", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]

const AnalyticsDashboardComponent = () => {
  const [reportType, setReportType] = useState<"sales" | "staff">("sales")
  const [dateRange, setDateRange] = useState("7d")
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [staffDialogOpen, setStaffDialogOpen] = useState(false)

  const mockStaffData = centralMockStaff.map((staff) => ({
    id: Number(staff.id),
    name: staff.name,
    role: staff.role,
    hoursWorked: staff.dailyHours,
    entryTime: staff.entryTime,
    exitTime: staff.exitTime,
    status: staff.status === "working" ? "present" : "absent",
    efficiency: staff.efficiency,
    ordersHandled: Math.floor(staff.efficiency * 0.5), // Derive orders from efficiency
  }))

  const analyticsData = useMemo(() => {
    const now = new Date()
    let startDate: Date

    switch (dateRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Filter orders based on date range (simulating date-based filtering)
    const filteredOrders = mockOrders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= startDate && orderDate <= now && order.status === "served"
    })

    // Calculate metrics based on filtered data
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = filteredOrders.length
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

    // Generate realistic category revenue based on date range
    const categoryRevenue = mockMenuItems.reduce(
      (acc, item) => {
        const category = item.category
        const orderItems = filteredOrders.flatMap((order) => order.items)
        // Fix: Use menuItemId to find the menu item instead of name
        const itemOrders = orderItems.filter((orderItem) => {
          const menuItem = mockMenuItems.find(mi => mi.id === orderItem.menuItemId)
          return menuItem?.name === item.name
        })
        const revenue = itemOrders.reduce((sum, orderItem) => sum + orderItem.price * orderItem.quantity, 0)

        acc[category] = (acc[category] || 0) + revenue
        return acc
      },
      {} as Record<string, number>,
    )

    // Generate item sales based on filtered orders
    const itemSales = mockMenuItems
      .map((item) => {
        const orderItems = filteredOrders.flatMap((order) => order.items)
        // Fix: Use menuItemId to find the menu item instead of name
        const itemOrders = orderItems.filter((orderItem) => {
          const menuItem = mockMenuItems.find(mi => mi.id === orderItem.menuItemId)
          return menuItem?.name === item.name
        })
        const quantity = itemOrders.reduce((sum, orderItem) => sum + orderItem.quantity, 0)
        const revenue = itemOrders.reduce((sum, orderItem) => sum + orderItem.price * orderItem.quantity, 0)

        return {
          name: item.name,
          quantity,
          revenue,
          category: item.category,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)

    const getSalesTrend = () => {
      const baseMultiplier = dateRange === "1d" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
      const variance = () => Math.random() * 0.4 + 0.8 // 80-120% variance

      if (dateRange === "1d") {
        return [
          { day: "6AM", sales: Math.round(120 * variance()), orders: Math.round(6 * variance()) },
          { day: "9AM", sales: Math.round(280 * variance()), orders: Math.round(12 * variance()) },
          { day: "12PM", sales: Math.round(520 * variance()), orders: Math.round(24 * variance()) },
          { day: "3PM", sales: Math.round(380 * variance()), orders: Math.round(18 * variance()) },
          { day: "6PM", sales: Math.round(680 * variance()), orders: Math.round(32 * variance()) },
          { day: "9PM", sales: Math.round(420 * variance()), orders: Math.round(16 * variance()) },
        ]
      } else if (dateRange === "7d") {
        return [
          { day: "Mon", sales: Math.round(1100 * variance()), orders: Math.round(42 * variance()) },
          { day: "Tue", sales: Math.round(1650 * variance()), orders: Math.round(58 * variance()) },
          { day: "Wed", sales: Math.round(1480 * variance()), orders: Math.round(54 * variance()) },
          { day: "Thu", sales: Math.round(2050 * variance()), orders: Math.round(72 * variance()) },
          { day: "Fri", sales: Math.round(2600 * variance()), orders: Math.round(88 * variance()) },
          { day: "Sat", sales: Math.round(2950 * variance()), orders: Math.round(105 * variance()) },
          { day: "Sun", sales: Math.round(2200 * variance()), orders: Math.round(78 * variance()) },
        ]
      } else if (dateRange === "30d") {
        return [
          { day: "Week 1", sales: Math.round(11500 * variance()), orders: Math.round(390 * variance()) },
          { day: "Week 2", sales: Math.round(14600 * variance()), orders: Math.round(485 * variance()) },
          { day: "Week 3", sales: Math.round(13100 * variance()), orders: Math.round(445 * variance()) },
          { day: "Week 4", sales: Math.round(15500 * variance()), orders: Math.round(540 * variance()) },
        ]
      } else {
        return [
          { day: "Month 1", sales: Math.round(41500 * variance()), orders: Math.round(1380 * variance()) },
          { day: "Month 2", sales: Math.round(48000 * variance()), orders: Math.round(1620 * variance()) },
          { day: "Month 3", sales: Math.round(44200 * variance()), orders: Math.round(1495 * variance()) },
        ]
      }
    }

    const getPeakHours = () => {
      const multiplier = dateRange === "1d" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
      const variance = () => Math.random() * 0.3 + 0.85 // 85-115% variance

      return [
        { hour: "11AM", orders: Math.round(10 * multiplier * variance()) },
        { hour: "12PM", orders: Math.round(25 * multiplier * variance()) },
        { hour: "1PM", orders: Math.round(32 * multiplier * variance()) },
        { hour: "2PM", orders: Math.round(20 * multiplier * variance()) },
        { hour: "6PM", orders: Math.round(40 * multiplier * variance()) },
        { hour: "7PM", orders: Math.round(48 * multiplier * variance()) },
        { hour: "8PM", orders: Math.round(35 * multiplier * variance()) },
        { hour: "9PM", orders: Math.round(22 * multiplier * variance()) },
      ]
    }

    // Generate a weekly heatmap (7 days x 24 hours) for Peak Hours visualization
    const getPeakHoursHeatmap = () => {
      // Base profile: low overnight, lunch (12-14), dinner (18-21) peaks
      const baseHourIntensity = (hour: number) => {
        // hour is 0-23
        const lunchPeak = Math.exp(-0.5 * Math.pow((hour - 13) / 1.5, 2))
        const dinnerPeak = Math.exp(-0.5 * Math.pow((hour - 19) / 1.8, 2))
        const breakfast = Math.exp(-0.5 * Math.pow((hour - 9) / 1.8, 2)) * 0.6
        const lateNight = Math.exp(-0.5 * Math.pow((hour - 22) / 1.6, 2)) * 0.3
        return 0.05 + lunchPeak * 1.0 + dinnerPeak * 1.2 + breakfast + lateNight
      }

      const dayMultiplier = (dayIndex: number) => {
        // 0=Mon .. 6=Sun ; weekends busier
        if (dayIndex === 5) return 1.2
        if (dayIndex === 6) return 1.35
        return 1 + (dayIndex % 2 === 0 ? 0.05 : -0.02)
      }

      const rangeMultiplier = dateRange === "1d" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return days.map((day, d) => {
        const hours = Array.from({ length: 24 }, (_, h) => {
          const base = baseHourIntensity(h)
          const noise = 0.85 + Math.random() * 0.3
          const value = Math.round(8 * base * dayMultiplier(d) * rangeMultiplier * noise)
          return { hour: h, value }
        })
        return { day, hours }
      })
    }

    const getCustomerMetrics = () => {
      const baseNew = dateRange === "1d" ? 6 : dateRange === "7d" ? 38 : dateRange === "30d" ? 165 : 485
      const baseReturning = dateRange === "1d" ? 12 : dateRange === "7d" ? 70 : dateRange === "30d" ? 300 : 850
      const variance = () => Math.random() * 0.25 + 0.875 // 87.5-112.5% variance

      return {
        newCustomers: Math.round(baseNew * variance()),
        returningCustomers: Math.round(baseReturning * variance()),
      }
    }

    const customerMetrics = getCustomerMetrics()

    return {
      totalSales,
      totalOrders,
      avgOrderValue,
      categoryRevenue,
      topItems: itemSales.slice(0, 10),
      leastItems: itemSales.slice(-5).reverse(),
      salesTrend: getSalesTrend(),
      peakHours: getPeakHours(),
      peakHoursHeatmap: getPeakHoursHeatmap(),
      newCustomers: customerMetrics.newCustomers,
      returningCustomers: customerMetrics.returningCustomers,
      avgPrepTime: Math.round(15 + Math.random() * 6), // 15-21 minutes with variance
    }
  }, [dateRange])

  const staffAnalyticsData = useMemo(() => {
    const now = new Date()
    let startDate: Date

    switch (dateRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Simulate staff data filtering based on date range
    const presentStaff = mockStaffData.filter((staff) => staff.status === "present")
    const absentStaff = mockStaffData.filter((staff) => staff.status === "absent")
    const onLeaveStaff = mockStaffData.filter((staff) => staff.status === "on leave")

    // Calculate metrics with date range scaling
    const multiplier = dateRange === "1d" ? 1 : dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
    const totalHoursWorked = Math.round(
      presentStaff.reduce((sum, staff) => sum + staff.hoursWorked, 0) * multiplier * (0.8 + Math.random() * 0.4),
    )
    const avgEfficiency =
      presentStaff.length > 0
        ? Math.round(
            (presentStaff.reduce((sum, staff) => sum + staff.efficiency, 0) / presentStaff.length) *
              (0.9 + Math.random() * 0.2),
          )
        : 0
    const totalOrdersHandled = Math.round(
      presentStaff.reduce((sum, staff) => sum + staff.ordersHandled, 0) * multiplier * (0.85 + Math.random() * 0.3),
    )

    const staffPerformance = mockStaffData.map((staff) => ({
      name: staff.name,
      efficiency: Math.round(staff.efficiency * (0.9 + Math.random() * 0.2)),
      orders: Math.round(staff.ordersHandled * multiplier * (0.8 + Math.random() * 0.4)),
      hours: Math.round(staff.hoursWorked * multiplier * (0.85 + Math.random() * 0.3)),
    }))

    const roleDistribution = mockStaffData.reduce(
      (acc, staff) => {
        acc[staff.role] = (acc[staff.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const getAttendanceTrend = () => {
      const variance = () => Math.random() * 0.15 + 0.925 // 92.5-107.5% variance

      if (dateRange === "1d") {
        return [
          {
            day: "6AM",
            present: Math.round(2 * variance()),
            absent: Math.round(3 * variance()),
            efficiency: Math.round(82 + Math.random() * 8),
          },
          {
            day: "9AM",
            present: Math.round(4 * variance()),
            absent: Math.round(1 * variance()),
            efficiency: Math.round(88 + Math.random() * 8),
          },
          {
            day: "12PM",
            present: Math.round(5 * variance()),
            absent: 0,
            efficiency: Math.round(92 + Math.random() * 8),
          },
          {
            day: "3PM",
            present: Math.round(5 * variance()),
            absent: 0,
            efficiency: Math.round(90 + Math.random() * 8),
          },
          {
            day: "6PM",
            present: Math.round(5 * variance()),
            absent: 0,
            efficiency: Math.round(94 + Math.random() * 6),
          },
          {
            day: "9PM",
            present: Math.round(3 * variance()),
            absent: Math.round(2 * variance()),
            efficiency: Math.round(84 + Math.random() * 8),
          },
        ]
      } else if (dateRange === "7d") {
        return [
          {
            day: "Mon",
            present: Math.round(5 * variance()),
            absent: 0,
            efficiency: Math.round(88 + Math.random() * 8),
          },
          {
            day: "Tue",
            present: Math.round(4 * variance()),
            absent: Math.round(1 * variance()),
            efficiency: Math.round(84 + Math.random() * 8),
          },
          {
            day: "Wed",
            present: Math.round(5 * variance()),
            absent: 0,
            efficiency: Math.round(90 + Math.random() * 8),
          },
          {
            day: "Thu",
            present: Math.round(4 * variance()),
            absent: Math.round(1 * variance()),
            efficiency: Math.round(82 + Math.random() * 8),
          },
          {
            day: "Fri",
            present: Math.round(5 * variance()),
            absent: 0,
            efficiency: Math.round(92 + Math.random() * 8),
          },
          {
            day: "Sat",
            present: Math.round(5 * variance()),
            absent: 0,
            efficiency: Math.round(86 + Math.random() * 8),
          },
          {
            day: "Sun",
            present: Math.round(3 * variance()),
            absent: Math.round(2 * variance()),
            efficiency: Math.round(81 + Math.random() * 8),
          },
        ]
      } else if (dateRange === "30d") {
        return [
          {
            day: "Week 1",
            present: Math.round(30 * variance()),
            absent: Math.round(5 * variance()),
            efficiency: Math.round(87 + Math.random() * 8),
          },
          {
            day: "Week 2",
            present: Math.round(28 * variance()),
            absent: Math.round(7 * variance()),
            efficiency: Math.round(85 + Math.random() * 8),
          },
          {
            day: "Week 3",
            present: Math.round(31 * variance()),
            absent: Math.round(4 * variance()),
            efficiency: Math.round(89 + Math.random() * 8),
          },
          {
            day: "Week 4",
            present: Math.round(29 * variance()),
            absent: Math.round(6 * variance()),
            efficiency: Math.round(83 + Math.random() * 8),
          },
        ]
      } else {
        return [
          {
            day: "Month 1",
            present: Math.round(118 * variance()),
            absent: Math.round(22 * variance()),
            efficiency: Math.round(86 + Math.random() * 8),
          },
          {
            day: "Month 2",
            present: Math.round(124 * variance()),
            absent: Math.round(16 * variance()),
            efficiency: Math.round(88 + Math.random() * 8),
          },
          {
            day: "Month 3",
            present: Math.round(120 * variance()),
            absent: Math.round(20 * variance()),
            efficiency: Math.round(84 + Math.random() * 8),
          },
        ]
      }
    }

    return {
      totalStaff: mockStaffData.length,
      presentStaff: presentStaff.length,
      absentStaff: absentStaff.length,
      onLeave: onLeaveStaff.length,
      totalHoursWorked,
      avgEfficiency,
      totalOrdersHandled,
      staffPerformance,
      roleDistribution,
      attendanceTrend: getAttendanceTrend(),
      attendanceRate: Math.round((presentStaff.length / mockStaffData.length) * 100 * (0.9 + Math.random() * 0.2)),
    }
  }, [dateRange])

  const exportStaffListToExcel = () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)

          const staffListData = centralMockStaff.map((staff) => ({
            Name: staff.fullName,
            Role: staff.role,
            Status: staff.status,
            "Daily Hours": staff.dailyHours,
            "Entry Time": staff.entryTime,
            "Exit Time": staff.exitTime,
            "Agreed Salary": staff.agreedSalary,
            "Advanced Taken": staff.advancedSalaryTaken,
            Remaining: staff.agreedSalary - staff.advancedSalaryTaken,
            Efficiency: `${staff.efficiency}%`,
            Contact: staff.contactNumber,
            "Date of Joining": staff.dateOfJoining.toLocaleDateString(),
          }))

          // Convert to CSV
          const headers = Object.keys(staffListData[0])
          const csvContent = [
            headers.join(","),
            ...staffListData.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")),
          ].join("\n")

          // Download file
          const blob = new Blob([csvContent], { type: "text/csv" })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `staff_list_report_${new Date().toISOString().split("T")[0]}.csv`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)

          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const handleStaffClick = (staff: Staff) => {
    setSelectedStaff(staff)
    setStaffDialogOpen(true)
  }

  const parseReportData = (reportType: string) => {
    if (reportType === "staff") {
      const summaryMetrics = {
        totalStaff: staffAnalyticsData.totalStaff,
        presentStaff: staffAnalyticsData.presentStaff,
        absentStaff: staffAnalyticsData.absentStaff,
        attendanceRate: staffAnalyticsData.attendanceRate,
        totalHoursWorked: staffAnalyticsData.totalHoursWorked,
        avgEfficiency: staffAnalyticsData.avgEfficiency,
        totalOrdersHandled: staffAnalyticsData.totalOrdersHandled,
      }

      const tabularData = {
        staffPerformance: staffAnalyticsData.staffPerformance.map((staff, index) => ({
          rank: index + 1,
          staffName: staff.name,
          hoursWorked: staff.hours,
          ordersHandled: staff.orders,
          efficiency: staff.efficiency,
        })),
        roleDistribution: Object.entries(staffAnalyticsData.roleDistribution).map(([role, count]) => ({
          role,
          count,
        })),
        attendanceTrend: staffAnalyticsData.attendanceTrend.map((day) => ({
          day: day.day,
          present: day.present,
          absent: day.absent,
          efficiency: day.efficiency,
        })),
      }

      return { summaryMetrics, tabularData }
    } else {
      // Sales report data (existing)
      const summaryMetrics = {
        totalSales: analyticsData.totalSales,
        totalOrders: analyticsData.totalOrders,
        avgOrderValue: analyticsData.avgOrderValue,
        avgPrepTime: analyticsData.avgPrepTime,
        newCustomers: analyticsData.newCustomers,
        returningCustomers: analyticsData.returningCustomers,
        retentionRate: Math.round(
          (analyticsData.returningCustomers / (analyticsData.newCustomers + analyticsData.returningCustomers)) * 100,
        ),
      }

      const tabularData = {
        topSellingItems: analyticsData.topItems.map((item, index) => ({
          rank: index + 1,
          itemName: item.name,
          category: item.category,
          quantitySold: item.quantity,
          revenue: item.revenue,
        })),
        categoryRevenue: Object.entries(analyticsData.categoryRevenue).map(([category, revenue]) => ({
          category,
          revenue,
        })),
        salesTrend: analyticsData.salesTrend.map((day) => ({
          day: day.day,
          sales: day.sales,
          orders: day.orders,
        })),
        peakHours: analyticsData.peakHours.map((hour) => ({
          hour: hour.hour,
          ordersHandled: hour.orders,
        })),
      }

      return { summaryMetrics, tabularData }
    }
  }

  const exportToCSV = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      const { summaryMetrics, tabularData } = parseReportData(reportType)
      const timestamp = new Date().toISOString().split("T")[0]
      const totalSteps = 4
      let currentStep = 0

      const updateProgress = () => {
        currentStep++
        setExportProgress(Math.round((currentStep / totalSteps) * 100))
      }

      // Create separate structured exports
      const exports = []

      if (reportType === "staff") {
        const staffMetrics = summaryMetrics as any
        const metricsCSV = [
          "metric_name,metric_value,metric_unit,metric_type",
          `Total Staff,${staffMetrics.totalStaff},count,integer`,
          `Present Staff,${staffMetrics.presentStaff},count,integer`,
          `Absent Staff,${staffMetrics.absentStaff},count,integer`,
          `Attendance Rate,${staffMetrics.attendanceRate.toFixed(1)},percent,percentage`,
          `Total Hours Worked,${staffMetrics.totalHoursWorked},hours,decimal`,
          `Average Efficiency,${staffMetrics.avgEfficiency.toFixed(1)},percent,percentage`,
          `Total Orders Handled,${staffMetrics.totalOrdersHandled},count,integer`,
        ].join("\n")

        exports.push({
          filename: `${reportType}-summary-metrics-${timestamp}.csv`,
          content: metricsCSV,
        })
        updateProgress()

        // Staff Performance Table
        const staffData = tabularData as any
        if (staffData.staffPerformance.length > 0) {
          const staffCSV = [
            "rank,staff_name,hours_worked,orders_handled,efficiency_percent",
            ...staffData.staffPerformance.map(
              (staff: any) =>
                `${staff.rank},"${staff.staffName}",${staff.hoursWorked},${staff.ordersHandled},${staff.efficiency}`,
            ),
          ].join("\n")

          exports.push({
            filename: `${reportType}-staff-performance-${timestamp}.csv`,
            content: staffCSV,
          })
        }
        updateProgress()

        // Role Distribution
        if (staffData.roleDistribution.length > 0) {
          const roleCSV = [
            "role_name,staff_count,percentage_of_total",
            ...staffData.roleDistribution.map((role: any) => {
              const totalStaff = staffData.roleDistribution.reduce((sum: number, r: any) => sum + r.count, 0)
              const percentage = ((role.count / totalStaff) * 100).toFixed(1)
              return `"${role.role}",${role.count},${percentage}`
            }),
          ].join("\n")

          exports.push({
            filename: `${reportType}-role-distribution-${timestamp}.csv`,
            content: roleCSV,
          })
        }
        updateProgress()

        // Attendance Trend
        if (staffData.attendanceTrend.length > 0) {
          const attendanceCSV = [
            "day_of_week,present_staff,absent_staff,efficiency_percent",
            ...staffData.attendanceTrend.map(
              (day: any) => `"${day.day}",${day.present},${day.absent},${day.efficiency}`,
            ),
          ].join("\n")

          exports.push({
            filename: `${reportType}-attendance-trend-${timestamp}.csv`,
            content: attendanceCSV,
          })
        }
        updateProgress()
      } else {
        // Sales report export logic (existing)
        const salesMetrics = summaryMetrics as any
        const metricsCSV = [
          "metric_name,metric_value,metric_unit,metric_type",
          `Total Sales,${salesMetrics.totalSales},USD,currency`,
          `Total Orders,${salesMetrics.totalOrders},count,integer`,
          `Average Order Value,${salesMetrics.avgOrderValue.toFixed(2)},USD,currency`,
          `Average Prep Time,${salesMetrics.avgPrepTime},minutes,integer`,
          `New Customers,${salesMetrics.newCustomers},count,integer`,
          `Returning Customers,${salesMetrics.returningCustomers},count,integer`,
          `Customer Retention Rate,${salesMetrics.retentionRate},percent,percentage`,
        ].join("\n")

        exports.push({
          filename: `${reportType}-summary-metrics-${timestamp}.csv`,
          content: metricsCSV,
        })
        updateProgress()

        // ... existing sales export logic ...
        const salesData = tabularData as any
        if (salesData.topSellingItems?.length > 0) {
          const topItemsCSV = [
            "rank,item_name,category,quantity_sold,revenue_usd",
            ...salesData.topSellingItems.map(
              (item: any) =>
                `${item.rank},"${item.itemName}","${item.category}",${item.quantitySold},${item.revenue.toFixed(2)}`,
            ),
          ].join("\n")

          exports.push({
            filename: `${reportType}-top-selling-items-${timestamp}.csv`,
            content: topItemsCSV,
          })
        }
        updateProgress()

        if (salesData.categoryRevenue?.length > 0) {
          const categoryCSV = [
            "category_name,revenue_usd,percentage_of_total",
            ...salesData.categoryRevenue.map((cat: any) => {
              const totalRevenue = salesData.categoryRevenue.reduce((sum: number, c: any) => sum + c.revenue, 0)
              const percentage = ((cat.revenue / totalRevenue) * 100).toFixed(1)
              return `"${cat.category}",${cat.revenue.toFixed(2)},${percentage}`
            }),
          ].join("\n")

          exports.push({
            filename: `${reportType}-category-revenue-${timestamp}.csv`,
            content: categoryCSV,
          })
        }
        updateProgress()

        if (salesData.salesTrend?.length > 0) {
          const trendCSV = [
            "day_of_week,sales_usd,order_count,avg_order_value",
            ...salesData.salesTrend.map(
              (day: any) => `"${day.day}",${day.sales.toFixed(2)},${day.orders},${(day.sales / day.orders).toFixed(2)}`,
            ),
          ].join("\n")

          exports.push({
            filename: `${reportType}-sales-trend-${timestamp}.csv`,
            content: trendCSV,
          })
        }
        updateProgress()
      }

      // Download all files
      exports.forEach((exportFile) => {
        const blob = new Blob([exportFile.content], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)

        link.setAttribute("href", url)
        link.setAttribute("download", exportFile.filename)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })

      // Create a summary manifest file
      const manifestContent = [
        "export_summary",
        `export_date,${timestamp}`,
        `report_type,${reportType}`,
        `date_range,${dateRange}`,
        `files_generated,${exports.length}`,
        "",
        "generated_files:",
        ...exports.map((exp) => exp.filename),
      ].join("\n")

      const manifestBlob = new Blob([manifestContent], { type: "text/plain;charset=utf-8;" })
      const manifestLink = document.createElement("a")
      const manifestUrl = URL.createObjectURL(manifestBlob)

      manifestLink.setAttribute("href", manifestUrl)
      manifestLink.setAttribute("download", `${reportType}-export-manifest-${timestamp}.txt`)
      manifestLink.style.visibility = "hidden"
      document.body.appendChild(manifestLink)
      manifestLink.click()
      document.body.removeChild(manifestLink)
      URL.revokeObjectURL(manifestUrl)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
      }, 500)
    }
  }

  const categoryData = Object.entries(analyticsData.categoryRevenue).map(([category, revenue]) => ({
    name: category,
    value: revenue,
  }))

  const roleData = Object.entries(staffAnalyticsData.roleDistribution).map(([role, count]) => ({
    name: role,
    value: count,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-lg border p-1">
            <Button
              variant={reportType === "sales" ? "default" : "outline"}
              onClick={() => setReportType("sales")}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Sales Report
            </Button>
            <Button
              variant={reportType === "staff" ? "default" : "outline"}
              onClick={() => setReportType("staff")}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Staff Report
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isExporting && (
            <div className="flex items-center gap-2 min-w-32">
              <Progress value={exportProgress} className="h-2" />
              <span className="text-sm text-muted-foreground">{exportProgress}%</span>
            </div>
          )}

          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={reportType === "staff" ? exportStaffListToExcel : exportToCSV}
            disabled={isExporting}
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : reportType === "staff" ? "Export Staff List" : "Export Report"}
          </Button>
        </div>
      </div>

      {reportType === "staff" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Total Staff</CardTitle>
                <Users className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">{staffAnalyticsData.totalStaff}</div>
                <div className="flex items-center text-xs text-green-600">
                  <UserCheck className="h-3 w-3 mr-1" />
                  {staffAnalyticsData.presentStaff} present
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Attendance Rate</CardTitle>
                <UserCheck className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">{staffAnalyticsData.attendanceRate.toFixed(1)}%</div>
                <div className="flex items-center text-xs text-red-600">
                  <UserX className="h-3 w-3 mr-1" />
                  {staffAnalyticsData.absentStaff} absent
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Total Hours</CardTitle>
                <Timer className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">{staffAnalyticsData.totalHoursWorked}h</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from yesterday
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Avg Efficiency</CardTitle>
                <Target className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">{staffAnalyticsData.avgEfficiency.toFixed(1)}%</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% from last week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Total Salaries</CardTitle>
                <DollarSign className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">
                  ${centralMockStaff.reduce((sum, staff) => sum + staff.agreedSalary, 0).toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <DollarSign className="h-3 w-3 mr-1" />$
                  {centralMockStaff.reduce((sum, staff) => sum + staff.advancedSalaryTaken, 0).toLocaleString()}{" "}
                  advanced
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keep existing Attendance Trend and Staff Overview charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={staffAnalyticsData.attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="present" stroke="#00AEEF" strokeWidth={2} name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#FF6B35" strokeWidth={2} name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={roleData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="#fff"
                        >
                          {roleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}`, "Staff Count"]}
                          labelStyle={{ color: "#000" }}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{staffAnalyticsData.totalStaff}</div>
                        <div className="text-sm text-gray-500">Total Staff</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {roleData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{entry.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Staff List</CardTitle>
              <p className="text-sm text-muted-foreground">Click on any staff member to view detailed information</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Staff Member</th>
                      <th className="text-left p-2 font-medium">Role</th>
                      <th className="text-left p-2 font-medium">Daily Hours</th>
                      <th className="text-left p-2 font-medium">Entry Time</th>
                      <th className="text-left p-2 font-medium">Exit Time</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {centralMockStaff.map((staff) => (
                      <tr key={staff.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {staff.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{staff.name}</span>
                          </div>
                        </td>
                        <td className="p-2">{staff.role}</td>
                        <td className="p-2">{staff.dailyHours}h</td>
                        <td className="p-2">{staff.entryTime}</td>
                        <td className="p-2">{staff.exitTime}</td>
                        <td className="p-2">
                          <Badge variant={staff.status === "working" ? "default" : "secondary"}>{staff.status}</Badge>
                        </td>
                        <td className="p-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStaffClick(staff)}
                            className="text-xs"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Sales Metrics Cards (existing) */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Total Sales</CardTitle>
                <DollarSign className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">${analyticsData.totalSales.toFixed(2)}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from yesterday
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">{analyticsData.totalOrders}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from yesterday
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Avg Order Value</CardTitle>
                <Target className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">${analyticsData.avgOrderValue.toFixed(2)}</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2% from yesterday
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium">Avg Prep Time</CardTitle>
                <Clock className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-xl font-bold">{analyticsData.avgPrepTime}m</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -3m from last week
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Charts (existing) */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`$${value}`, "Sales"]} />
                    <Line type="monotone" dataKey="sales" stroke="#00AEEF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="#fff"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                          labelStyle={{ color: "#000" }}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          $
                          {Object.values(analyticsData.categoryRevenue)
                            .reduce((sum, value) => sum + value, 0)
                            .toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {categoryData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{entry.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">${Number(entry.value).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Details: make Top Items narrower and Peak Hours wider */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {analyticsData.topItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.revenue.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Heatmap: 7 days x 24 hours, scrollable on small screens */}
                <div className="space-y-4">
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="min-w-8 text-right">Low</span>
                    <div className="relative h-2 flex-1 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-700 dark:from-blue-900 dark:via-blue-600 dark:to-blue-400" />
                      <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
                    </div>
                    <span className="min-w-8">High</span>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-[760px] rounded-lg border border-border bg-card/30 p-2">
                      <div className="grid grid-cols-[auto_repeat(24,minmax(20px,1fr))] gap-1">
                        {(() => {
                          const allValues = analyticsData.peakHoursHeatmap.flatMap((r: any) => r.hours.map((c: any) => c.value))
                          const globalMax = Math.max(1, ...allValues)
                          return (
                            <>
                              {/* Header row with hour labels */}
                              <div className="text-[10px] text-muted-foreground sticky left-0 bg-card z-10"></div>
                              {Array.from({ length: 24 }, (_, h) => (
                                <div key={`h-${h}`} className="text-[10px] text-muted-foreground text-center pb-1">
                                  {h % 3 === 0 ? `${h}:00` : ""}
                                </div>
                              ))}

                              {/* Rows: days */}
                              {analyticsData.peakHoursHeatmap.map((row: any) => {
                                const dayTotal = row.hours.reduce((s: number, c: any) => s + c.value, 0) || 1
                                return (
                                  <div key={row.day} className="contents">
                                    <div className="text-xs text-muted-foreground sticky left-0 bg-card z-10 pr-2 py-1">
                                      {row.day}
                                    </div>
                                    {row.hours.map((cell: any) => {
                                      const intensity = Math.min(1, cell.value / globalMax)
                                      const lightness = 90 - Math.round(intensity * 55) // 90->35
                                      const bg = `hsl(210 100% ${lightness}%)`
                                      const pctOfDay = (cell.value / dayTotal) * 100
                                      const avgValue = analyticsData.avgOrderValue || 0
                                      const cellRevenue = cell.value * avgValue
                                      const dayRevenueTotal = dayTotal * avgValue || 1
                                      const revPctOfDay = (cellRevenue / dayRevenueTotal) * 100
                                      const posClass =
                                        cell.hour <= 2
                                          ? "left-0"
                                          : cell.hour >= 21
                                          ? "right-0"
                                          : "left-1/2 -translate-x-1/2"
                                      return (
                                        <div key={`${row.day}-${cell.hour}`} className="relative group">
                                          <div
                                            className="h-6 rounded-sm transition-transform duration-150 ease-out hover:scale-[1.03] hover:ring-2 hover:ring-primary/60 hover:ring-offset-1 hover:ring-offset-background cursor-pointer"
                                            style={{ backgroundColor: bg }}
                                          />
                                          <div className={`pointer-events-none absolute -top-8 ${posClass} whitespace-nowrap rounded-md border bg-popover px-1.5 py-0.5 text-[10px] text-popover-foreground shadow-md invisible group-hover:visible group-hover:opacity-100 opacity-0 z-50`}>
                                            {`Orders: ${pctOfDay.toFixed(1)}% day | Revenue: ${revPctOfDay.toFixed(1)}% day`}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )
                              })}
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Fallback small bar chart on very small viewports */}
                  <div className="md:hidden">
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={analyticsData.peakHours}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Summary Cards (conditional based on report type) */}
      {reportType === "staff" ? (
        <div className="grid gap-6 md:grid-cols-1">
          {/* Removed Staff Overview card - keeping only the one with pie chart above */}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  New Customers
                </div>
                <div className="text-sm font-medium">
                  {analyticsData.newCustomers}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCheck className="h-3.5 w-3.5" />
                  Returning Customers
                </div>
                <div className="text-sm font-medium">
                  {analyticsData.returningCustomers}
                </div>
              </div>

              {(() => {
                const total = analyticsData.newCustomers + analyticsData.returningCustomers || 1
                const retention = Math.round((analyticsData.returningCustomers / total) * 100)
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-3.5 w-3.5" />
                        Customer Retention
                      </div>
                      <Badge variant="outline">{retention}%</Badge>
                    </div>
                    <Progress value={retention} className="h-2" />
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Loyalty</span>
                      <span>Total {total}</span>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Kitchen Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {(() => {
                const target = 18
                const worst = 25
                const best = 10
                const prep = analyticsData.avgPrepTime
                const progress = Math.max(0, Math.min(100, ((worst - prep) / (worst - best)) * 100))
                const onTime = 94
                return (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          Avg Prep Time
                        </div>
                        <span className="text-sm font-medium">{prep}m</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Faster</span>
                        <span>Target {target}m</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-3.5 w-3.5" />
                          Orders on Time
                        </div>
                        <span className="text-sm font-medium">{onTime}%</span>
                      </div>
                      <Progress value={onTime} className="h-2" />
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Threshold 90%</span>
                        <span>Goal 95%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-3.5 w-3.5" />
                        Kitchen Efficiency
                      </div>
                      <Badge variant={progress > 66 && onTime >= 92 ? "default" : "secondary"}>
                        {progress > 66 && onTime >= 92 ? "Excellent" : progress > 40 ? "Good" : "Average"}
                      </Badge>
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gross Revenue</span>
                <span className="font-medium">${analyticsData.totalSales.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tax (8%)</span>
                <span className="font-medium">${(analyticsData.totalSales * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Service Charge (10%)</span>
                <span className="font-medium">${(analyticsData.totalSales * 0.1).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex items-center justify-between font-medium">
                <span>Net Revenue</span>
                <span>${(analyticsData.totalSales * 1.18).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <StaffDetailsDialog staff={selectedStaff} open={staffDialogOpen} onOpenChange={setStaffDialogOpen} />
    </div>
  )
}

export function AnalyticsDashboard() {
  return <AnalyticsDashboardComponent />
}
