"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, DollarSign, Users, TrendingUp, Star, UserCheck, ShoppingCart } from "lucide-react"
import { mockBranches, mockBranchStaff } from "@/lib/mock-data"

export function BranchReports() {
  const totalRevenue = mockBranches.reduce((sum, branch) => sum + branch.totalRevenue, 0)
  const totalStaff = mockBranches.reduce((sum, branch) => sum + branch.staffCount, 0)
  const totalActiveStaff = mockBranches.reduce((sum, branch) => sum + branch.activeStaff, 0)
  const avgSatisfaction =
    mockBranches.reduce((sum, branch) => sum + branch.customerSatisfaction, 0) / mockBranches.length

  return (
    <div className="space-y-6">
      {/* Overall Business Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all branches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalActiveStaff}/{totalStaff}
            </div>
            <p className="text-xs text-muted-foreground">Active staff today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Customer rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBranches.length}</div>
            <p className="text-xs text-muted-foreground">Locations operating</p>
          </CardContent>
        </Card>
      </div>

      {/* Branch Details */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {mockBranches.map((branch) => {
          const branchStaff = mockBranchStaff.filter((staff) => staff.branchId === branch.id)
          const workingStaff = branchStaff.filter((staff) => staff.status === "working")

          return (
            <Card key={branch.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    {branch.customerSatisfaction}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{branch.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{branch.openingHours}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Sales Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Monthly Revenue</span>
                    </div>
                    <p className="text-lg font-semibold">${branch.monthlyRevenue.toLocaleString()}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Avg Order Value</span>
                    </div>
                    <p className="text-lg font-semibold">${branch.avgOrderValue}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Orders Today</span>
                    </div>
                    <p className="text-lg font-semibold">{branch.ordersToday}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Staff Active</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {branch.activeStaff}/{branch.staffCount}
                    </p>
                  </div>
                </div>

                {/* Staff Summary */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">Staff Overview</h4>
                    <Badge variant="secondary" className="text-xs">
                      Manager: {branch.manager}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Working Today:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {workingStaff.length} staff
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Efficiency:</span>
                      <span className="font-medium">
                        {branchStaff.length > 0
                          ? Math.round(
                              branchStaff.reduce((sum, staff) => sum + staff.efficiency, 0) / branchStaff.length,
                            )
                          : 0}
                        %
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Hours Today:</span>
                      <span className="font-medium">
                        {branchStaff.reduce((sum, staff) => sum + staff.hoursWorked, 0)}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Staff List */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-3">Staff Details</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {branchStaff.map((staff) => (
                      <div key={staff.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                              staff.status === "working"
                                ? "bg-green-600 dark:bg-green-700"
                                : "bg-yellow-600 dark:bg-yellow-700"
                            }`}
                          >
                            {staff.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{staff.name}</p>
                            <p className="text-xs text-muted-foreground">{staff.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={staff.status === "working" ? "default" : "secondary"} className="text-xs">
                            {staff.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{staff.efficiency}% efficiency</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
