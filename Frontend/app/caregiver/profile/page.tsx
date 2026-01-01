"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function CaregiverProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardShell role="caregiver">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and notification preferences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Jennifer Martinez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || "jennifer@healthcare.com"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 987-6543" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Registered Nurse" disabled />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Get instant alerts on your device</p>
                  </div>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive daily summaries via email</p>
                  </div>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">SMS Alerts</p>
                    <p className="text-sm text-muted-foreground">Critical alerts via text message</p>
                  </div>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>

              <Button className="w-full bg-transparent" variant="outline">
                Manage Preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Patients */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Assigned Patients</CardTitle>
            <CardDescription>Patients currently under your care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {["Sarah Johnson", "Michael Chen", "Emma Rodriguez", "Robert Williams", "Lisa Anderson"].map(
                (patient, idx) => (
                  <div key={idx} className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between">
                    <span className="font-medium">{patient}</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
