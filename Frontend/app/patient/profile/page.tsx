"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Wifi, Battery, Bluetooth } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardShell role="patient">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile & Device</h1>
          <p className="text-muted-foreground mt-1">Manage your account and device settings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Profile */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Sarah Johnson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || "sarah@example.com"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" defaultValue="1990-05-15" />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Device Information */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Device Status</CardTitle>
                  <Badge variant="outline" className="gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Connected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">ESP32 Module</p>
                      <p className="text-sm text-muted-foreground">HW-001234</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Battery className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Battery</p>
                      <p className="text-sm text-muted-foreground">85% charged</p>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-green-500 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bluetooth className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Bluetooth</p>
                      <p className="text-sm text-muted-foreground">Connected via BLE</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    BLE 5.0
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Sensor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">PPG Sensor</span>
                  <span className="text-sm font-medium">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">IMU Sensor</span>
                  <span className="text-sm font-medium">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <span className="text-sm font-medium">2 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Firmware Version</span>
                  <span className="text-sm font-medium">v2.4.1</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Sharing Preferences */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Data Sharing Preferences</CardTitle>
            <CardDescription>Control who can access your health data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium">Share with Healthcare Provider</p>
                <p className="text-sm text-muted-foreground">Allow your doctor to view your BP data</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium">Share with Caregiver</p>
                <p className="text-sm text-muted-foreground">Give family members access to your alerts</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
