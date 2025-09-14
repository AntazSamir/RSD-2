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
}
