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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("hyperwatch_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Login failed")
      }

      const data = await response.json()

      const newUser: User = {
        id: data.user_id,
        email: data.email,
        name: data.full_name || email.split("@")[0],
        role: data.role,
      }

      setUser(newUser)
      localStorage.setItem("hyperwatch_user", JSON.stringify(newUser))
      localStorage.setItem("token", data.access_token)

      // Redirect based on role
      if (data.role === "patient") {
        router.push("/patient/dashboard")
      } else if (data.role === "caregiver") {
        router.push("/caregiver/dashboard")
      } else if (data.role === "clinician") {
        router.push("/clinician/dashboard")
      }
    } catch (error) {
      throw error
    }
  }, [router])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("hyperwatch_user")
    localStorage.removeItem("token")
    router.push("/login")
  }, [router])

  const contextValue = useMemo(
    () => ({ user, login, logout, isLoading }),
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
