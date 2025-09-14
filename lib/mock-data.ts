import type { User, MenuItem, Order, Table, OrderItem, Staff } from "./types"

export interface Branch {
  id: string
  name: string
  location: string
  manager: string
  phone: string
  openingHours: string
  totalRevenue: number
  monthlyRevenue: number
  staffCount: number
  activeStaff: number
  avgOrderValue: number
  ordersToday: number
  customerSatisfaction: number
}

export const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Downtown Branch",
    location: "123 Main Street, Downtown",
    manager: "John Michael",
    phone: "+1-555-0101",
    openingHours: "8:00 AM - 11:00 PM",
    totalRevenue: 125000,
    monthlyRevenue: 45000,
    staffCount: 12,
    activeStaff: 8,
    avgOrderValue: 28.5,
    ordersToday: 156,
    customerSatisfaction: 4.8,
  },
  {
    id: "2",
    name: "Riverside Branch",
    location: "456 Oak Avenue, Riverside",
    manager: "Sarah Elizabeth",
    phone: "+1-555-0102",
    openingHours: "9:00 AM - 10:00 PM",
    totalRevenue: 98000,
    monthlyRevenue: 38000,
    staffCount: 10,
    activeStaff: 7,
    avgOrderValue: 24.75,
    ordersToday: 134,
    customerSatisfaction: 4.6,
  },
  {
    id: "3",
    name: "Hillside Branch",
    location: "789 Pine Road, Hillside",
    manager: "Michael Robert",
    phone: "+1-555-0103",
    openingHours: "10:00 AM - 12:00 AM",
    totalRevenue: 87500,
    monthlyRevenue: 32000,
    staffCount: 8,
    activeStaff: 6,
    avgOrderValue: 22.3,
    ordersToday: 98,
    customerSatisfaction: 4.4,
  },
  {
    id: "4",
    name: "Westside Branch",
    location: "321 Elm Street, Westside",
    manager: "Lisa Marie",
    phone: "+1-555-0104",
    openingHours: "11:00 AM - 11:00 PM",
    totalRevenue: 76000,
    monthlyRevenue: 28000,
    staffCount: 9,
    activeStaff: 5,
    avgOrderValue: 26.8,
    ordersToday: 87,
    customerSatisfaction: 4.5,
  },
]

export interface BranchStaff extends Staff {
  branchId: string
  branchName: string
}

