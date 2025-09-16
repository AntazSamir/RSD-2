"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Bell,
  Calendar,
  TrendingUp,
  Users,
  Award,
  Clock,
  Star,
  Mail,
  Phone,
  MapPin,
  Shield,
  Target,
  BarChart3,
  UserCheck,
  UserX,
  AlertCircle,
  Trash2,
} from "lucide-react"
import {
  mockStaff,
  mockMemberRoles,
  mockMemberShifts,
  mockMemberPerformance,
  mockMemberNotifications,
  type Staff,
  type MemberRole,
  type MemberShift,
  type MemberPerformance,
  type MemberNotification,
} from "@/lib/mock-data"

export default function MemberManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  // Department removed from UI; keep placeholder state if needed in future
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState<Staff | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [members, setMembers] = useState<Staff[]>(() => [...mockStaff])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDepartment = true
      const matchesStatus = statusFilter === "all" || member.status === statusFilter
      
      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [members, searchTerm, statusFilter])

  const getMemberRole = (memberId: string): MemberRole | undefined => {
    const member = mockStaff.find(m => m.id === memberId)
    if (!member) return undefined
    
    // Map member roles to role definitions
    const roleMap: Record<string, string> = {
      "Manager": "1",
      "Shift Supervisor": "2", 
      "Senior Server": "3",
      "Waiter": "4",
      "Bartender": "4",
      "Host": "5",
      "Hostess": "5"
    }
    
    const roleId = roleMap[member.role] || "4"
    return mockMemberRoles.find(r => r.id === roleId)
  }

  const getMemberShifts = (memberId: string): MemberShift[] => {
    return mockMemberShifts.filter(shift => shift.memberId === memberId)
  }

  const getMemberPerformance = (memberId: string): MemberPerformance | undefined => {
    return mockMemberPerformance.find(perf => perf.memberId === memberId)
  }

  const getMemberNotifications = (memberId: string): MemberNotification[] => {
    return mockMemberNotifications.filter(notif => notif.memberId === memberId)
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

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "front-of-house":
        return "bg-blue-100 text-blue-800"
      case "kitchen":
        return "bg-orange-100 text-orange-800"
      case "management":
        return "bg-purple-100 text-purple-800"
      case "cleaning":
        return "bg-gray-100 text-gray-800"
      case "security":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = useMemo(() => {
    const totalMembers = members.length
    const activeMembers = members.filter(m => m.isActive).length
    const workingMembers = members.filter(m => m.status === "working").length
    const avgPerformance = members.reduce((sum, m) => sum + m.performanceScore, 0) / (totalMembers || 1)
    const avgAttendance = members.reduce((sum, m) => sum + m.attendanceRate, 0) / (totalMembers || 1)

    return {
      totalMembers,
      activeMembers,
      workingMembers,
      avgPerformance: Math.round(avgPerformance * 10) / 10,
      avgAttendance: Math.round(avgAttendance),
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stuff Management</h1>
          <p className="text-muted-foreground">Manage your restaurant team members, roles, and performance</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Working</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workingMembers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.workingMembers / stats.totalMembers) * 100)}% of team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPerformance}/5</div>
            <p className="text-xs text-muted-foreground">
              Team average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        {/* Department card removed */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Department filter removed */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="break">On Break</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Member Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => {
                const role = getMemberRole(member.id)
                const performance = getMemberPerformance(member.id)
                const notifications = getMemberNotifications(member.id)
                const unreadNotifications = notifications.filter(n => !n.isRead).length

                return (
                  <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.profileImage} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {unreadNotifications > 0 && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {unreadNotifications}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.position}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)} variant="outline">
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">{member.performanceScore}</span>
                        </div>
                        <div className="w-16">
                          <Progress value={member.performanceScore * 20} className="h-2" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{member.attendanceRate}%</span>
                        <div className="w-16">
                          <Progress value={member.attendanceRate} className="h-2" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {member.lastLogin ? format(member.lastLogin, "MMM d, HH:mm") : "Never"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMember(member)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: m.status === 'working' ? 'break' : 'working' } : m))}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMembers(prev => prev.map(m => m.id === member.id ? { ...m, isActive: !m.isActive } : m))}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Remove ${member.fullName}?`)) {
                              setMembers(prev => prev.filter(m => m.id !== member.id))
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Details Modal would go here */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Add Member Dialog */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={() => setIsAddOpen(false)}>
          <div className="w-full max-w-xl rounded-lg bg-background p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <AddMemberForm
              onCancel={() => setIsAddOpen(false)}
              onSave={(m) => {
                setMembers(prev => [m, ...prev])
                setIsAddOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Member Details Modal Component
function MemberDetailsModal({ member, onClose }: { member: Staff; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")
  
  const role = mockMemberRoles.find(r => r.name === member.role)
  const shifts = mockMemberShifts.filter(s => s.memberId === member.id)
  const performance = mockMemberPerformance.find(p => p.memberId === member.id)
  const notifications = mockMemberNotifications.filter(n => n.memberId === member.id)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.profileImage} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{member.name}</CardTitle>
              <p className="text-muted-foreground">{member.position} • {member.department}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{member.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.address}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Role & Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>{member.role}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Permissions: {member.permissions.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills & Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              {performance && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Overall Score</span>
                        <span className="font-bold">{performance.overallScore}/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Customer Satisfaction</span>
                        <span className="font-bold">{performance.customerSatisfaction}/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Efficiency</span>
                        <span className="font-bold">{performance.efficiency}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Teamwork</span>
                        <span className="font-bold">{performance.teamwork}/5</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Orders Handled</span>
                          <span className="font-bold">{performance.ordersHandled}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Attendance Rate</span>
                          <span className="font-bold">{performance.attendance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Punctuality</span>
                          <span className="font-bold">{performance.punctuality}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="shifts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Shifts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {shifts.map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {format(shift.date, "MMM d, yyyy")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {shift.startTime} - {shift.endTime}
                          </div>
                        </div>
                        <Badge variant="outline">{shift.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-3 border rounded-lg ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground">{notification.message}</div>
                          </div>
                          <Badge variant={notification.type === 'warning' ? 'destructive' : 'secondary'}>
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function AddMemberForm({ onCancel, onSave }: { onCancel: () => void; onSave: (m: Staff) => void }) {
  const [name, setName] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("Waiter")
  const [nationalId, setNationalId] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [monthlySalary, setMonthlySalary] = useState<number | "">("")
  const [shiftStart, setShiftStart] = useState("")
  const [shiftEnd, setShiftEnd] = useState("")
  const [dateOfJoining, setDateOfJoining] = useState("")
  const [avatarInitial, setAvatarInitial] = useState("")
  const [address, setAddress] = useState("")

  const isValid = () => {
    return (
      name.trim() &&
      fullName.trim() &&
      role.trim() &&
      nationalId.trim() &&
      contactNumber.trim() &&
      monthlySalary !== "" &&
      dateOfJoining.trim()
    )
  }

  const handleSave = () => {
    if (!isValid()) return
    const base = mockStaff[0]
    const newMember: Staff = {
      ...base,
      id: String(Date.now()),
      name: name,
      fullName: fullName,
      role,
      status: "working",
      shiftStart: shiftStart || base.shiftStart,
      shiftEnd: shiftEnd || base.shiftEnd,
      avatar: (avatarInitial || name[0] || "N").toUpperCase().slice(0, 2),
      nationalId,
      address: address || base.address,
      contactNumber,
      agreedSalary: typeof monthlySalary === "number" ? monthlySalary : Number.parseFloat(String(monthlySalary)) || 0,
      advancedSalaryTaken: 0,
      dateOfJoining: new Date(dateOfJoining),
      dailyHours: base.dailyHours,
      entryTime: base.entryTime,
      exitTime: base.exitTime,
      efficiency: base.efficiency,
      hoursWorked: base.hoursWorked,
      // Enhanced fields retained from base, but department removed from UI
      email: `${name.toLowerCase().replace(/\s+/g, '.') || 'new' }@restaurant.com`,
      emergencyContact: base.emergencyContact,
      emergencyPhone: base.emergencyPhone,
      department: base.department,
      position: role,
      managerId: base.managerId,
      permissions: base.permissions,
      lastLogin: new Date(),
      isActive: true,
      profileImage: undefined,
      bio: base.bio,
      skills: base.skills,
      certifications: base.certifications,
      performanceScore: base.performanceScore,
      attendanceRate: base.attendanceRate,
      totalOrdersHandled: base.totalOrdersHandled,
      customerRating: base.customerRating,
      trainingCompleted: base.trainingCompleted,
      nextReviewDate: base.nextReviewDate,
      notes: base.notes,
    }
    onSave(newMember)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Staff Member</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm">Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter staff name" />
            </div>
            <div>
              <label className="text-sm">Full Name</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" />
            </div>
            <div>
              <label className="text-sm">Role *</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Shift Supervisor">Shift Supervisor</SelectItem>
                  <SelectItem value="Senior Server">Senior Server</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                  <SelectItem value="Bartender">Bartender</SelectItem>
                  <SelectItem value="Host">Host</SelectItem>
                  <SelectItem value="Hostess">Hostess</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">National ID *</label>
              <Input value={nationalId} onChange={(e) => setNationalId(e.target.value)} placeholder="Enter national ID" />
            </div>
            <div>
              <label className="text-sm">Contact Number *</label>
              <Input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Enter contact number" />
            </div>
            <div>
              <label className="text-sm">Monthly Salary *</label>
              <Input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Enter monthly salary" />
            </div>
            <div>
              <label className="text-sm">Shift Start Time</label>
              <Input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Shift End Time</label>
              <Input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Date of Joining *</label>
              <Input type="date" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Avatar (Initial)</label>
              <Input maxLength={2} value={avatarInitial} onChange={(e) => setAvatarInitial(e.target.value)} placeholder="Enter single character" />
            </div>
          </div>
          <div>
            <label className="text-sm">Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter full address" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid()}>Add Staff Member</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
