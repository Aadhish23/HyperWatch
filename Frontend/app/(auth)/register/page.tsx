"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
    await new Promise((r) => setTimeout(r, 800))
    
    toast({
      variant: "success",
      title: "Registration Successful!",
      description: "Redirecting to login page...",
    })
    
    setTimeout(() => {
      window.location.href = "/login"
    }, 1500)
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
            Register your HyperWatch device to start monitoring your blood pressure.
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
