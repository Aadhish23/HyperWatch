"use client"

import { Activity } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="mx-auto max-w-7xl min-h-screen grid grid-cols-1 md:grid-cols-2">

        {/* ================= LEFT SIDE (FIXED & IDENTICAL) ================= */}
        <div className="hidden md:flex flex-col justify-center px-16">
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

          <div className="mt-12 space-y-4 max-w-md">
            <h2 className="text-2xl font-semibold">
              Professional Healthcare Monitoring Platform
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Advanced cuffless IoT-based continuous blood pressure monitoring
              using sensor fusion and ML-driven insights.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE (ALL AUTH FLOWS) ================= */}
        <div className="flex items-center justify-center px-4">
          {children}
        </div>

      </div>
    </div>
  )
}
