"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Radio, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

export default function LiveMonitoringPage() {
  const [ppgData, setPpgData] = useState<number[]>([])
  const [heartRate, setHeartRate] = useState(72)
  const [systolic, setSystolic] = useState(120)
  const [diastolic, setDiastolic] = useState(80)
  const [timestamp, setTimestamp] = useState(new Date())

  useEffect(() => {
    // Simulate live PPG waveform with more realistic cardiac cycle
    let phase = 0
    const interval = setInterval(() => {
      setPpgData((prev) => {
        // Create realistic PPG pulse waveform
        phase += 0.1
        
        // Main pulse wave (systolic peak)
        const mainPulse = Math.pow(Math.sin(phase), 3) * 35 + 35
        
        // Dicrotic notch (secondary peak)
        const dicroticNotch = Math.sin(phase * 2 + Math.PI) * 8
        
        // Add some realistic noise and drift
        const noise = (Math.random() - 0.5) * 2
        const drift = Math.sin(phase / 10) * 3
        
        const waveValue = Math.max(10, Math.min(90, mainPulse + dicroticNotch + noise + drift))
        
        const newData = [...prev, waveValue]
        return newData.slice(-100)
      })

      // Simulate slight variations in vitals
      if (Math.random() > 0.95) {
        setHeartRate(prev => Math.max(60, Math.min(90, prev + (Math.random() - 0.5) * 4)))
        setSystolic(prev => Math.max(110, Math.min(130, prev + (Math.random() - 0.5) * 3)))
        setDiastolic(prev => Math.max(70, Math.min(90, prev + (Math.random() - 0.5) * 2)))
      }

      setTimestamp(new Date())
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <FixedSidebarLayout role="patient">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Live Monitoring</h1>
            <p className="text-muted-foreground mt-1">Real-time vital signs and sensor data</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm font-medium">{timestamp.toLocaleTimeString()}</p>
          </div>
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
                <div className="text-6xl font-bold text-primary">{Math.round(systolic)}</div>
                <div className="text-4xl font-bold text-muted-foreground">/</div>
                <div className="text-6xl font-bold text-chart-2">{Math.round(diastolic)}</div>
                <div className="text-lg text-muted-foreground">mmHg</div>
              </div>
              <div className="mt-4 flex gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Systolic</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-semibold">{Math.round(systolic)}</p>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diastolic</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-semibold">{Math.round(diastolic)}</p>
                    <TrendingDown className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="text-2xl font-semibold">{Math.round(heartRate)} BPM</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  Normal Range
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Signal Quality */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Signal Quality</CardTitle>
              <CardDescription>Real-time sensor performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">PPG Signal</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Excellent
                  </Badge>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-green-500 rounded-full transition-all" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">90% quality</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">IMU Stability</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Good
                  </Badge>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-primary rounded-full transition-all" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">85% stability</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Confidence</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    High
                  </Badge>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-primary rounded-full transition-all" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">95% confidence</p>
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
                <CardDescription>Photoplethysmography signal - Real-time pulse detection</CardDescription>
              </div>
              <Radio className="w-5 h-5 text-primary animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-lg p-4 h-64 relative overflow-hidden border-2 border-primary/20">
              {/* Grid background for oscilloscope effect */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full border-t border-primary/10"
                    style={{ top: `${(i / 7) * 100}%` }}
                  />
                ))}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full border-l border-primary/10"
                    style={{ left: `${(i / 9) * 100}%` }}
                  />
                ))}
              </div>

              {/* Center reference line */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-primary/20" />
              </div>

              {/* PPG Waveform */}
              <svg 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Filled area under the waveform */}
                <polygon
                  fill="url(#waveGradient)"
                  points={
                    `0,100 ` +
                    ppgData.map((value, index) => 
                      `${(index / (ppgData.length - 1)) * 100},${100 - value}`
                    ).join(" ") +
                    ` 100,100`
                  }
                />
                
                {/* Waveform line */}
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  points={ppgData.map((value, index) => 
                    `${(index / (ppgData.length - 1)) * 100},${100 - value}`
                  ).join(" ")}
                />
              </svg>

              {/* Signal quality indicator */}
              <div className="absolute top-2 left-2 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 font-medium">Live Signal</span>
              </div>

              {/* Heart rate display */}
              <div className="absolute bottom-2 right-2 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded text-sm">
                <span className="text-green-400 font-bold">{Math.round(heartRate)} BPM</span>
              </div>

              {/* Axis labels */}
              <div className="absolute bottom-2 left-2 text-xs text-slate-400">
                Time →
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motion & Warnings */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Motion Status</CardTitle>
              <CardDescription>Current activity level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-full">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Resting</p>
                  <p className="text-sm text-muted-foreground">Low motion detected</p>
                  <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                    Optimal for readings
                  </Badge>
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
              <CardDescription className="text-yellow-700">Measurement quality check</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-900">
                No significant motion artifacts detected. Readings are accurate and reliable.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 bg-yellow-200 rounded-full overflow-hidden">
                  <div className="h-full w-[5%] bg-yellow-600 rounded-full transition-all" />
                </div>
                <span className="text-xs font-medium text-yellow-700">5%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FixedSidebarLayout>
  )
}