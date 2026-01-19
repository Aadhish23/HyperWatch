"use client"

import { useState } from "react"
import { FixedSidebarLayout } from "@/components/fixed-sidebar-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react"

export default function AddPatientPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [tempPassword, setTempPassword] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    age: "",
    gender: "",
    phone: "",
    blood_type: "",
    allergies: "",
    medications: "",
    medical_conditions: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setTempPassword("")

    try {
        await new Promise((resolve) => setTimeout(resolve, 400))

        const generatedPassword = `Temp-${Math.random().toString(36).slice(2, 8)}`
        setTempPassword(generatedPassword)
        setSuccess("Patient created successfully (mock)")

        setFormData({
          email: "",
          full_name: "",
          age: "",
          gender: "",
          phone: "",
          blood_type: "",
          allergies: "",
          medications: "",
          medical_conditions: "",
          emergency_contact_name: "",
          emergency_contact_phone: "",
          emergency_contact_relationship: "",
        })
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the patient")
    } finally {
      setLoading(false)
    }
  }

  return (
    <FixedSidebarLayout role="clinician">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Add New Patient</h1>
              <p className="text-muted-foreground">Register a new patient in the system</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{success}</p>
              {tempPassword && (
                <p className="text-green-700 mt-2">
                  <strong>Temporary Password:</strong> <code className="bg-green-100 px-2 py-1 rounded">{tempPassword}</code>
                  <br />
                  <span className="text-sm">Please share this with the patient securely.</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6">
            {/* Basic Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="patient@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="55"
                    min="0"
                    max="150"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label htmlFor="blood_type">Blood Type</Label>
                  <select
                    id="blood_type"
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="Penicillin, Peanuts"
                  />
                </div>
                <div>
                  <Label htmlFor="medications">Current Medications (comma-separated)</Label>
                  <Input
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    placeholder="Aspirin, Lisinopril"
                  />
                </div>
                <div>
                  <Label htmlFor="medical_conditions">Medical Conditions (comma-separated)</Label>
                  <Input
                    id="medical_conditions"
                    name="medical_conditions"
                    value={formData.medical_conditions}
                    onChange={handleInputChange}
                    placeholder="Hypertension, Diabetes"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8901"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                  <Input
                    id="emergency_contact_relationship"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleInputChange}
                    placeholder="Spouse, Sibling, Parent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Patient"}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </FixedSidebarLayout>
  )
}

