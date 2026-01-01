"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle2, Clock } from "lucide-react"

export default function CalibrationPage() {
  return (
    <DashboardShell role="patient">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Device Calibration</h1>
          <p className="text-muted-foreground mt-1">Ensure accurate blood pressure readings</p>
        </div>

        {/* Calibration Status */}
        <Card className="border-0 shadow-sm bg-green-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <CardTitle>Calibration Status: Good</CardTitle>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                95% Confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Calibration</p>
                <p className="text-lg font-semibold">2 days ago</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Calibration</p>
                <p className="text-lg font-semibold">In 5 days</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Calibrations This Month</p>
                <p className="text-lg font-semibold">4 times</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calibration Process */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>How to Calibrate</CardTitle>
            <CardDescription>Follow these steps for accurate calibration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Find a Quiet Place</h3>
                  <p className="text-sm text-muted-foreground">
                    Sit comfortably in a quiet environment with minimal distractions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Rest for 5 Minutes</h3>
                  <p className="text-sm text-muted-foreground">
                    Relax and avoid movement. Keep your arm at heart level.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Start Calibration</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the button below and follow the on-screen instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Stay Still</h3>
                  <p className="text-sm text-muted-foreground">
                    Remain motionless during the 2-minute calibration process.
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg">
              <Zap className="w-5 h-5 mr-2" />
              Start Calibration
            </Button>
          </CardContent>
        </Card>

        {/* Calibration History */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Calibration History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Calibration #{5 - item}</p>
                      <p className="text-sm text-muted-foreground">{item * 3} days ago</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    Successful
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
