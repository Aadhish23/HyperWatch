"use client"

import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, TrendingUp, User } from "lucide-react"

const criticalAlerts = [
  {
    id: 1,
    patient: "Michael Chen",
    age: 62,
    type: "Chronic Hypertension",
    severity: "Critical",
    description: "Sustained high BP readings above 140/90 for 2+ weeks",
    timestamp: "Ongoing",
    mlConfidence: 96,
  },
  {
    id: 2,
    patient: "David Thompson",
    age: 68,
    type: "Acute BP Spike",
    severity: "Critical",
    description: "Sudden BP increase to 165/105 mmHg",
    timestamp: "1 hour ago",
    mlConfidence: 94,
  },
]

const mlAlerts = [
  {
    id: 1,
    patient: "Robert Williams",
    age: 58,
    pattern: "Nocturnal Hypertension",
    description: "ML model detected abnormal nighttime BP elevation pattern",
    confidence: 89,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    patient: "Lisa Anderson",
    age: 51,
    pattern: "White Coat Effect",
    description: "Possible anxiety-induced BP readings detected",
    confidence: 82,
    timestamp: "5 hours ago",
  },
]

export default function ClinicianAlertsPage() {
  return (
    <FixedSidebarLayout role="clinician">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Risk Assessment</h1>
          <p className="text-muted-foreground mt-1">AI-powered anomaly detection and clinical alerts</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <CardDescription>Critical Alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">2</div>
              <p className="text-sm text-muted-foreground mt-1">Require immediate action</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardDescription>ML Anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700">2</div>
              <p className="text-sm text-muted-foreground mt-1">Pattern detected</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>High Risk Patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <p className="text-sm text-muted-foreground mt-1">Active monitoring</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>Avg Response Time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12 min</div>
              <p className="text-sm text-green-600 mt-1">Within SLA</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Critical Alerts</CardTitle>
                <CardDescription>Immediate attention required</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Mark All as Reviewed
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-destructive/5 rounded-lg border-l-4 border-l-destructive">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{alert.type}</h3>
                        <Badge variant="destructive">{alert.severity}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{alert.patient}</span>
                        <span className="text-sm text-muted-foreground">• {alert.age} years</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{alert.timestamp}</span>
                          <span className="text-muted-foreground">ML Confidence: {alert.mlConfidence}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">Acknowledge</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ML-Flagged Anomalies */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>ML-Flagged Anomalies</CardTitle>
            <CardDescription>AI-detected patterns requiring clinical review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mlAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-600">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{alert.pattern}</h3>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                          ML Detected
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{alert.patient}</span>
                        <span className="text-sm text-muted-foreground">• {alert.age} years</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{alert.timestamp}</span>
                          <span className="text-muted-foreground">Confidence: {alert.confidence}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Review Pattern
                          </Button>
                          <Button size="sm" variant="outline">
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment Summary */}
        <Card className="border-0 shadow-sm bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Clinical Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p className="text-sm">
                Consider medication adjustment for Michael Chen given sustained hypertension pattern.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p className="text-sm">
                Schedule follow-up consultation for David Thompson within 48 hours due to acute BP spike.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p className="text-sm">
                Review nocturnal BP patterns for Robert Williams - may indicate cardiovascular risk.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </FixedSidebarLayout>
  )
}

