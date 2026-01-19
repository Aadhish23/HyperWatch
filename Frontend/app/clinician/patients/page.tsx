"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertCircle, RefreshCcw, Users } from "lucide-react"

type PatientRow = {
	id: string
	full_name: string
	email: string
	phone?: string
	systolic_bp?: number
	diastolic_bp?: number
	heart_rate?: number
	oxygen_saturation?: number
	temperature?: number
	last_measurement_at?: string
	is_anomaly?: boolean
}

const MOCK_PATIENTS: PatientRow[] = [
	{
		id: "mock-1",
		full_name: "Michael Chen",
		email: "michael.chen@example.com",
		phone: "+1 555-201-1020",
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
		phone: "+1 555-334-8989",
		systolic_bp: 124,
		diastolic_bp: 79,
		heart_rate: 72,
		oxygen_saturation: 98,
		temperature: 36.6,
		last_measurement_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
		is_anomaly: false,
	},
]

export default function ClinicianPatientsPage() {
	const router = useRouter()
	const [patients, setPatients] = useState<PatientRow[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const fetchPatients = async () => {
		setLoading(true)
		setError("")

		try {
			await new Promise((resolve) => setTimeout(resolve, 300))
			setPatients(MOCK_PATIENTS)
		} catch (err: any) {
			setError(err.message || "Unable to load patients. Showing sample data.")
			setPatients(MOCK_PATIENTS)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchPatients()
	}, [])

	const handleRowClick = (id: string) => {
		router.push(`/clinician/analysis?patientId=${id}`)
	}

	const formatValue = (value?: number | string) => {
		if (value === null || value === undefined || value === "") return "—"
		return value
	}

	const formatDate = (value?: string) => {
		if (!value) return "No readings yet"
		const date = new Date(value)
		if (Number.isNaN(date.getTime())) return "No readings yet"
		return date.toLocaleString()
	}

	return (
		<FixedSidebarLayout role="clinician">
			<div className="p-6 space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<Users className="h-4 w-4" />
							<span>Assigned Patients</span>
						</div>
						<h1 className="text-3xl font-bold">Patients</h1>
						<p className="text-muted-foreground">Select a patient to view their analysis</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={fetchPatients} disabled={loading}>
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

				<Card className="border-0 shadow-sm">
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead>
								<tr className="text-left text-muted-foreground border-b">
									<th className="px-4 py-3 font-medium">Name</th>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Phone</th>
									<th className="px-4 py-3 font-medium">Last BP</th>
									  <th className="px-4 py-3 font-medium">HR / SpO2</th>
									<th className="px-4 py-3 font-medium">Last Reading</th>
									<th className="px-4 py-3 font-medium">Status</th>
								</tr>
							</thead>
							<tbody>
								{loading && (
									<tr>
										<td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
											Loading patients...
										</td>
									</tr>
								)}

								{!loading && patients.length === 0 && (
									<tr>
										<td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
											No patients assigned yet.
										</td>
									</tr>
								)}

								{!loading &&
									patients.map((patient) => (
										<tr
											key={patient.id}
											className="border-b last:border-b-0 hover:bg-accent/50 cursor-pointer"
											onClick={() => handleRowClick(patient.id)}
										>
											<td className="px-4 py-3 font-semibold text-foreground">{patient.full_name}</td>
											<td className="px-4 py-3 text-muted-foreground">{patient.email}</td>
											<td className="px-4 py-3 text-muted-foreground">{formatValue(patient.phone)}</td>
											<td className="px-4 py-3">
												{patient.systolic_bp && patient.diastolic_bp
													? `${patient.systolic_bp}/${patient.diastolic_bp} mmHg`
													: "—"}
											</td>
											<td className="px-4 py-3">
												{patient.heart_rate ? `${patient.heart_rate} bpm` : "—"}
												{patient.oxygen_saturation ? ` • ${patient.oxygen_saturation}%` : ""}
											</td>
											<td className="px-4 py-3 text-muted-foreground">{formatDate(patient.last_measurement_at)}</td>
											<td className="px-4 py-3">
												{patient.is_anomaly ? (
													<Badge variant="destructive" className="text-xs">
														Alert
													</Badge>
												) : (
													<Badge variant="secondary" className="text-xs">
														Stable
													</Badge>
												)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</Card>
			</div>
		</FixedSidebarLayout>
	)
}
