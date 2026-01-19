"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Activity, TrendingUp, AlertCircle } from "lucide-react"

/**
 * Patient Dashboard Page
 * 
 * RBAC: Protected by /patient/layout.tsx
 * Only accessible to users with role = "patient"
 * 
 * Displays:
 * - Current blood pressure reading
 * - Heart rate
 * - Recent alerts
 * - Weekly BP trend
 */
export default function PatientDashboard() {
  // Mock data for demonstration
  const bpData = {
    systolic: 128,
    diastolic: 82,
    status: "Normal",
    lastMeasured: "2 minutes ago",
  }

  const heartRate = 72
  const alerts = [{ id: 1, message: "High BP detected", time: "30 min ago", severity: "warning" }]

  return (
    <FixedSidebarLayout role="patient">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your blood pressure monitoring overview</p>
        </div>
        
        <div className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Pressure Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Blood Pressure
              </CardTitle>
              <CardDescription>Latest reading: {bpData.lastMeasured}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {bpData.systolic}/{bpData.diastolic}
                  </div>
                  <p className="text-sm text-green-600 font-semibold mt-1">● {bpData.status}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>mmHg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heart Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{heartRate}</div>
              <p className="text-xs text-gray-500 mt-1">bpm</p>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold">Healthy</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex justify-between items-start p-2 bg-white rounded">
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Trend
            </CardTitle>
            <CardDescription>Your blood pressure trend over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              [Chart placeholder - 7-day BP trend]
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </FixedSidebarLayout>
  )
}

