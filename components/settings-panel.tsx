"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Store, Bell, Users, CreditCard, Shield, Palette, Clock, Printer, Wifi, Calendar, X } from "lucide-react"

interface SettingsPanelProps {
  autoResetEnabled: boolean
  setAutoResetEnabled: (enabled: boolean) => void
  resetInterval: number
  setResetInterval: (hours: number) => void
  holidays: string[]
  addHoliday: (date: string) => void
  removeHoliday: (date: string) => void
}

export function SettingsPanel({
  autoResetEnabled,
  setAutoResetEnabled,
  resetInterval,
  setResetInterval,
  holidays,
  addHoliday,
  removeHoliday,
}: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(true)
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [newHoliday, setNewHoliday] = useState("")

  const handleAddHoliday = () => {
    if (newHoliday && !holidays.includes(newHoliday)) {
      addHoliday(newHoliday)
      setNewHoliday("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Restaurant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Restaurant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Restaurant Name</Label>
              <Input id="restaurant-name" defaultValue="Bella Vista Restaurant" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="info@bellavista.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Select defaultValue="italian">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="american">American</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue="123 Main Street, Downtown, NY 10001" />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">Play sound when new orders arrive</p>
            </div>
            <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Accept Orders</Label>
              <p className="text-sm text-muted-foreground">Automatically accept incoming orders</p>
            </div>
            <Switch checked={autoAcceptOrders} onCheckedChange={setAutoAcceptOrders} />
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operating Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Opening Time</Label>
              <Input type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
              <Label>Closing Time</Label>
              <Input type="time" defaultValue="22:00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Closed Days</Label>
            <div className="flex flex-wrap gap-2">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <Badge key={day} variant="outline" className="cursor-pointer hover:bg-muted">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Staff Members</p>
              <p className="text-sm text-muted-foreground">5 staff members currently logged in</p>
            </div>
            <Button variant="outline" size="sm">
              Manage Staff
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Default Staff Role</Label>
            <Select defaultValue="server">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="host">Host</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input type="number" defaultValue="8.25" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>Service Charge (%)</Label>
              <Input type="number" defaultValue="18" step="0.01" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accepted Payment Methods</Label>
            <div className="flex flex-wrap gap-2">
              {["Cash", "Credit Card", "Debit Card", "Mobile Pay", "Gift Cards"].map((method) => (
                <Badge key={method} variant="secondary" className="cursor-pointer">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="cad">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Hardware Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Hardware Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                Kitchen Printer
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Connected
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground">HP LaserJet Pro - Kitchen Station</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                Receipt Printer
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Offline
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground">Epson TM-T88V - Front Counter</p>
            </div>
            <Button variant="outline" size="sm">
              Reconnect
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                WiFi Network
              </p>
              <p className="text-sm text-muted-foreground">RestaurantWiFi - Strong Signal</p>
            </div>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Backup</p>
              <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
            </div>
            <Button variant="outline" size="sm">
              Backup Now
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Auto-Reset Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Auto-Reset Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Reset Staff Status</Label>
              <p className="text-sm text-muted-foreground">
                Automatically mark all staff as absent after specified hours
              </p>
            </div>
            <Switch checked={autoResetEnabled} onCheckedChange={setAutoResetEnabled} />
          </div>

          {autoResetEnabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Reset Interval (Hours)</Label>
                <Select
                  value={resetInterval.toString()}
                  onValueChange={(value) => setResetInterval(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Separator />
          <div className="space-y-2">
            <Label>Company Holidays</Label>
            <p className="text-sm text-muted-foreground">Staff auto-reset will be skipped on these dates</p>
            <div className="flex gap-2">
              <Input
                type="date"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
                placeholder="Select holiday date"
              />
              <Button onClick={handleAddHoliday} size="sm">
                Add Holiday
              </Button>
            </div>
            {holidays.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {holidays.map((holiday) => (
                  <Badge key={holiday} variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(holiday).toLocaleDateString()}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeHoliday(holiday)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
