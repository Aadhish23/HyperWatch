"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      role,
    }

    setUser(user)
    localStorage.setItem("hyperwatch_user", JSON.stringify(user))

    // Redirect based on role
    if (role === "patient") {
      router.push("/patient/dashboard")
    } else if (role === "caregiver") {
      router.push("/caregiver/dashboard")
    } else if (role === "clinician") {
      router.push("/clinician/dashboard")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("hyperwatch_user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
