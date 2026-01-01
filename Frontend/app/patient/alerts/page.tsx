"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "High Blood Pressure Alert",
    message: "BP reading of 145/95 mmHg detected",
    time: "2 hours ago",
    severity: "High",
  },
  {
    id: 2,
    type: "warning",
    title: "Elevated Heart Rate",
    message: "Heart rate reached 95 BPM during rest",
    time: "5 hours ago",
    severity: "Medium",
  },
  {
    id: 3,
    type: "info",
    title: "Calibration Due",
    message: "Device calibration recommended within 24 hours",
    time: "1 day ago",
    severity: "Low",
  },
  {
    id: 4,
    type: "warning",
    title: "Motion Artifact Detected",
    message: "Several readings affected by movement",
    time: "1 day ago",
    severity: "Medium",
  },
  {
    id: 5,
    type: "critical",
    title: "Abnormal BP Pattern",
    message: "Sustained high BP readings over 4 hours",
    time: "2 days ago",
    severity: "High",
  },
]

export default function AlertsPage() {
  return (
    <DashboardShell role="patient">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay informed about your health status</p>
        </div>

        {/* Alert Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg">Critical</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-sm text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-lg">Warning</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-sm text-muted-foreground mt-1">Monitor closely</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1</div>
              <p className="text-sm text-muted-foreground mt-1">For your information</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {alert.type === "critical" ? (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        ) : alert.type === "warning" ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-600" />
                        )}
                        <h3 className="font-semibold">{alert.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
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
    </DashboardShell>
  )
}
