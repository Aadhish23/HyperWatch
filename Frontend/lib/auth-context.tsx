"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "patient" | "caregiver" | "clinician"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedMock = localStorage.getItem("mockAuth") || localStorage.getItem("hyperwatch_user")
    if (storedMock) {
      try {
        const parsed = JSON.parse(storedMock)
        const restoredUser: User = {
          id: parsed.id || "mock-user",
          email: parsed.email,
          name: parsed.name || parsed.email?.split("@")[0] || "User",
          role: parsed.role,
        }
        setUser(restoredUser)
      } catch (err) {
        console.warn("Failed to parse stored auth", err)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 400))

        const newUser: User = {
          id: `mock-${role}-${Date.now()}`,
          email,
          name: email.split("@")[0] || "User",
          role,
        }

        const mockAuthData = { ...newUser, isAuthenticated: true }
        localStorage.setItem("mockAuth", JSON.stringify(mockAuthData))
        setUser(newUser)

        const redirectMap: Record<UserRole, string> = {
          patient: "/patient/dashboard",
          caregiver: "/caregiver/dashboard",
          clinician: "/clinician/dashboard",
        }

        router.push(redirectMap[role])
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("mockAuth")
    localStorage.removeItem("hyperwatch_user")
    localStorage.removeItem("token")
    router.push("/login")
  }, [router])

  const contextValue = useMemo(
    () => ({ user, login, logout, isLoading, isAuthenticated: !!user }),
    [user, login, logout, isLoading],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
