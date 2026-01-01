"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import { ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts"

const weeklyData = [
  { day: "Mon", avg: 120, min: 115, max: 125 },
  { day: "Tue", avg: 122, min: 118, max: 128 },
  { day: "Wed", avg: 119, min: 114, max: 124 },
  { day: "Thu", avg: 121, min: 116, max: 127 },
  { day: "Fri", avg: 123, min: 119, max: 129 },
  { day: "Sat", avg: 118, min: 113, max: 123 },
  { day: "Sun", avg: 120, min: 115, max: 125 },
]

export default function HistoryPage() {
  return (
    <DashboardShell role="patient">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">History & Trends</h1>
            <p className="text-muted-foreground mt-1">Track your blood pressure over time</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Daily</Button>
            <Button variant="default">Weekly</Button>
            <Button variant="outline">Monthly</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Average BP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120/80</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingDown className="w-4 h-4" />
                <span>2% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Maximum BP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">135/90</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <span>Recorded on Friday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Minimum BP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">110/70</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <span>Recorded on Wednesday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Total Readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">289</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>12% more active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Blood Pressure Trend</CardTitle>
            <CardDescription>Average, minimum, and maximum readings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} domain={[100, 140]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="max"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={1}
                  fill="none"
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="avg"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#colorAvg)"
                />
                <Area
                  type="monotone"
                  dataKey="min"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={1}
                  fill="none"
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Maximum</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-sm text-muted-foreground">Minimum</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-0 shadow-sm bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p className="text-sm">Your blood pressure has been stable this week with an average of 120/80 mmHg.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p className="text-sm">Morning readings tend to be slightly higher. Consider relaxation techniques.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p className="text-sm">You've been consistently active with regular monitoring. Great job!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
