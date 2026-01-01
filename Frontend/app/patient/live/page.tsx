"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Radio, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

export default function LiveMonitoringPage() {
  const [ppgData, setPpgData] = useState<number[]>([])

  useEffect(() => {
    // Simulate live PPG waveform
    const interval = setInterval(() => {
      setPpgData((prev) => {
        const newData = [...prev, Math.sin(Date.now() / 200) * 50 + 50]
        return newData.slice(-100)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardShell role="patient">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Monitoring</h1>
          <p className="text-muted-foreground mt-1">Real-time vital signs and sensor data</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Live BP Values */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Blood Pressure</CardTitle>
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <div className="text-6xl font-bold text-primary">120</div>
                <div className="text-4xl font-bold text-muted-foreground">/</div>
                <div className="text-6xl font-bold text-chart-2">80</div>
                <div className="text-lg text-muted-foreground">mmHg</div>
              </div>
              <div className="mt-4 flex gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Systolic</p>
                  <p className="text-2xl font-semibold">120</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diastolic</p>
                  <p className="text-2xl font-semibold">80</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="text-2xl font-semibold">72 BPM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signal Quality */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Signal Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">PPG Signal</span>
                  <span className="text-sm font-medium">Excellent</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-green-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">IMU Stability</span>
                  <span className="text-sm font-medium">Good</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-primary rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Confidence</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-primary rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live PPG Waveform */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>PPG Waveform</CardTitle>
                <CardDescription>Photoplethysmography signal</CardDescription>
              </div>
              <Radio className="w-5 h-5 text-primary animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 rounded-lg p-4 h-64 relative overflow-hidden">
              <svg width="100%" height="100%" className="absolute inset-0">
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  points={ppgData.map((value, index) => `${(index / ppgData.length) * 100}%,${100 - value}%`).join(" ")}
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Motion & Warnings */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Motion Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Activity className="w-12 h-12 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">Resting</p>
                  <p className="text-sm text-muted-foreground">Low motion detected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <CardTitle>Motion Artifacts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No significant motion artifacts detected. Readings are accurate.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
