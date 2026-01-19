"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { enforceRoleAccess } from "@/lib/role-guard"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

/**
 * Patient Role Layout
 * Enforces: Only users with role "patient" can access /patient/** routes
 * Redirects unauthorized users to /login
 */
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Loading state
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600 text-sm">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Access control enforcement
  // If user is not authenticated or role doesn't match, enforceRoleAccess will redirect
  enforceRoleAccess(user?.role || null, ["patient"], "/patient")

  // Access granted - render children
  return <>{children}</>
}
