"use client"

import type { ReactNode } from "react"
import { useMemo, memo, useCallback } from "react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Users,
  Stethoscope,
  BarChart3,
  Bell,
  Search,
  User,
  LogOut,
  Home,
  TrendingUp,
  AlertCircle,
  Settings,
  FileText,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: ReactNode
  role: UserRole
}

const NavLink = memo(function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string
  label: string
  icon: typeof Home
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  )
})

export function DashboardShell({ children, role }: DashboardShellProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = useMemo(() => {
    const patientNav = [
      { label: "Dashboard", href: "/patient/dashboard", icon: Home },
      { label: "Live Monitoring", href: "/patient/live", icon: Activity },
      { label: "History & Trends", href: "/patient/history", icon: TrendingUp },
      { label: "Alerts", href: "/patient/alerts", icon: AlertCircle },
      { label: "Calibration", href: "/patient/calibration", icon: Zap },
      { label: "Profile & Device", href: "/patient/profile", icon: Settings },
    ]

    const caregiverNav = [
      { label: "Dashboard", href: "/caregiver/dashboard", icon: Home },
      { label: "Patients", href: "/caregiver/patients", icon: Users },
      { label: "Alerts", href: "/caregiver/alerts", icon: AlertCircle },
      { label: "Profile", href: "/caregiver/profile", icon: Settings },
    ]

    const clinicianNav = [
      { label: "Dashboard", href: "/clinician/dashboard", icon: Home },
      { label: "Patient Analysis", href: "/clinician/analysis", icon: BarChart3 },
      { label: "Reports & Export", href: "/clinician/reports", icon: FileText },
      { label: "Alerts & Risk", href: "/clinician/alerts", icon: AlertCircle },
      { label: "Model Transparency", href: "/clinician/model", icon: Stethoscope },
    ]

    return role === "patient" ? patientNav : role === "caregiver" ? caregiverNav : clinicianNav
  }, [role])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center gap-4 px-6">
          {/* Logo */}
          <Link href={`/${role}/dashboard`} className="flex items-center gap-2 font-semibold">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg">HyperWatch</span>
          </Link>

          <div className="flex-1" />

          {/* Search (caregiver & clinician only) */}
          {(role === "caregiver" || role === "clinician") && (
            <div className="hidden md:flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 min-w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients..."
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card hidden lg:block">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