export const mockBranchStaff: BranchStaff[] = [
  // Downtown Branch Staff
  {
    id: "1",
    name: "John Michael",
    fullName: "John Michael Manager",
    role: "Manager",
    status: "working",
    shiftStart: "08:00",
    shiftEnd: "18:00",
    avatar: "JM",
    nationalId: "NID-001-2024",
    address: "123 Main Street, Downtown, City 12345",
    contactNumber: "+1-555-0101",
    agreedSalary: 5000,
    advancedSalaryTaken: 1200,
    dateOfJoining: new Date("2023-01-15"),
    dailyHours: 10,
    entryTime: "08:00",
    exitTime: "18:00",
    efficiency: 95,
    hoursWorked: 10,
    branchId: "1",
    branchName: "Downtown Branch",
  },
  {
    id: "2",
    name: "Sarah Elizabeth",
    fullName: "Sarah Elizabeth Waiter",
    role: "Waiter",
    status: "working",
    shiftStart: "10:00",
    shiftEnd: "20:00",
    avatar: "SW",
    nationalId: "NID-002-2024",
    address: "456 Oak Avenue, Riverside, City 12346",
    contactNumber: "+1-555-0102",
    agreedSalary: 2800,
    advancedSalaryTaken: 500,
    dateOfJoining: new Date("2023-03-20"),
    dailyHours: 10,
    entryTime: "10:00",
    exitTime: "20:00",
    efficiency: 88,
    hoursWorked: 10,
    branchId: "1",
    branchName: "Downtown Branch",
  },
  {
    id: "3",
    name: "Michael Robert",
    fullName: "Michael Robert Chef",
    role: "Chef",
    status: "working",
    shiftStart: "09:00",
    shiftEnd: "21:00",
    avatar: "MC",
    nationalId: "NID-003-2024",
    address: "789 Pine Road, Hillside, City 12347",
    contactNumber: "+1-555-0103",
    agreedSalary: 4200,
    advancedSalaryTaken: 800,
    dateOfJoining: new Date("2022-11-10"),
    dailyHours: 12,
    entryTime: "09:00",
    exitTime: "21:00",
    efficiency: 92,
    hoursWorked: 12,
    branchId: "1",
    branchName: "Downtown Branch",
  },
  // Riverside Branch Staff
  {
    id: "7",
    name: "David Wilson",
    fullName: "David Wilson Manager",
    role: "Manager",
    status: "working",
    shiftStart: "09:00",
    shiftEnd: "19:00",
    avatar: "DW",
    nationalId: "NID-007-2024",
    address: "111 River Road, Riverside, City 12351",
    contactNumber: "+1-555-0107",
    agreedSalary: 4800,
    advancedSalaryTaken: 1000,
    dateOfJoining: new Date("2023-02-01"),
    dailyHours: 10,
    entryTime: "09:00",
    exitTime: "19:00",
    efficiency: 93,
    hoursWorked: 10,
    branchId: "2",
    branchName: "Riverside Branch",
  },
  {
    id: "8",
    name: "Anna Taylor",
    fullName: "Anna Taylor Chef",
    role: "Chef",
    status: "working",
    shiftStart: "10:00",
    shiftEnd: "22:00",
    avatar: "AT",
    nationalId: "NID-008-2024",
    address: "222 Stream Lane, Riverside, City 12352",
    contactNumber: "+1-555-0108",
    agreedSalary: 4000,
    advancedSalaryTaken: 700,
    dateOfJoining: new Date("2023-04-15"),
    dailyHours: 12,
    entryTime: "10:00",
    exitTime: "22:00",
    efficiency: 89,
    hoursWorked: 12,
    branchId: "2",
    branchName: "Riverside Branch",
  },
  // Hillside Branch Staff
  {
    id: "9",
    name: "Robert Brown",
    fullName: "Robert Brown Manager",
    role: "Manager",
    status: "absent",
    shiftStart: "10:00",
    shiftEnd: "20:00",
    avatar: "RB",
    nationalId: "NID-009-2024",
    address: "333 Hill Avenue, Hillside, City 12353",
    contactNumber: "+1-555-0109",
    agreedSalary: 4600,
    advancedSalaryTaken: 900,
    dateOfJoining: new Date("2023-01-20"),
    dailyHours: 0,
    entryTime: "N/A",
    exitTime: "N/A",
    efficiency: 0,
    hoursWorked: 0,
    branchId: "3",
    branchName: "Hillside Branch",
  },
  // Westside Branch Staff
  {
    id: "10",
    name: "Jennifer Davis",
    fullName: "Jennifer Davis Manager",
    role: "Manager",
    status: "working",
    shiftStart: "11:00",
    shiftEnd: "21:00",
    avatar: "JD",
    nationalId: "NID-010-2024",
    address: "444 West Street, Westside, City 12354",
    contactNumber: "+1-555-0110",
    agreedSalary: 4400,
    advancedSalaryTaken: 800,
    dateOfJoining: new Date("2023-03-10"),
    dailyHours: 10,
    entryTime: "11:00",
    exitTime: "21:00",
    efficiency: 91,
    hoursWorked: 10,
    branchId: "4",
    branchName: "Westside Branch",
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Michael",
    email: "john@restaurant.com",
    role: "manager",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Sarah Elizabeth",
    email: "sarah@restaurant.com",
    role: "waiter",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Michael Robert",
    email: "mike@restaurant.com",
    role: "kitchen",
    createdAt: new Date("2024-01-01"),
  },
]

