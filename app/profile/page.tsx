"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { mockBranchStaff } from "@/lib/mock-data"

export default function ProfilePage() {
  const manager = mockBranchStaff.find((m) => m.role.toLowerCase() === "manager") || mockBranchStaff[0]
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Profile</h1>
          <Link href="/dashboard" className="inline-flex">
            <Button variant="outline" size="sm">Back to Dashboard</Button>
          </Link>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{manager?.avatar || "DF"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base sm:text-lg">{manager?.fullName || manager?.name || "Manager"}</CardTitle>
                <div className="text-xs text-muted-foreground">{manager?.branchName}</div>
              </div>
            </div>
            <Badge variant="outline">{manager?.role || "Manager"}</Badge>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Manager Name</div>
              <div className="text-sm">{manager?.name}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Branch</div>
              <div className="text-sm">{manager?.branchName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">NID</div>
              <div className="text-sm">{manager?.nationalId}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="text-sm">{manager?.contactNumber}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-muted-foreground">Address</div>
              <div className="text-sm">{manager?.address}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Joined</div>
              <div className="text-sm">{manager?.dateOfJoining ? new Date(manager.dateOfJoining).toLocaleDateString() : "—"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="text-sm capitalize">{manager?.status}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}