"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, FileText, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  return (
    <DashboardShell role="clinician">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Export</h1>
          <p className="text-muted-foreground mt-1">Generate and download patient reports</p>
        </div>

        {/* Report Generator */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Select parameters and export patient data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Patient</Label>
                  <Select defaultValue="patient1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient1">Michael Chen</SelectItem>
                      <SelectItem value="patient2">Sarah Johnson</SelectItem>
                      <SelectItem value="patient3">Emma Rodriguez</SelectItem>
                      <SelectItem value="all">All Patients</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Select defaultValue="1month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1week">Last 7 Days</SelectItem>
                      <SelectItem value="1month">Last Month</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="comprehensive">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                      <SelectItem value="summary">Summary Report</SelectItem>
                      <SelectItem value="trend">Trend Analysis</SelectItem>
                      <SelectItem value="alerts">Alerts Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-secondary/30 rounded-lg border-2 border-dashed">
                  <div className="text-center space-y-3">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold">Report Preview</h3>
                      <p className="text-sm text-muted-foreground mt-1">Comprehensive Report for Michael Chen</p>
                      <p className="text-sm text-muted-foreground">Time Period: Last Month</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Generate & Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>Key metrics for selected report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Readings</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Average BP</p>
                <p className="text-2xl font-bold">138/90</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Alert Count</p>
                <p className="text-2xl font-bold">37</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Compliance</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Exports */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Comprehensive Report - Michael Chen</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item} days ago</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