export const mockStaff: Staff[] = [
  {
    id: "4",
    name: "Lisa Marie",
    fullName: "Lisa Marie Server",
    role: "Waiter",
    status: "absent",
    shiftStart: "11:00",
    shiftEnd: "19:00",
    avatar: "LS",
    nationalId: "NID-004-2024",
    address: "321 Elm Street, Westside, City 12348",
    contactNumber: "+1-555-0104",
    agreedSalary: 2600,
    advancedSalaryTaken: 300,
    dateOfJoining: new Date("2023-06-05"),
    dailyHours: 0,
    entryTime: "N/A",
    exitTime: "N/A",
    efficiency: 0,
    hoursWorked: 0,
  },
  {
    id: "5",
    name: "Thomas James",
    fullName: "Thomas James Bartender",
    role: "Bartender",
    status: "working",
    shiftStart: "16:00",
    shiftEnd: "24:00",
    avatar: "TB",
    nationalId: "NID-005-2024",
    address: "654 Maple Drive, Eastside, City 12349",
    contactNumber: "+1-555-0105",
    agreedSalary: 3200,
    advancedSalaryTaken: 600,
    dateOfJoining: new Date("2023-02-14"),
    dailyHours: 8,
    entryTime: "16:00",
    exitTime: "24:00",
    efficiency: 90,
    hoursWorked: 8,
  },
  {
    id: "6",
    name: "Emma Grace",
    fullName: "Emma Grace Host",
    role: "Host",
    status: "absent",
    shiftStart: "17:00",
    shiftEnd: "23:00",
    avatar: "EH",
    nationalId: "NID-006-2024",
    address: "987 Cedar Lane, Northside, City 12350",
    contactNumber: "+1-555-0106",
    agreedSalary: 2400,
    advancedSalaryTaken: 200,
    dateOfJoining: new Date("2023-08-12"),
    dailyHours: 0,
    entryTime: "N/A",
    exitTime: "N/A",
    efficiency: 0,
    hoursWorked: 0,
  },
]

export const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan cheese and croutons",
    price: 12.99,
    category: "appetizer",
    available: true,
    preparationTime: 10,
  },
  {
    id: "2",
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon herb butter and seasonal vegetables",
    price: 24.99,
    category: "main",
    available: true,
    preparationTime: 20,
  },
  {
    id: "3",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with vanilla ice cream",
    price: 8.99,
    category: "dessert",
    available: true,
    preparationTime: 5,
  },
  {
    id: "4",
    name: "House Wine",
    description: "Red or white wine selection",
    price: 7.99,
    category: "beverage",
    available: true,
    preparationTime: 2,
  },
  {
    id: "5",
    name: "Buffalo Wings",
    description: "Crispy chicken wings with spicy buffalo sauce and blue cheese dip",
    price: 14.99,
    category: "appetizer",
    available: true,
    preparationTime: 15,
  },
  {
    id: "6",
    name: "Bruschetta",
    description: "Toasted bread with fresh tomatoes, basil, and mozzarella",
    price: 9.99,
    category: "appetizer",
    available: true,
    preparationTime: 8,
  },
  {
    id: "7",
    name: "Calamari Rings",
    description: "Golden fried squid rings with marinara sauce",
    price: 13.99,
    category: "appetizer",
    available: true,
    preparationTime: 12,
  },
  {
    id: "8",
    name: "Ribeye Steak",
    description: "12oz prime ribeye with garlic mashed potatoes and asparagus",
    price: 32.99,
    category: "main",
    available: true,
    preparationTime: 25,
  },
  {
    id: "9",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast with marinara sauce and melted mozzarella",
    price: 19.99,
    category: "main",
    available: true,
    preparationTime: 18,
  },
  {
    id: "10",
    name: "Vegetarian Pasta",
    description: "Penne pasta with roasted vegetables in olive oil and herbs",
    price: 16.99,
    category: "main",
    available: true,
    preparationTime: 15,
  },
  {
    id: "11",
    name: "Fish Tacos",
    description: "Three soft tacos with grilled fish, cabbage slaw, and lime crema",
    price: 17.99,
    category: "main",
    available: true,
    preparationTime: 16,
  },
  {
    id: "12",
    name: "BBQ Ribs",
    description: "Half rack of baby back ribs with coleslaw and fries",
    price: 26.99,
    category: "main",
    available: true,
    preparationTime: 30,
  },
  {
    id: "13",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    price: 9.99,
    category: "dessert",
    available: true,
    preparationTime: 3,
  },
  {
    id: "14",
    name: "Crème Brûlée",
    description: "Vanilla custard with caramelized sugar crust",
    price: 8.99,
    category: "dessert",
    available: true,
    preparationTime: 5,
  },
  {
    id: "15",
    name: "Apple Pie",
    description: "Homemade apple pie with cinnamon and vanilla ice cream",
    price: 7.99,
    category: "dessert",
    available: true,
    preparationTime: 4,
  },
  {
    id: "16",
    name: "Craft Beer",
    description: "Local IPA or Lager selection",
    price: 6.99,
    category: "beverage",
    available: true,
    preparationTime: 1,
  },
  {
    id: "17",
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons",
    price: 4.99,
    category: "beverage",
    available: true,
    preparationTime: 2,
  },
  {
    id: "18",
    name: "Espresso",
    description: "Double shot of premium espresso",
    price: 3.99,
    category: "beverage",
    available: true,
    preparationTime: 3,
  },
  {
    id: "19",
    name: "Cocktail Special",
    description: "Chef's signature cocktail of the day",
    price: 12.99,
    category: "beverage",
    available: true,
    preparationTime: 5,
  },
]

