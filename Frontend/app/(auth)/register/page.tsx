"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    deviceId: "",
    password: "",
    confirmPassword: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.deviceId || !formData.password || !formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all fields",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Call the backend registration API
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
          role: 'patient',
          phone: formData.deviceId, // Using deviceId as phone for now
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400 && data.detail === "Email already registered") {
          toast({
            variant: "destructive",
            title: "Email Already Exists",
            description: "This email is already registered. Please use a different email or login.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: data.detail || "An error occurred during registration. Please try again.",
          })
        }
        return
      }

      // Store the token and user info
      localStorage.setItem('hemosense_token', data.access_token)
      localStorage.setItem('hemosense_user', JSON.stringify({
        user_id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
      }))

      toast({
        title: "Registration Successful!",
        description: "Redirecting to your dashboard...",
      })
      
      setTimeout(() => {
        router.push('/patient/dashboard')
      }, 1500)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: error.message || "Unable to connect to the server. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Patient Registration</CardTitle>
          </div>
          <CardDescription>
            Register your HemoSense AI device to start monitoring your blood pressure.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                required 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email" 
                required 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Device ID</Label>
              <Input 
                required 
                placeholder="HW-DEVICE-XXXX" 
                value={formData.deviceId}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input 
                type="password" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register & Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
