"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Brain, Database, Zap } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const featureImportance = [
  { feature: "PPG Amplitude", importance: 95 },
  { feature: "Heart Rate", importance: 88 },
  { feature: "IMU Stability", importance: 82 },
  { feature: "Signal Quality", importance: 78 },
  { feature: "Motion Level", importance: 65 },
  { feature: "Time of Day", importance: 52 },
]

export default function ModelTransparencyPage() {
  return (
    <DashboardShell role="clinician">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Model Transparency</h1>
          <p className="text-muted-foreground mt-1">Understanding the AI-powered BP prediction system</p>
        </div>

        {/* Model Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <CardDescription>Model Version</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">v2.4.1</div>
              <p className="text-sm text-muted-foreground mt-1">Latest stable</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <CardDescription>Overall Accuracy</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-sm text-green-600 mt-1">Clinical grade</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <CardDescription>Training Data</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125K</div>
              <p className="text-sm text-muted-foreground mt-1">Patient readings</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardDescription>Inference Time</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42ms</div>
              <p className="text-sm text-muted-foreground mt-1">Real-time capable</p>
            </CardContent>
          </Card>
        </div>

        {/* Model Architecture */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Model Architecture</CardTitle>
            <CardDescription>Neural network structure and methodology</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Sensor Fusion Layer</h3>
                  <p className="text-sm text-muted-foreground">
                    Combines PPG and IMU data using convolutional neural networks
                  </p>
                </div>
                <Badge variant="secondary">CNN</Badge>
              </div>

              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Feature Extraction</h3>
                  <p className="text-sm text-muted-foreground">
                    Extracts temporal and frequency domain features from raw signals
                  </p>
                </div>
                <Badge variant="secondary">LSTM</Badge>
              </div>

              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">BP Regression</h3>
                  <p className="text-sm text-muted-foreground">Predicts systolic and diastolic blood pressure values</p>
                </div>
                <Badge variant="secondary">Dense NN</Badge>
              </div>

              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Confidence Estimation</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimates prediction reliability based on signal quality
                  </p>
                </div>
                <Badge variant="secondary">Bayesian</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Feature Importance */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>Key factors in BP prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureImportance} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} stroke="#888888" fontSize={12} />
                  <YAxis type="category" dataKey="feature" stroke="#888888" fontSize={12} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Model validation results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Mean Absolute Error (MAE)</span>
                  <span className="font-semibold">3.2 mmHg</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-green-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Root Mean Square Error (RMSE)</span>
                  <span className="font-semibold">4.8 mmHg</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-green-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">R² Score</span>
                  <span className="font-semibold">0.91</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[91%] bg-green-500 rounded-full" />
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Clinical Validation:</span> Model meets FDA accuracy
                  standards for non-invasive BP monitoring devices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calibration History */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Calibration Methodology</CardTitle>
            <CardDescription>Per-patient model calibration process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm">
                  Initial calibration requires 5 minutes of resting data to establish patient baseline.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm">Recalibration recommended every 7 days to account for physiological changes.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm">
                  Transfer learning adapts the base model to individual patient characteristics.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm">Confidence scores reflect signal quality and calibration freshness.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
