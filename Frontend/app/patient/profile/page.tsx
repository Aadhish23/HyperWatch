"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Wifi, Battery, Bluetooth, Mail, UserPlus, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface FamilyMember {
  id: string
  name: string
  email: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", name: "John Johnson", email: "john.johnson@example.com" },
  ])
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")

  return (
    <FixedSidebarLayout role="patient">
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
                <Input id="name" defaultValue="AADHISH S" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || "aadhish23@example.com"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+91 94439936364" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" defaultValue="2007-05-15" />
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

        {/* Family Alert Recipients */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Family Alert Recipients
            </CardTitle>
            <CardDescription>
              Add family members who will receive email notifications when critical alerts are detected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Family Member Form */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                <UserPlus className="w-4 h-4" />
                Add New Family Member
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="familyName">Full Name</Label>
                  <Input
                    id="familyName"
                    placeholder="e.g., John Doe"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familyEmail">Email Address</Label>
                  <Input
                    id="familyEmail"
                    type="email"
                    placeholder="e.g., john.doe@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  if (!newName.trim()) {
                    toast({
                      variant: "destructive",
                      title: "Name Required",
                      description: "Please enter the family member's name",
                    })
                    return
                  }
                  if (!newEmail.trim() || !newEmail.includes("@")) {
                    toast({
                      variant: "destructive",
                      title: "Invalid Email",
                      description: "Please enter a valid email address",
                    })
                    return
                  }
                  const newMember: FamilyMember = {
                    id: Date.now().toString(),
                    name: newName,
                    email: newEmail,
                  }
                  setFamilyMembers([...familyMembers, newMember])
                  setNewName("")
                  setNewEmail("")
                  toast({
                    title: "Family Member Added",
                    description: `${newMember.name} will now receive alert notifications`,
                  })
                }}
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
            </div>

            {/* List of Family Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Current Recipients</Label>
                <Badge variant="secondary">{familyMembers.length} member(s)</Badge>
              </div>
              {familyMembers.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No family members added yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add family members above to start receiving alert notifications
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setFamilyMembers(familyMembers.filter((m) => m.id !== member.id))
                          toast({
                            title: "Member Removed",
                            description: `${member.name} will no longer receive alert notifications`,
                          })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FixedSidebarLayout>
  )
}
