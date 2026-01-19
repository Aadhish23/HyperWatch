"use client"

import { useState } from "react"
import type React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, Loader2 } from "lucide-react"

type Step = "otp" | "password"

export default function OTPVerifyPage() {
  const [step, setStep] = useState<Step>("otp")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsLoading(false)
    setStep("password")
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    window.location.href = "/login"
  }

  return (
    /* ✅ FULL HEIGHT + CENTERING */
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {step === "otp" ? (
              <ShieldCheck className="text-primary" />
            ) : (
              <Lock className="text-primary" />
            )}
          </div>

          <CardTitle className="text-xl">
            {step === "otp" ? "Verify OTP" : "Reset Password"}
          </CardTitle>

          <CardDescription>
            {step === "otp"
              ? "Enter the OTP sent to your email"
              : "Create a new password for your account"}
          </CardDescription>

          {/* STEP INDICATOR */}
          <div className="flex justify-center gap-2 pt-3">
            <span
              className={`h-1 w-10 rounded-full ${
                step === "otp" ? "bg-primary" : "bg-primary/30"
              }`}
            />
            <span
              className={`h-1 w-10 rounded-full ${
                step === "password" ? "bg-primary" : "bg-primary/30"
              }`}
            />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center">
          {step === "otp" && (
            <form
              onSubmit={handleVerifyOTP}
              className="w-full max-w-xs space-y-4"
            >
              <div className="space-y-1 text-left">
                <Label>OTP</Label>
                <Input required placeholder="6-digit OTP" />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>
          )}

          {step === "password" && (
            <form
              onSubmit={handleResetPassword}
              className="w-full max-w-xs space-y-4"
            >
              <div className="space-y-1 text-left">
                <Label>New Password</Label>
                <Input type="password" required />
              </div>

              <div className="space-y-1 text-left">
                <Label>Confirm Password</Label>
                <Input type="password" required />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
