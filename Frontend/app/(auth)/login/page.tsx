"use client"

import type React from "react"
import { useState } from "react"
import { type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Activity, Heart, Loader2 } from "lucide-react"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all fields",
      })
      return
    }

    setIsLoading(true)
    try {
      // MOCK AUTH (frontend only)
      await new Promise((resolve) => setTimeout(resolve, 600))

      const mockAuthData = {
        email,
        role: selectedRole,
        isAuthenticated: true,
      }

      localStorage.setItem("mockAuth", JSON.stringify(mockAuthData))

      const redirectMap: Record<UserRole, string> = {
        patient: "/patient/dashboard",
        caregiver: "/caregiver/dashboard",
        clinician: "/clinician/dashboard",
      }

      window.location.href = redirectMap[selectedRole]
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please check your email, password, and role.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">

        {/* LEFT: Branding */}
        <div className="hidden md:flex flex-col gap-6 p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">HyperWatch</h1>
              <p className="text-sm text-muted-foreground">
                Continuous BP Monitoring
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              Professional Healthcare Monitoring Platform
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Advanced cuffless IoT-based continuous blood pressure monitoring
              using sensor fusion and ML-driven insights.
            </p>
          </div>
        </div>

        {/* RIGHT: Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="md:hidden flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">HyperWatch</CardTitle>
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in using your role to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ROLE SELECTION */}
              <div className="space-y-2">
                <Label>Sign in as</Label>
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

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* FORGOT PASSWORD (ALL ROLES) */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/forgot-password")}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* SIGN IN */}
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

              {/* REGISTER (PATIENT ONLY) */}
              {selectedRole === "patient" && (
                <div className="text-center text-sm">
                  New patient?{" "}
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/register")}
                    className="text-primary hover:underline"
                  >
                    Register your device
                  </button>
                </div>
              )}

              {/* DIVIDER */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or sign in with
                  </span>
                </div>
              </div>

              {/* GOOGLE LOGIN */}
              <GoogleLoginButton role={selectedRole} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
