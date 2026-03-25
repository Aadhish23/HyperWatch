"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, User } from "lucide-react"

const alerts = [
  {
    id: 1,
    patientName: "Michael Chen",
    type: "critical",
    title: "Critical High Blood Pressure",
    message: "BP: 165/105 mmHg, HR: 95 bpm - Immediate attention required",
    time: "15 min ago",
    severity: "High",
    vitals: { systolic: 165, diastolic: 105, heartRate: 95 },
  },
  {
    id: 2,
    patientName: "Michael Chen",
    type: "warning",
    title: "Sustained Elevation",
    message: "BP above normal for 4 consecutive hours. Current: 145/95 mmHg, HR: 88 bpm",
    time: "2 hours ago",
    severity: "Medium",
    vitals: { systolic: 145, diastolic: 95, heartRate: 88 },
  },
  {
    id: 3,
    patientName: "Robert Williams",
    type: "warning",
    title: "Elevated Reading",
    message: "BP: 148/92 mmHg, HR: 86 bpm - Monitor patient closely",
    time: "2 hours ago",
    severity: "Medium",
    vitals: { systolic: 148, diastolic: 92, heartRate: 86 },
  },
  {
    id: 4,
    patientName: "Sarah Johnson",
    type: "warning",
    title: "Rapid Heart Rate",
    message: "Heart rate elevated at 102 bpm. BP: 135/84 mmHg",
    time: "3 hours ago",
    severity: "Medium",
    vitals: { systolic: 135, diastolic: 84, heartRate: 102 },
  },
  {
    id: 5,
    patientName: "Sarah Johnson",
    type: "info",
    title: "Calibration Due",
    message: "Device calibration recommended for accurate readings",
    time: "5 hours ago",
    severity: "Low",
  },
  {
    id: 6,
    patientName: "Emma Rodriguez",
    type: "info",
    title: "Missed Readings",
    message: "No readings received in last 3 hours. Last BP: 118/76 mmHg",
    time: "3 hours ago",
    severity: "Low",
  },
  {
    id: 7,
    patientName: "David Thompson",
    type: "critical",
    title: "Emergency Alert",
    message: "BP: 172/110 mmHg, HR: 98 bpm - Contact patient immediately!",
    time: "45 min ago",
    severity: "High",
    vitals: { systolic: 172, diastolic: 110, heartRate: 98 },
  },
]

export default function CaregiverAlertsPage() {
  return (
    <FixedSidebarLayout role="caregiver">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-1">Monitor patient alerts across all assigned cases</p>
        </div>

        {/* Alert Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg">Critical Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {alerts.filter((a) => a.type === "critical").length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Immediate attention required</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-lg">Warnings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">
                {alerts.filter((a) => a.type === "warning").length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Monitor closely</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Informational</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{alerts.filter((a) => a.type === "info").length}</div>
              <p className="text-sm text-muted-foreground mt-1">For your awareness</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>All Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === "critical"
                      ? "bg-destructive/5 border-l-destructive"
                      : alert.type === "warning"
                        ? "bg-yellow-50 border-l-yellow-600"
                        : "bg-blue-50 border-l-blue-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {alert.type === "critical" ? (
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          ) : alert.type === "warning" ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                          )}
                          <h3 className="font-semibold">{alert.title}</h3>
                        </div>
                        <p className="text-sm font-medium text-primary mb-1">{alert.patientName}</p>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        alert.type === "critical" ? "destructive" : alert.type === "warning" ? "default" : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FixedSidebarLayout>
  )
}

