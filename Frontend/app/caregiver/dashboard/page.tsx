"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ChevronRight, Heart, TrendingUp, User } from "lucide-react"
import Link from "next/link"

const patients = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 34,
    latestBP: "120/80",
    status: "normal",
    lastActive: "5 min ago",
    alerts: 0,
    trend: "stable",
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 62,
    latestBP: "145/95",
    status: "elevated",
    lastActive: "15 min ago",
    alerts: 2,
    trend: "up",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    age: 45,
    latestBP: "118/76",
    status: "normal",
    lastActive: "1 hour ago",
    alerts: 0,
    trend: "stable",
  },
  {
    id: 4,
    name: "Robert Williams",
    age: 58,
    latestBP: "138/88",
    status: "elevated",
    lastActive: "2 hours ago",
    alerts: 1,
    trend: "up",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    age: 51,
    latestBP: "115/75",
    status: "normal",
    lastActive: "30 min ago",
    alerts: 0,
    trend: "down",
  },
]

export default function CaregiverDashboard() {
  return (
    <DashboardShell role="caregiver">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Caregiver Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your assigned patients</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Total Patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{patients.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Currently assigned</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardDescription>Normal Status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">
                {patients.filter((p) => p.status === "normal").length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Stable readings</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardDescription>Elevated BP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">
                {patients.filter((p) => p.status === "elevated").length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <CardDescription>Active Alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {patients.reduce((sum, p) => sum + p.alerts, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Require review</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assigned Patients</CardTitle>
                <CardDescription>Click on a patient to view detailed information</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => (
                <Link key={patient.id} href={`/caregiver/patients/${patient.id}`}>
                  <div className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{patient.name}</h3>
                            <span className="text-sm text-muted-foreground">• {patient.age} years</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Last active: {patient.lastActive}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-primary" />
                            <span className="text-lg font-semibold">{patient.latestBP}</span>
                            <span className="text-sm text-muted-foreground">mmHg</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs mt-1">
                            <TrendingUp
                              className={`w-3 h-3 ${patient.trend === "up" ? "text-destructive" : patient.trend === "down" ? "text-green-600 rotate-180" : "text-muted-foreground"}`}
                            />
                            <span className="text-muted-foreground capitalize">{patient.trend}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <Badge
                            variant={patient.status === "normal" ? "secondary" : "destructive"}
                            className={
                              patient.status === "normal" ? "bg-green-100 text-green-700 border-green-300" : ""
                            }
                          >
                            {patient.status === "normal" ? "Normal" : "Elevated"}
                          </Badge>
                          {patient.alerts > 0 && (
                            <div className="flex items-center gap-1 text-xs text-destructive">
                              <AlertCircle className="w-3 h-3" />
                              <span>
                                {patient.alerts} alert{patient.alerts > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>

                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Michael Chen - High BP Alert</p>
                  <p className="text-xs text-muted-foreground">145/95 mmHg detected • 15 min ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Robert Williams - Elevated Reading</p>
                  <p className="text-xs text-muted-foreground">138/88 mmHg detected • 2 hours ago</p>
                </div>
              </div>
              <Link href="/caregiver/alerts">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Alerts
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Tips & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm">Check on patients with elevated BP readings regularly throughout the day.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm">Encourage patients to maintain consistent monitoring schedules.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm">Review alert patterns to identify potential health concerns early.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
