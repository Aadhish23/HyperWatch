"use client"

import { useState, useEffect } from "react"
import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, Info, Check, X, Filter } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch alerts from backend on mount
  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setIsLoading(true)
      // Fetch only unread alerts for better UX
      const data = await apiClient.getAlerts({ is_read: false, limit: 50 })
      setAlerts(data)
    } catch (err) {
      console.error("Failed to fetch alerts", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load alerts",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true
    return alert.alert_type === filter
  })

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await apiClient.markAlertAsRead(alertId)

      // 🔥 Re-fetch alerts from backend
      const updatedAlerts = await apiClient.getAlerts({ is_read: false, limit: 50 })
      setAlerts(updatedAlerts)

      toast({
        title: "Alert Acknowledged",
        description: "Alert marked as read",
      })
    } catch (err) {
      console.error("Failed to mark alert as read", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark alert as read",
      })
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      await apiClient.resolveAlert(alertId)

      // 🔥 Re-fetch alerts from backend
      const updatedAlerts = await apiClient.getAlerts({ is_read: false, limit: 50 })
      setAlerts(updatedAlerts)

      toast({
        title: "Alert Resolved",
        description: "Alert has been resolved",
      })
    } catch (err) {
      console.error("Failed to resolve alert", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resolve alert",
      })
    }
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
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading alerts...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
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