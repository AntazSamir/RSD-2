# Restaurant Dashboard

## Overview

The Restaurant Dashboard is the main application page that provides a comprehensive overview of restaurant operations. It includes real-time data visualization, order management, table status tracking, staff management, and analytics.

## Features

### 1. Dashboard Overview
- **Active Orders**: Displays the current number of active orders
- **Occupied Tables**: Shows the number of tables currently in use
- **Today's Revenue**: Displays the total revenue for the current day
- **Average Order Time**: Shows the average time to prepare orders

### 2. Recent Orders
- Displays the 3 most recent orders
- Shows table number, item count, and total amount
- Displays order status with color-coded badges

### 3. Table Status
- Visual grid of all tables with color-coded status indicators
- Shows table number, seating capacity, and current status
- Allows assigning new orders to available tables

### 4. Staff Status
- Tracks working and absent staff members
- Displays staff information including name, role, and shift times
- Allows marking staff as present or absent
- Provides access to edit staff shift times

### 5. Navigation
The dashboard includes a sidebar navigation with the following sections:
- Overview (current page)
- Orders
- Menu
- Tables
- Analytics
- Settings
- Customers

## State Management

The dashboard uses React hooks for state management:

### useState Hooks
- `activeTab`: Tracks the currently active navigation tab
- `newOrderOpen`: Controls the visibility of the new order dialog
- `preSelectedTable`: Stores the table number for pre-selected orders
- `staffStatus`: Tracks the working/absent status of staff members
- `staffTimes`: Stores shift start and end times for staff members
- `lastResetTime`: Tracks the last time staff status was reset
- `holidays`: Stores holiday dates
- `autoResetEnabled`: Controls whether auto-reset is enabled
- `resetInterval`: Sets the interval for auto-reset in hours

### useMemo Hooks
- `dashboardStats`: Calculates key metrics for the dashboard overview
- `recentOrders`: Filters and sorts recent orders

### useCallback Hooks
- `addHoliday`: Adds a holiday date to the holidays array
- `removeHoliday`: Removes a holiday date from the holidays array
- `getTableOrder`: Retrieves the current order for a given table number
- `handleAssignTable`: Handles assigning a table for a new order
- `handleTableAssigned`: Handles post-assignment cleanup
- `handleNewOrderChange`: Handles changes to the new order dialog visibility
- `toggleStaffStatus`: Toggles staff between working and absent status
- `updateStaffTime`: Updates staff shift times
- `manualReset`: Manually resets all staff to absent status
- `resetSettings`: Resets all settings to default values

## Auto-reset Feature

The dashboard includes an auto-reset feature that automatically marks all staff as absent after a specified interval:

- **Default Interval**: 12 hours
- **Holiday Support**: Auto-reset is skipped on holidays
- **Manual Reset**: Staff can manually reset all staff status
- **Settings Reset**: All settings can be reset to defaults

## Data Sources

The dashboard uses mock data for development:
- `mockOrders`: Sample order data
- `mockTables`: Sample table data
- `mockStaff`: Sample staff data

## Components Used

### UI Components
- Card, CardHeader, CardTitle, CardContent (from `@/components/ui/card`)
- Button (from `@/components/ui/button`)
- Badge (from `@/components/ui/badge`)
- Input (from `@/components/ui/input`)

### Custom Components
- SettingsPanel: Manages auto-reset settings
- ThemeToggle: Allows switching between light and dark themes
- NewOrderDialog: Handles creating new orders
- EditStaffTimeDialog: Allows editing staff shift times
- OrderDetailsDialog: Displays detailed order information

## Icons

The dashboard uses Lucide React icons:
- ChefHat
- ClipboardList
- Users
- Clock
- DollarSign
- Settings
- BarChart3
- UtensilsCrossed
- Grid3X3
- UserCheck
- Package

## Responsive Design

The dashboard is designed to be responsive and works on various screen sizes:
- Mobile-friendly layout
- Responsive grid systems
- Adaptive component sizing
- Touch-friendly controls

## Performance Considerations

- Lazy loading for heavy components
- Memoization of expensive calculations
- Efficient state updates
- Proper cleanup of intervals and effects

## Testing

To test the dashboard:

1. **Unit Tests**: Test individual components and hooks
2. **Integration Tests**: Test interactions between components
3. **End-to-End Tests**: Test user flows and scenarios
4. **Error Handling**: Test error boundaries and fallback UI

## Error Handling

The dashboard includes error boundaries to catch and handle errors gracefully:
- Error boundaries wrap critical sections
- Clear error messages are displayed to users
- Logging of errors for debugging purposes
- Recovery options for users

## Customization

The dashboard can be customized through:
- Settings panel for auto-reset configuration
- Theme switching between light and dark modes
- Staff management and scheduling
- Holiday management for auto-reset