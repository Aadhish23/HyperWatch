"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Clock, RefreshCcw, TrendingUp } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts"

type PatientOverview = {
  id: string
  full_name: string
  email: string
  systolic_bp?: number
  diastolic_bp?: number
  heart_rate?: number
  oxygen_saturation?: number
  temperature?: number
  last_measurement_at?: string
  is_anomaly?: boolean
}

type VitalsResponse = {
  id: string
  patient_id: string
  heart_rate?: number
  systolic_bp?: number
  diastolic_bp?: number
  oxygen_saturation?: number
  temperature?: number
  respiratory_rate?: number
  measurement_type: string
  is_anomaly: boolean
  anomaly_type?: string
  measured_at: string
  created_at: string
}

const MOCK_PATIENTS: PatientOverview[] = [
  {
    id: "mock-1",
    full_name: "Michael Chen",
    email: "michael.chen@example.com",
    systolic_bp: 136,
    diastolic_bp: 88,
    heart_rate: 78,
    oxygen_saturation: 97,
    temperature: 36.9,
    last_measurement_at: new Date().toISOString(),
    is_anomaly: true,
  },
  {
    id: "mock-2",
    full_name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    systolic_bp: 124,
    diastolic_bp: 79,
    heart_rate: 72,
    oxygen_saturation: 98,
    temperature: 36.6,
    last_measurement_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    is_anomaly: false,
  },
]

const MOCK_HISTORY: VitalsResponse[] = Array.from({ length: 12 }, (_, idx) => {
  const ts = Date.now() - idx * 60 * 60 * 1000
  return {
    id: `mock-vital-${idx}`,
    patient_id: "mock-1",
    heart_rate: 70 + (idx % 4),
    systolic_bp: 132 + (idx % 3),
    diastolic_bp: 86 + (idx % 2),
    oxygen_saturation: 97,
    temperature: 36.7,
    respiratory_rate: 16,
    measurement_type: "device",
    is_anomaly: idx === 2,
    anomaly_type: idx === 2 ? "bp_high" : undefined,
    measured_at: new Date(ts).toISOString(),
    created_at: new Date(ts).toISOString(),
  }
})

