"use client"

import { useState } from "react"
import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, Info, Check, X, Filter } from "lucide-react"

const initialAlerts = [
  {
    id: 1,
    type: "critical",
    title: "High Blood Pressure Alert",
    message: "BP reading of 145/95 mmHg detected",
    time: "2 hours ago",
    severity: "High",
    dismissed: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Elevated Heart Rate",
    message: "Heart rate reached 95 BPM during rest",
    time: "5 hours ago",
    severity: "Medium",
    dismissed: false,
  },
  {
    id: 3,
    type: "info",
    title: "Calibration Due",
    message: "Device calibration recommended within 24 hours",
    time: "1 day ago",
    severity: "Low",
    dismissed: false,
  },
  {
    id: 4,
    type: "warning",
    title: "Motion Artifact Detected",
    message: "Several readings affected by movement",
    time: "1 day ago",
    severity: "Medium",
    dismissed: false,
  },
  {
    id: 5,
    type: "critical",
    title: "Abnormal BP Pattern",
    message: "Sustained high BP readings over 4 hours",
    time: "2 days ago",
    severity: "High",
    dismissed: false,
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState("all")

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return !alert.dismissed
    return alert.type === filter && !alert.dismissed
  })

  const dismissAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ))
  }

  const acknowledgeAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ))
  }

  const criticalCount = alerts.filter(a => a.type === "critical" && !a.dismissed).length
  const warningCount = alerts.filter(a => a.type === "warning" && !a.dismissed).length
  const infoCount = alerts.filter(a => a.type === "info" && !a.dismissed).length

  return (
    <FixedSidebarLayout role="patient">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay informed about your health status</p>
        </div>

        {/* Alert Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card 
            className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
              filter === "critical" 
                ? "bg-destructive/10 border-2 border-destructive" 
                : "bg-destructive/5 border-destructive/20"
            }`}
            onClick={() => setFilter(filter === "critical" ? "all" : "critical")}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg">Critical</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{criticalCount}</div>
              <p className="text-sm text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card 
            className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
              filter === "warning"
                ? "bg-yellow-100 border-2 border-yellow-600"
                : "bg-yellow-50 border-yellow-200"
            }`}
            onClick={() => setFilter(filter === "warning" ? "all" : "warning")}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-lg">Warning</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{warningCount}</div>
              <p className="text-sm text-muted-foreground mt-1">Monitor closely</p>
            </CardContent>
          </Card>

          <Card 
            className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
              filter === "info"
                ? "bg-blue-100 border-2 border-blue-600"
                : "bg-blue-50 border-blue-200"
            }`}
            onClick={() => setFilter(filter === "info" ? "all" : "info")}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{infoCount}</div>
              <p className="text-sm text-muted-foreground mt-1">For your information</p>
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              {filter !== "all" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Clear Filter
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No alerts to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
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
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            alert.type === "critical" ? "destructive" : alert.type === "warning" ? "default" : "secondary"
                          }
                        >
                          {alert.severity}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="h-8 px-2"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissAlert(alert.id)}
                            className="h-8 px-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FixedSidebarLayout>
  )
}