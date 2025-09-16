"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Award,
  Bell,
  Star,
  Users,
  BarChart3,
  Settings,
  LogOut,
  CheckCircle,
  AlertCircle,
  Clock3,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  BookOpen,
  Trophy,
} from "lucide-react"
import {
  mockStaff,
  mockMemberShifts,
  mockMemberPerformance,
  mockMemberNotifications,
  type Staff,
  type MemberShift,
  type MemberPerformance,
  type MemberNotification,
} from "@/lib/mock-data"

interface MemberDashboardProps {
  memberId: string
}

export default function MemberDashboard({ memberId }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  
  const member = mockStaff.find(m => m.id === memberId)
  
  if (!member) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Member Not Found</h3>
          <p className="text-muted-foreground">The requested member could not be found.</p>
        </div>
      </div>
    )
  }

  const memberShifts = mockMemberShifts.filter(s => s.memberId === memberId)
  const memberPerformance = mockMemberPerformance.find(p => p.memberId === memberId)
  const memberNotifications = mockMemberNotifications.filter(n => n.memberId === memberId)
  const unreadNotifications = memberNotifications.filter(n => !n.isRead).length

  const upcomingShifts = memberShifts
    .filter(shift => new Date(shift.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const recentPerformance = memberPerformance || {
    ordersHandled: 0,
    customerSatisfaction: 0,
    efficiency: 0,
    attendance: 0,
    punctuality: 0,
    teamwork: 0,
    communication: 0,
    overallScore: 0,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-green-100 text-green-800 border-green-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "break":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Bell className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.profileImage} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {member.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <p className="text-muted-foreground">{member.position} • {member.department}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(member.status)} variant="outline">
                {member.status}
              </Badge>
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <Bell className="h-3 w-3" />
                  {unreadNotifications} notifications
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.performanceScore}/5</div>
            <div className="w-full mt-2">
              <Progress value={member.performanceScore * 20} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.attendanceRate}%</div>
            <div className="w-full mt-2">
              <Progress value={member.attendanceRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Handled</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.totalOrdersHandled}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.customerRating}/5</div>
            <p className="text-xs text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.contactNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{member.role}</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline">{cert}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Training Completed</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.trainingCompleted.map((training, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        <BookOpen className="h-3 w-3" />
                        {training}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Shifts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Shifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingShifts.length > 0 ? (
                  upcomingShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {format(shift.date, "EEEE, MMM d, yyyy")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                      <Badge variant="outline">{shift.status}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2" />
                    <p>No upcoming shifts scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Shift History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {format(shift.date, "MMM d, yyyy")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                      {shift.actualStartTime && (
                        <div className="text-sm text-muted-foreground">
                          Actual: {shift.actualStartTime} - {shift.actualEndTime}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{shift.status}</Badge>
                      {shift.overtime && shift.overtime > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <Clock3 className="h-3 w-3" />
                          +{shift.overtime}h OT
                        </Badge>
                      )}
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
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Overall Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{recentPerformance.overallScore}/5</span>
                      <Progress value={recentPerformance.overallScore * 20} className="w-16 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{recentPerformance.customerSatisfaction}/5</span>
                      <Progress value={recentPerformance.customerSatisfaction * 20} className="w-16 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Efficiency</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{recentPerformance.efficiency}%</span>
                      <Progress value={recentPerformance.efficiency} className="w-16 h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Teamwork</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{recentPerformance.teamwork}/5</span>
                      <Progress value={recentPerformance.teamwork * 20} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Perfect Attendance</div>
                      <div className="text-sm text-muted-foreground">3 months in a row</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Top Performer</div>
                      <div className="text-sm text-muted-foreground">This month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Customer Service Excellence</div>
                      <div className="text-sm text-muted-foreground">Q3 2024</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {memberNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {format(notification.createdAt, "MMM d, yyyy 'at' HH:mm")}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
