"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingUp, User, Users, Activity, FileText } from "lucide-react"
import Link from "next/link"

const patients = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 34,
    avgBP: "120/80",
    risk: "low",
    alerts: 0,
    lastReading: "5 min ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 62,
    avgBP: "142/93",
    risk: "high",
    alerts: 5,
    lastReading: "15 min ago",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    age: 45,
    avgBP: "118/76",
    risk: "low",
    alerts: 0,
    lastReading: "1 hour ago",
  },
  {
    id: 4,
    name: "Robert Williams",
    age: 58,
    avgBP: "135/87",
    risk: "medium",
    alerts: 2,
    lastReading: "2 hours ago",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    age: 51,
    avgBP: "115/75",
    risk: "low",
    alerts: 0,
    lastReading: "30 min ago",
  },
  {
    id: 6,
    name: "David Thompson",
    age: 68,
    avgBP: "148/96",
    risk: "high",
    alerts: 7,
    lastReading: "45 min ago",
  },
]

export default function ClinicianDashboard() {
  return (
    <FixedSidebarLayout role="clinician">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Clinician Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive patient monitoring and analysis</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardDescription>Total Patients</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{patients.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Under monitoring</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <CardDescription>High Risk</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {patients.filter((p) => p.risk === "high").length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <CardDescription>Medium Risk</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">
                {patients.filter((p) => p.risk === "medium").length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Monitor closely</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                <CardDescription>Active Alerts</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{patients.reduce((sum, p) => sum + p.alerts, 0)}</div>
              <p className="text-sm text-muted-foreground mt-1">Across all patients</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Patient Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Overview</CardTitle>
                <CardDescription>Monitor BP status and risk levels</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  All Patients
                </Button>
                <Button variant="ghost" size="sm">
                  High Risk Only
                </Button>
                <Button variant="ghost" size="sm">
                  Recent Alerts
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => (
                <Link key={patient.id} href={`/clinician/analysis?patient=${patient.id}`}>
                  <div className="p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>

                      <div className="flex-1 grid md:grid-cols-5 gap-4 items-center">
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">{patient.age} years old</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Avg BP (7d)</p>
                          <p className="font-semibold">{patient.avgBP} mmHg</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                          <Badge
                            variant={
                              patient.risk === "high"
                                ? "destructive"
                                : patient.risk === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className={
                              patient.risk === "low" ? "bg-green-100 text-green-700 border-green-300" : undefined
                            }
                          >
                            {patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1)}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                          <div className="flex items-center gap-2">
                            {patient.alerts > 0 ? (
                              <>
                                <AlertCircle className="w-4 h-4 text-destructive" />
                                <span className="font-semibold">{patient.alerts}</span>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">None</span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Last Reading</p>
                          <p className="text-sm font-medium">{patient.lastReading}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/clinician/analysis">
            <Card className="border-0 shadow-sm hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Patient Analysis</h3>
                    <p className="text-sm text-muted-foreground">View detailed analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/clinician/reports">
            <Card className="border-0 shadow-sm hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Reports & Export</h3>
                    <p className="text-sm text-muted-foreground">Generate patient reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/clinician/alerts">
            <Card className="border-0 shadow-sm hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Alerts & Risk</h3>
                    <p className="text-sm text-muted-foreground">Review critical alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </FixedSidebarLayout>
  )
}

