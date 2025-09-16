// Restaurant Order Management System Types

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "waiter" | "kitchen" | "manager"
  avatar?: string
  createdAt: Date
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: "appetizer" | "main" | "dessert" | "beverage"
  image?: string
  available: boolean
  preparationTime: number // in minutes
}

export interface OrderItem {
  id: string
  menuItemId: string
  quantity: number
  specialInstructions?: string
  price: number
}

export interface Order {
  id: string
  tableNumber: number
  waiterId: string
  items: OrderItem[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "served" | "cancelled"
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  estimatedReadyTime?: Date
  notes?: string
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning"
  currentOrderId?: string
}

export interface KitchenOrder {
  orderId: string
  tableNumber: number
  items: (OrderItem & { menuItem: MenuItem })[]
  status: Order["status"]
  priority: "low" | "medium" | "high"
  estimatedReadyTime: Date
  createdAt: Date
}

export interface Staff {
  id: string
  name: string
  role: string
  status: "working" | "absent" | "break"
  shiftStart: string
  shiftEnd: string
  avatar: string
  // Detailed information for staff reports
  fullName: string
  nationalId: string
  address: string
  contactNumber: string
  agreedSalary: number
  advancedSalaryTaken: number
  dateOfJoining: Date
  dailyHours: number
  entryTime: string
  exitTime: string
  efficiency: number
  hoursWorked: number
  // Enhanced member features
  email: string
  emergencyContact: string
  emergencyPhone: string
  department: "front-of-house" | "kitchen" | "management" | "cleaning" | "security"
  position: string
  managerId?: string
  permissions: string[]
  lastLogin?: Date
  isActive: boolean
  profileImage?: string
  bio?: string
  skills: string[]
  certifications: string[]
  performanceScore: number
  attendanceRate: number
  totalOrdersHandled: number
  customerRating: number
  trainingCompleted: string[]
  nextReviewDate: Date
  notes: string
}

export interface MemberRole {
  id: string
  name: string
  description: string
  permissions: string[]
  level: number
  color: string
  isActive: boolean
}

export interface MemberShift {
  id: string
  memberId: string
  date: Date
  startTime: string
  endTime: string
  breakDuration: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  notes?: string
  actualStartTime?: string
  actualEndTime?: string
  overtime?: number
}

export interface MemberPerformance {
  id: string
  memberId: string
  period: "daily" | "weekly" | "monthly"
  date: Date
  ordersHandled: number
  customerSatisfaction: number
  efficiency: number
  attendance: number
  punctuality: number
  teamwork: number
  communication: number
  overallScore: number
  notes?: string
}

export interface MemberNotification {
  id: string
  memberId: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  isRead: boolean
  createdAt: Date
  expiresAt?: Date
  actionUrl?: string
}

export interface InventoryItem {
  id: string
  name: string
  category: "protein" | "vegetables" | "dairy" | "grains" | "beverages" | "condiments"
  currentStock: number
  maxStock: number
  unit: string
  costPerUnit: number
  totalValue: number
  supplier: string
  lastRestocked: Date
  expiresAt: Date
  lowStockThreshold: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalVisits: number
  totalSpent: number
  lastVisit: Date
  loyaltyPoints: number
  preferences?: string[]
  allergies?: string[]
  notes?: string
  createdAt: Date
}