"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Link from "next/link"

const bpData = [
  { time: "Mon", sys: 125, dia: 82 },
  { time: "Tue", sys: 130, dia: 85 },
  { time: "Wed", sys: 138, dia: 88 },
  { time: "Thu", sys: 145, dia: 95 },
  { time: "Fri", sys: 142, dia: 92 },
  { time: "Sat", sys: 140, dia: 90 },
  { time: "Sun", sys: 138, dia: 88 },
]

export default function PatientDetailPage() {
  return (
    <DashboardShell role="caregiver">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Link href="/caregiver/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Patient Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">MC</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Michael Chen</h1>
              <p className="text-muted-foreground">62 years • Patient ID: #001234</p>
            </div>
          </div>
          <Badge variant="destructive" className="h-8">
            2 Active Alerts
          </Badge>
        </div>

        {/* Current Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Latest BP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145/95</div>
              <p className="text-sm text-destructive mt-1">Elevated</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Heart Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78 BPM</div>
              <p className="text-sm text-muted-foreground mt-1">Normal</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Last Active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 min</div>
              <p className="text-sm text-muted-foreground mt-1">ago</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Readings Today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38</div>
              <p className="text-sm text-green-600 mt-1">+5 from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* BP Trend Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Blood Pressure Trend</CardTitle>
                <CardDescription>Past 7 days</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Week
                </Button>
                <Button variant="ghost" size="sm">
                  Month
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bpData}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="sys" stroke="hsl(var(--destructive))" strokeWidth={2} />
                <Line type="monotone" dataKey="dia" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Systolic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-sm text-muted-foreground">Diastolic</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-destructive/5 rounded-lg border-l-4 border-l-destructive">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">High BP Alert</p>
                    <p className="text-sm text-muted-foreground">BP reading of 145/95 mmHg</p>
                    <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-600">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Sustained Elevation</p>
                    <p className="text-sm text-muted-foreground">BP above normal for 4 hours</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Summary */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Daily Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average BP</span>
                <span className="font-semibold">140/90 mmHg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Maximum BP</span>
                <span className="font-semibold">145/95 mmHg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Minimum BP</span>
                <span className="font-semibold">135/85 mmHg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge variant="destructive">High</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Caregiver Notes</CardTitle>
              <Button size="sm">Add Note</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No notes added yet. Add observations about this patient's condition.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
