"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Activity, TrendingUp, AlertCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
 * - Recent vitals history
 * - Weekly BP trend
 */
export default function PatientDashboard() {
  // Mock vitals data with realistic readings
  const currentVitals = {
    systolic: 138,
    diastolic: 86,
    heartRate: 78,
    status: "Elevated",
    statusColor: "text-yellow-600",
    lastMeasured: "2 minutes ago",
  }

  // Recent vitals history (last 5 readings)
  const recentReadings = [
    { id: 1, systolic: 138, diastolic: 86, heartRate: 78, time: "2 min ago", status: "elevated" },
    { id: 2, systolic: 142, diastolic: 90, heartRate: 82, time: "1 hour ago", status: "elevated" },
    { id: 3, systolic: 135, diastolic: 84, heartRate: 75, time: "3 hours ago", status: "elevated" },
    { id: 4, systolic: 128, diastolic: 80, heartRate: 72, time: "6 hours ago", status: "normal" },
    { id: 5, systolic: 132, diastolic: 82, heartRate: 76, time: "9 hours ago", status: "normal" },
  ]

  // Weekly averages
  const weeklyStats = {
    avgSystolic: 135,
    avgDiastolic: 84,
    avgHeartRate: 76,
    trend: "up", // up, down, stable
  }

  const alerts = [
    { id: 1, message: "High BP detected: 142/90 mmHg", time: "1 hour ago", severity: "warning" },
    { id: 2, message: "Heart rate elevated: 88 bpm", time: "2 hours ago", severity: "warning" },
    { id: 3, message: "Medication reminder due", time: "3 hours ago", severity: "info" },
  ]

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
              <CardDescription>Latest reading: {currentVitals.lastMeasured}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {currentVitals.systolic}/{currentVitals.diastolic}
                  </div>
                  <p className={`text-sm font-semibold mt-1 ${currentVitals.statusColor}`}>
                    ● {currentVitals.status}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">7-day avg: {weeklyStats.avgSystolic}/{weeklyStats.avgDiastolic}</p>
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
              <div className="text-3xl font-bold">{currentVitals.heartRate}</div>
              <p className="text-xs text-gray-500 mt-1">bpm</p>
              <p className="text-xs text-gray-500 mt-2">7-day avg: {weeklyStats.avgHeartRate} bpm</p>
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

        {/* Recent Vitals History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Readings
            </CardTitle>
            <CardDescription>Your latest blood pressure and heart rate measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReadings.map((reading) => (
                <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-lg">
                        {reading.systolic}/{reading.diastolic}
                      </p>
                      <p className="text-xs text-gray-500">mmHg</p>
                    </div>
                    <div className="border-l pl-4">
                      <p className="font-semibold">{reading.heartRate} bpm</p>
                      <p className="text-xs text-gray-500">Heart Rate</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={reading.status === "normal" ? "secondary" : "default"}>
                      {reading.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{reading.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