export const mockTables: Table[] = [
  { id: "1", number: 1, capacity: 2, status: "available" },
  { id: "2", number: 2, capacity: 4, status: "occupied", currentOrderId: "1" },
  { id: "3", number: 3, capacity: 6, status: "available" },
  { id: "4", number: 4, capacity: 2, status: "reserved" },
  { id: "5", number: 5, capacity: 4, status: "cleaning" },
  { id: "6", number: 6, capacity: 8, status: "available" },
  { id: "7", number: 7, capacity: 2, status: "occupied", currentOrderId: "5" },
  { id: "8", number: 8, capacity: 4, status: "available" },
  { id: "9", number: 9, capacity: 6, status: "reserved" },
  { id: "10", number: 10, capacity: 2, status: "available" },
  { id: "11", number: 11, capacity: 4, status: "cleaning" },
  { id: "12", number: 12, capacity: 8, status: "available" },
  { id: "13", number: 13, capacity: 2, status: "occupied", currentOrderId: "2" },
  { id: "14", number: 14, capacity: 6, status: "available" },
  { id: "15", number: 15, capacity: 4, status: "reserved" },
  { id: "16", number: 16, capacity: 10, status: "available" },
  { id: "17", number: 17, capacity: 2, status: "available" },
  { id: "18", number: 18, capacity: 4, status: "cleaning" },
  { id: "19", number: 19, capacity: 6, status: "available" },
  { id: "20", number: 20, capacity: 8, status: "available" },
]

export const mockOrderItems: OrderItem[] = [
  {
    id: "1",
    menuItemId: "1",
    quantity: 2,
    price: 25.98,
  },
  {
    id: "2",
    menuItemId: "2",
    quantity: 1,
    price: 24.99,
    specialInstructions: "No vegetables please",
  },
  {
    id: "3",
    menuItemId: "5",
    quantity: 1,
    price: 14.99,
    specialInstructions: "Extra spicy",
  },
  {
    id: "4",
    menuItemId: "8",
    quantity: 2,
    price: 65.98,
    specialInstructions: "Medium rare",
  },
  {
    id: "5",
    menuItemId: "16",
    quantity: 2,
    price: 13.98,
  },
  {
    id: "6",
    menuItemId: "10",
    quantity: 1,
    price: 16.99,
    specialInstructions: "Extra cheese",
  },
  {
    id: "7",
    menuItemId: "13",
    quantity: 1,
    price: 9.99,
  },
  {
    id: "8",
    menuItemId: "11",
    quantity: 3,
    price: 53.97,
    specialInstructions: "No cilantro",
  },
  {
    id: "9",
    menuItemId: "17",
    quantity: 1,
    price: 9.98,
  },
]

