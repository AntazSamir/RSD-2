"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Clock,
  Target,
  Award,
  BarChart3,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react"
import {
  mockStaff,
  mockMemberPerformance,
  mockMemberShifts,
  type Staff,
  type MemberPerformance,
  type MemberShift,
} from "@/lib/mock-data"

const COLORS = ["#00AEEF", "#FF6B35", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#FF9F43", "#6C5CE7"]

export default function MemberAnalytics() {
  const [dateRange, setDateRange] = useState("30d")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  const filteredMembers = useMemo(() => {
    return mockStaff.filter(member => 
      departmentFilter === "all" || member.department === departmentFilter
    )
  }, [departmentFilter])

  const performanceData = useMemo(() => {
    return filteredMembers.map(member => {
      const performance = mockMemberPerformance.find(p => p.memberId === member.id)
      return {
        name: member.name,
        performance: member.performanceScore,
        attendance: member.attendanceRate,
        ordersHandled: member.totalOrdersHandled,
        customerRating: member.customerRating,
        department: member.department,
        role: member.role,
      }
    })
  }, [filteredMembers])

  const departmentStats = useMemo(() => {
    const departments = filteredMembers.reduce((acc, member) => {
      if (!acc[member.department]) {
        acc[member.department] = {
          count: 0,
          totalPerformance: 0,
          totalAttendance: 0,
          totalOrders: 0,
          totalRating: 0,
        }
      }
      acc[member.department].count++
      acc[member.department].totalPerformance += member.performanceScore
      acc[member.department].totalAttendance += member.attendanceRate
      acc[member.department].totalOrders += member.totalOrdersHandled
      acc[member.department].totalRating += member.customerRating
      return acc
    }, {} as Record<string, any>)

    return Object.entries(departments).map(([dept, stats]) => ({
      department: dept,
      count: stats.count,
      avgPerformance: stats.totalPerformance / stats.count,
      avgAttendance: stats.totalAttendance / stats.count,
      avgOrders: stats.totalOrders / stats.count,
      avgRating: stats.totalRating / stats.count,
    }))
  }, [filteredMembers])

  const roleDistribution = useMemo(() => {
    const roles = filteredMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(roles).map(([role, count]) => ({
      name: role,
      value: count,
    }))
  }, [filteredMembers])

  const attendanceTrend = useMemo(() => {
    // Generate mock attendance trend data
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
    return Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      return {
        date: date.toISOString().split('T')[0],
        attendance: Math.round(85 + Math.random() * 15),
        performance: Math.round(3.5 + Math.random() * 1.5),
        orders: Math.round(20 + Math.random() * 30),
      }
    })
  }, [dateRange])

  const topPerformers = useMemo(() => {
    return performanceData
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5)
  }, [performanceData])

  const needsImprovement = useMemo(() => {
    return performanceData
      .filter(member => member.performance < 4.0 || member.attendance < 90)
      .sort((a, b) => a.performance - b.performance)
      .slice(0, 5)
  }, [performanceData])

  const overallStats = useMemo(() => {
    const totalMembers = filteredMembers.length
    const avgPerformance = performanceData.reduce((sum, m) => sum + m.performance, 0) / totalMembers
    const avgAttendance = performanceData.reduce((sum, m) => sum + m.attendance, 0) / totalMembers
    const totalOrders = performanceData.reduce((sum, m) => sum + m.ordersHandled, 0)
    const avgRating = performanceData.reduce((sum, m) => sum + m.customerRating, 0) / totalMembers

    return {
      totalMembers,
      avgPerformance: Math.round(avgPerformance * 10) / 10,
      avgAttendance: Math.round(avgAttendance),
      totalOrders,
      avgRating: Math.round(avgRating * 10) / 10,
    }
  }, [filteredMembers, performanceData])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stuff Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into team performance and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="front-of-house">Front of House</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="management">Management</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {filteredMembers.filter(m => m.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgPerformance}/5</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgAttendance}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.avgRating}/5</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.1 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#00AEEF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={roleDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {roleDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {roleDistribution.map((entry, index) => (
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

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((member, index) => (
                  <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{member.performance}/5</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{member.attendance}%</div>
                        <div className="text-xs text-muted-foreground">Attendance</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{member.ordersHandled}</div>
                        <div className="text-xs text-muted-foreground">Orders</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance vs Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#00AEEF" name="Performance" />
                    <Bar dataKey="attendance" fill="#4ECDC4" name="Attendance" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Rating vs Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="customerRating" fill="#FF6B35" name="Rating" />
                    <Bar dataKey="ordersHandled" fill="#96CEB4" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Needs Improvement */}
          <Card>
            <CardHeader>
              <CardTitle>Members Needing Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {needsImprovement.map((member, index) => (
                  <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-medium">
                        !
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">{member.performance}/5</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">{member.attendance}%</div>
                        <div className="text-xs text-muted-foreground">Attendance</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgPerformance" fill="#00AEEF" name="Avg Performance" />
                    <Bar dataKey="avgAttendance" fill="#4ECDC4" name="Avg Attendance" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.department} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">{dept.department.replace("-", " ")}</h3>
                        <Badge variant="outline">{dept.count} members</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Avg Performance</div>
                          <div className="font-medium">{dept.avgPerformance.toFixed(1)}/5</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Attendance</div>
                          <div className="font-medium">{dept.avgAttendance.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total Orders</div>
                          <div className="font-medium">{dept.avgOrders.toFixed(0)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Rating</div>
                          <div className="font-medium">{dept.avgRating.toFixed(1)}/5</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance & Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="attendance" stackId="1" stroke="#00AEEF" fill="#00AEEF" />
                  <Area type="monotone" dataKey="performance" stackId="2" stroke="#4ECDC4" fill="#4ECDC4" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#FF6B35" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Positive Trend</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Overall performance has improved by 12% compared to last month.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Team Strength</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {overallStats.totalMembers} active members with {overallStats.avgAttendance}% average attendance.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Focus Areas</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      {needsImprovement.length} members need performance improvement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