export default function AnalysisPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [patients, setPatients] = useState<PatientOverview[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [liveVitals, setLiveVitals] = useState<VitalsResponse | null>(null)
  const [history, setHistory] = useState<VitalsResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadPatients = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = MOCK_PATIENTS
      setPatients(data)

      const patientIdFromUrl = searchParams.get("patientId")
      if (patientIdFromUrl) {
        setSelectedPatientId(patientIdFromUrl)
      } else if (data.length) {
        setSelectedPatientId(data[0].id)
        router.replace(`/clinician/analysis?patientId=${data[0].id}`)
      }
    } catch (err: any) {
      setError(err.message || "Unable to load patients. Showing sample data.")
      setPatients(MOCK_PATIENTS)
      if (MOCK_PATIENTS.length) {
        setSelectedPatientId(MOCK_PATIENTS[0].id)
        router.replace(`/clinician/analysis?patientId=${MOCK_PATIENTS[0].id}`)
      }
    }
  }

  const loadVitals = async (patientId: string) => {
    try {
      setLoading(true)
      setError("")

      await new Promise((resolve) => setTimeout(resolve, 300))

      const mockHistory = MOCK_HISTORY.map((item, idx) => ({
        ...item,
        id: `${patientId}-mock-${idx}`,
        patient_id: patientId,
        measured_at: new Date(Date.now() - idx * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - idx * 60 * 60 * 1000).toISOString(),
      }))

      setLiveVitals(mockHistory[0])
      setHistory(mockHistory)
    } catch (err: any) {
      setError(err.message || "Unable to load vitals. Showing sample data.")
      setLiveVitals(MOCK_HISTORY[0])
      setHistory(MOCK_HISTORY)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const patientIdFromUrl = searchParams.get("patientId")
    if (patientIdFromUrl) {
      setSelectedPatientId(patientIdFromUrl)
      loadVitals(patientIdFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId) || null,
    [patients, selectedPatientId]
  )

  const bpTrendData = useMemo(() => {
    return history
      .filter((v) => v.systolic_bp && v.diastolic_bp)
      .map((v) => ({
        time: new Date(v.measured_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sys: v.systolic_bp,
        dia: v.diastolic_bp,
      }))
      .reverse()
  }, [history])

  const bpStats = useMemo(() => {
    const readings = history.filter((v) => v.systolic_bp && v.diastolic_bp)
    if (!readings.length) return null
    const totals = readings.reduce(
      (acc, curr) => {
        acc.sys += curr.systolic_bp || 0
        acc.dia += curr.diastolic_bp || 0
        return acc
      },
      { sys: 0, dia: 0 }
    )
    return {
      averageSys: Math.round(totals.sys / readings.length),
      averageDia: Math.round(totals.dia / readings.length),
      count: readings.length,
    }
  }, [history])

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId)
    router.push(`/clinician/analysis?patientId=${patientId}`)
  }

  const lastReadingTime = selectedPatient?.last_measurement_at || liveVitals?.measured_at

  return (
    <FixedSidebarLayout role="clinician">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patient Analysis</h1>
            <p className="text-muted-foreground mt-1">View real-time vitals and trends per patient.</p>
          </div>
          <div className="flex gap-2">
            <select
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              value={selectedPatientId || ""}
              onChange={(e) => handlePatientChange(e.target.value)}
            >
              {!selectedPatientId && <option value="">Select a patient</option>}
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={() => selectedPatientId && loadVitals(selectedPatientId)} disabled={!selectedPatientId || loading}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!selectedPatientId && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-muted-foreground">
              Select a patient from the dropdown (or Patients tab) to load their analysis.
            </CardContent>
          </Card>
        )}

        {selectedPatientId && (
          <>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Current BP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {liveVitals?.systolic_bp && liveVitals?.diastolic_bp
                      ? `${liveVitals.systolic_bp}/${liveVitals.diastolic_bp} mmHg`
                      : "—"}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{lastReadingTime ? new Date(lastReadingTime).toLocaleString() : "No recent readings"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Heart Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{liveVitals?.heart_rate ? `${liveVitals.heart_rate} bpm` : "—"}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    SpO2: {liveVitals?.oxygen_saturation ? `${liveVitals.oxygen_saturation}%` : "—"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Readings (24h)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{history.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Risk Status</CardDescription>
                </CardHeader>
                <CardContent>
                  {liveVitals?.is_anomaly || selectedPatient?.is_anomaly ? (
                    <Badge variant="destructive" className="text-base px-3 py-1">
                      Alert
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      Stable
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">Based on last reading</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Blood Pressure Trend (24h)</CardTitle>
                <CardDescription>Last 24h systolic/diastolic readings</CardDescription>
              </CardHeader>
              <CardContent>
                {bpTrendData.length ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={bpTrendData}>
                      <defs>
                        <linearGradient id="bpSys" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="bpDia" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area type="monotone" dataKey="sys" stroke="hsl(var(--destructive))" strokeWidth={3} fill="url(#bpSys)" />
                      <Area type="monotone" dataKey="dia" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#bpDia)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground">No blood pressure readings available.</p>
                )}
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Heart Rate Trend</CardTitle>
                  <CardDescription>Last 24h heart rate (bpm)</CardDescription>
                </CardHeader>
                <CardContent>
                  {history.filter((v) => v.heart_rate).length ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart
                        data={history
                          .filter((v) => v.heart_rate)
                          .map((v) => ({
                            time: new Date(v.measured_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            hr: v.heart_rate,
                          }))
                          .reverse()}
                      >
                        <XAxis dataKey="time" stroke="#888888" fontSize={12} />
                        <YAxis stroke="#888888" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="hr" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground">No heart rate readings available.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>Snapshot from latest readings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Patient</span>
                    <span className="font-semibold">{selectedPatient?.full_name || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="font-semibold text-sm">{selectedPatient?.email || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last BP</span>
                    <span className="font-semibold">
                      {liveVitals?.systolic_bp && liveVitals?.diastolic_bp
                        ? `${liveVitals.systolic_bp}/${liveVitals.diastolic_bp} mmHg`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last HR</span>
                    <span className="font-semibold">{liveVitals?.heart_rate ? `${liveVitals.heart_rate} bpm` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">SpO2</span>
                    <span className="font-semibold">{liveVitals?.oxygen_saturation ? `${liveVitals.oxygen_saturation}%` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Readings (24h)</span>
                    <span className="font-semibold">{history.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average BP</span>
                    <span className="font-semibold">
                      {bpStats ? `${bpStats.averageSys}/${bpStats.averageDia} mmHg` : "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </FixedSidebarLayout>
  )
}

