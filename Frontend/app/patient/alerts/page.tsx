"use client"

import { useState } from "react"
import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, Info, Check, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock alerts data with heart rate and BP information
const mockAlerts = [
  {
    _id: "1",
    alert_type: "critical",
    title: "Critical High Blood Pressure",
    message: "BP reading of 165/105 mmHg detected. Heart rate: 95 bpm. Please seek immediate medical attention.",
    severity: "Critical",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    vitals: { systolic: 165, diastolic: 105, heartRate: 95 }
  },
  {
    _id: "2",
    alert_type: "warning",
    title: "Elevated Blood Pressure",
    message: "BP reading of 145/92 mmHg detected. Heart rate: 88 bpm. Monitor closely and consider rest.",
    severity: "High",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
    vitals: { systolic: 145, diastolic: 92, heartRate: 88 }
  },
  {
    _id: "3",
    alert_type: "warning",
    title: "Rapid Heart Rate",
    message: "Heart rate of 105 bpm detected. BP: 138/86 mmHg. Please rest and avoid strenuous activity.",
    severity: "Medium",
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 1.5 hours ago
    vitals: { systolic: 138, diastolic: 86, heartRate: 105 }
  },
  {
    _id: "4",
    alert_type: "warning",
    title: "Sustained Elevation",
    message: "BP above normal range for 3 consecutive hours. Current: 142/90 mmHg, HR: 82 bpm.",
    severity: "Medium",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    vitals: { systolic: 142, diastolic: 90, heartRate: 82 }
  },
  {
    _id: "5",
    alert_type: "info",
    title: "Calibration Reminder",
    message: "Device calibration recommended for accurate readings. Last calibration: 7 days ago.",
    severity: "Low",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    _id: "6",
    alert_type: "info",
    title: "Medication Reminder",
    message: "Time to take your blood pressure medication. Last dose: 12 hours ago.",
    severity: "Low",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    _id: "7",
    alert_type: "critical",
    title: "Very High Blood Pressure",
    message: "BP reading of 172/110 mmHg detected. Heart rate: 98 bpm. Seek emergency care immediately!",
    severity: "Critical",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    vitals: { systolic: 172, diastolic: 110, heartRate: 98 }
  },
  {
    _id: "8",
    alert_type: "warning",
    title: "Low Heart Rate",
    message: "Heart rate of 52 bpm detected. BP: 115/72 mmHg. Monitor for dizzinessOr fatigue.",
    severity: "Medium",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    vitals: { systolic: 115, diastolic: 72, heartRate: 52 }
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>(mockAlerts)
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true
    return alert.alert_type === filter
  })

  const handleMarkAsRead = (alertId: string) => {
    // Remove alert from list (mock behavior)
    setAlerts(alerts.filter(alert => alert._id !== alertId))
    
    toast({
      title: "Alert Acknowledged",
      description: "Alert marked as read",
    })
  }

  const criticalCount = alerts.filter(a => a.alert_type === "critical").length
  const warningCount = alerts.filter(a => a.alert_type === "warning").length
  const infoCount = alerts.filter(a => a.alert_type === "info").length

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
                    key={alert._id}
                    className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
                      alert.alert_type === "critical"
                        ? "bg-destructive/5 border-l-destructive"
                        : alert.alert_type === "warning"
                          ? "bg-yellow-50 border-l-yellow-600"
                          : "bg-blue-50 border-l-blue-600"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {alert.alert_type === "critical" ? (
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          ) : alert.alert_type === "warning" ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <Info className="w-5 h-5 text-blue-600" />
                          )}
                          <h3 className="font-semibold">{alert.title || alert.alert_type}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            alert.alert_type === "critical" ? "destructive" : alert.alert_type === "warning" ? "default" : "secondary"
                          }
                        >
                          {alert.severity || alert.alert_type}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(alert._id)}
                          className="h-8 px-3 gap-2"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-xs">Acknowledge</span>
                        </Button>
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