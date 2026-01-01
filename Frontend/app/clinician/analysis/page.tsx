"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const longTermData = [
  { month: "Jan", sys: 125, dia: 82, confidence: 92 },
  { month: "Feb", sys: 128, dia: 84, confidence: 94 },
  { month: "Mar", sys: 132, dia: 87, confidence: 91 },
  { month: "Apr", sys: 138, dia: 90, confidence: 93 },
  { month: "May", sys: 142, dia: 93, confidence: 95 },
  { month: "Jun", sys: 145, dia: 95, confidence: 94 },
]

const ppgData = Array.from({ length: 100 }, (_, i) => ({
  x: i,
  value: Math.sin(i * 0.2) * 30 + 50 + Math.random() * 10,
}))

const motionData = [
  { hour: "00:00", rest: 45, active: 5 },
  { hour: "04:00", rest: 48, active: 2 },
  { hour: "08:00", rest: 35, active: 15 },
  { hour: "12:00", rest: 30, active: 20 },
  { hour: "16:00", rest: 32, active: 18 },
  { hour: "20:00", rest: 40, active: 10 },
]

export default function AnalysisPage() {
  return (
    <DashboardShell role="clinician">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patient Analysis</h1>
            <p className="text-muted-foreground mt-1">Comprehensive data visualization and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Michael Chen</Button>
            <Button variant="outline">6 Months</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Average BP (6mo)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">135/88</div>
              <div className="flex items-center gap-1 text-sm text-destructive mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+8% increase</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Confidence Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93%</div>
              <p className="text-sm text-green-600 mt-1">Excellent reliability</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Readings/Day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-sm text-muted-foreground mt-1">Average frequency</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Risk Assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="destructive" className="text-base px-3 py-1">
                High Risk
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Stage 2 Hypertension</p>
            </CardContent>
          </Card>
        </div>

        {/* Long-term BP Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Long-term Blood Pressure Trend</CardTitle>
            <CardDescription>6-month systolic and diastolic progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={longTermData}>
                <defs>
                  <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sys"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={3}
                  fill="url(#colorSys)"
                />
                <Area
                  type="monotone"
                  dataKey="dia"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#colorDia)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Systolic BP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Diastolic BP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Raw PPG Waveform */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>PPG Waveform Visualization</CardTitle>
              <CardDescription>Raw photoplethysmography signal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ppgData}>
                  <XAxis hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Signal quality: <span className="font-semibold text-foreground">Excellent</span> • Clean waveform with
                  minimal artifacts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Score Trend */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>ML Confidence Score Trend</CardTitle>
              <CardDescription>Model prediction reliability over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={longTermData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis domain={[85, 100]} stroke="#888888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="confidence" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-muted-foreground">
                  Average confidence: <span className="font-semibold text-foreground">93.2%</span> • Consistently high
                  accuracy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rest vs Movement Comparison */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Rest vs Movement Analysis</CardTitle>
            <CardDescription>Reading distribution by activity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={motionData}>
                <XAxis dataKey="hour" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="rest" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Resting Readings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-3" />
                <span className="text-sm text-muted-foreground">Active Readings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinical Notes */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Clinical Notes & Observations</CardTitle>
              <Button>Add Note</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Dr. Johnson</span>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Patient showing progressive BP elevation over past 3 months. Recommend medication adjustment and
                  lifestyle counseling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