export const mockOrders: Order[] = [
  {
    id: "1",
    tableNumber: 2,
    waiterId: "2",
    items: [mockOrderItems[0], mockOrderItems[1]],
    status: "preparing",
    totalAmount: 50.97,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    estimatedReadyTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    notes: "Customer has nut allergy",
  },
  {
    id: "2",
    tableNumber: 4,
    waiterId: "2",
    items: [mockOrderItems[2], mockOrderItems[4]],
    status: "pending",
    totalAmount: 28.97,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    estimatedReadyTime: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
    notes: "Rush order for business meeting",
  },
  {
    id: "3",
    tableNumber: 1,
    waiterId: "2",
    items: [mockOrderItems[3], mockOrderItems[6]],
    status: "ready",
    totalAmount: 75.97,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    updatedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    estimatedReadyTime: new Date(Date.now() - 2 * 60 * 1000), // Ready 2 minutes ago
    notes: "Anniversary dinner - complimentary dessert",
  },
  {
    id: "4",
    tableNumber: 3,
    waiterId: "2",
    items: [mockOrderItems[5], mockOrderItems[8]],
    status: "served",
    totalAmount: 26.97,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    estimatedReadyTime: new Date(Date.now() - 45 * 60 * 1000),
    notes: "Vegetarian customer",
  },
  {
    id: "5",
    tableNumber: 6,
    waiterId: "2",
    items: [mockOrderItems[7]],
    status: "preparing",
    totalAmount: 53.97,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    updatedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    estimatedReadyTime: new Date(Date.now() + 8 * 60 * 1000), // 8 minutes from now
    notes: "Large family order",
  },
]

export const addOrder = (order: Order) => {
  mockOrders.push(order)
}

export const updateOrder = (updatedOrder: Order) => {
  const index = mockOrders.findIndex((order) => order.id === updatedOrder.id)
  if (index !== -1) {
    mockOrders[index] = updatedOrder
  }
}

export const cancelOrder = (orderId: string) => {
  const index = mockOrders.findIndex((order) => order.id === orderId)
  if (index !== -1) {
    mockOrders[index].status = "cancelled"
    mockOrders[index].updatedAt = new Date()
  }
}

export const getNextOrderId = () => {
  const maxId = Math.max(...mockOrders.map((order) => Number.parseInt(order.id)), 0)
  return (maxId + 1).toString()
}

export const addMenuItem = (menuItem: MenuItem) => {
  mockMenuItems.push(menuItem)
}

export const updateMenuItem = (updatedMenuItem: MenuItem) => {
  const index = mockMenuItems.findIndex((item) => item.id === updatedMenuItem.id)
  if (index !== -1) {
    mockMenuItems[index] = updatedMenuItem
  }
}

export const deleteMenuItem = (menuItemId: string) => {
  const index = mockMenuItems.findIndex((item) => item.id === menuItemId)
  if (index !== -1) {
    mockMenuItems.splice(index, 1)
  }
}

export const toggleMenuItemAvailability = (menuItemId: string) => {
  const index = mockMenuItems.findIndex((item) => item.id === menuItemId)
  if (index !== -1) {
    mockMenuItems[index].available = !mockMenuItems[index].available
  }
}

export const getNextMenuItemId = () => {
  const maxId = Math.max(...mockMenuItems.map((item) => Number.parseInt(item.id)), 0)
  return (maxId + 1).toString()
}
