"use client"

import type React from "react"

import { useState } from "react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Loader2 } from "lucide-react"
import GoogleLoginButton from "@/components/GoogleLoginButton"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    try {
      await login(email, password, selectedRole)
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col gap-6 p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">HyperWatch</h1>
              <p className="text-sm text-muted-foreground">Continuous BP Monitoring</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold text-foreground text-balance">
              Professional Healthcare Monitoring Platform
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Advanced cuffless, IoT-based continuous blood pressure monitoring using PPG and IMU sensor fusion
              technology.
            </p>
          </div>

          <div className="mt-8 p-6 bg-card rounded-2xl border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Heart className="w-10 h-10 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Clinical-Grade Accuracy</p>
                <p className="text-sm text-muted-foreground">Real-time monitoring with ML</p>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">85% confidence score</p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="md:hidden flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">HyperWatch</CardTitle>
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection - Now at TOP */}
              <div className="space-y-2">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={selectedRole === "patient" ? "default" : "outline"}
                    className="h-20 flex flex-col gap-1"
                    onClick={() => setSelectedRole("patient")}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">Patient</span>
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === "caregiver" ? "default" : "outline"}
                    className="h-20 flex flex-col gap-1"
                    onClick={() => setSelectedRole("caregiver")}
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-xs">Caregiver</span>
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === "clinician" ? "default" : "outline"}
                    className="h-20 flex flex-col gap-1"
                    onClick={() => setSelectedRole("clinician")}
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-xs">Clinician</span>
                  </Button>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Error Message */}
              {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

              {/* Sign In Button */}
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign in with</span>
                </div>
              </div>

              {/* Google Login Button */}
              <GoogleLoginButton role={selectedRole} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
