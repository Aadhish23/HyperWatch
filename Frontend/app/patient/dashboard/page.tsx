"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Wifi, TrendingUp, AlertCircle, ChevronRight } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Link from "next/link"

const bpData = [
  { time: "00:00", sys: 120, dia: 80 },
  { time: "04:00", sys: 118, dia: 78 },
  { time: "08:00", sys: 125, dia: 82 },
  { time: "12:00", sys: 130, dia: 85 },
  { time: "16:00", sys: 128, dia: 83 },
  { time: "20:00", sys: 122, dia: 80 },
  { time: "24:00", sys: 120, dia: 79 },
]

export default function PatientDashboard() {
  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? "Good Morning" : currentTime < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <FixedSidebarLayout role="patient">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{greeting}, Sarah</h1>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2 px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              ESP32 Connected
            </Badge>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Visual */}
          <Card className="lg:col-span-2 overflow-hidden border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Current Vitals</CardTitle>
              <CardDescription>Real-time monitoring data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Heart Illustration with Metrics */}
                <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
                  <Heart className="w-32 h-32 text-primary/20 absolute" />
                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-bold text-primary mb-2">72</div>
                    <div className="text-sm text-muted-foreground">BPM</div>
                  </div>
                  {/* Floating BP Metrics */}
                  <div className="absolute top-4 right-4 bg-card rounded-xl shadow-md p-3 border">
                    <div className="text-2xl font-bold text-foreground">120/80</div>
                    <div className="text-xs text-muted-foreground">BP mmHg</div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-card rounded-xl shadow-md p-3 border">
                    <div className="text-lg font-bold text-green-600">95%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>

                {/* Vital Stats Cards */}
                <div className="space-y-4">
                  <div className="bg-card border rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Blood Pressure</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">120/80</div>
                    <div className="text-xs text-muted-foreground">SYS / DIA mmHg</div>
                  </div>

                  <div className="bg-card border rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Signal Quality</span>
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex gap-2 items-baseline">
                      <span className="text-2xl font-bold">Good</span>
                      <Badge variant="secondary" className="text-xs">
                        PPG + IMU
                      </Badge>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-primary rounded-full" />
                    </div>
                  </div>

                  <div className="bg-card border rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Motion Status</span>
                      <Wifi className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">Resting</div>
                    <div className="text-xs text-muted-foreground">Low motion detected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Quick Stats */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average BP</span>
                  <span className="font-semibold">122/81</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Max BP</span>
                  <span className="font-semibold">130/85</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Min BP</span>
                  <span className="font-semibold">115/75</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Readings</span>
                  <span className="font-semibold">42</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-destructive/5 border-destructive/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">High BP Detected</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <Link href="/patient/alerts">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View All Alerts
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BP Trend Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Blood Pressure Trend</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  24h
                </Button>
                <Button variant="ghost" size="sm">
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
                <Line type="monotone" dataKey="sys" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="dia" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Systolic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-sm text-muted-foreground">Diastolic</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FixedSidebarLayout>
  )
}

