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
    title: "High Blood Pressure",
    message: "BP reading of 145/95 mmHg detected",
    time: "15 min ago",
    severity: "High",
  },
  {
    id: 2,
    patientName: "Michael Chen",
    type: "warning",
    title: "Sustained Elevation",
    message: "BP above normal for 4 consecutive hours",
    time: "2 hours ago",
    severity: "Medium",
  },
  {
    id: 3,
    patientName: "Robert Williams",
    type: "warning",
    title: "Elevated Reading",
    message: "BP reading of 138/88 mmHg detected",
    time: "2 hours ago",
    severity: "Medium",
  },
  {
    id: 4,
    patientName: "Sarah Johnson",
    type: "info",
    title: "Calibration Due",
    message: "Device calibration recommended",
    time: "5 hours ago",
    severity: "Low",
  },
  {
    id: 5,
    patientName: "Emma Rodriguez",
    type: "info",
    title: "Missed Readings",
    message: "No readings received in last 3 hours",
    time: "3 hours ago",
    severity: "Low",
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

