"use client"

import type { ComponentType, ReactNode } from "react"
import { useMemo, memo, useState } from "react"
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
  UserPlus,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface FixedSidebarLayoutProps {
  children: ReactNode
  role: UserRole
}

const PrimaryNavLink = memo(function PrimaryNavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string
  label: string
  icon: ComponentType<any>
  isActive: boolean
  onClick?: () => void
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
      onClick={onClick}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate text-left">{label}</span>
    </Link>
  )
})

const SecondaryNavLink = memo(function SecondaryNavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string
  label: string
  icon: ComponentType<any>
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-primary/5 text-primary border-primary/40 hover:bg-primary/10",
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
      <span className="truncate text-left">{label}</span>
    </Link>
  )
})

export function FixedSidebarLayout({ children, role }: FixedSidebarLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navConfig = useMemo(
    () => ({
      patient: {
        primary: [
          { label: "Dashboard", href: "/patient/dashboard", icon: Home },
          { label: "Live Monitoring", href: "/patient/live", icon: Activity },
          { label: "History & Trends", href: "/patient/history", icon: TrendingUp },
          { label: "Alerts", href: "/patient/alerts", icon: AlertCircle },
          { label: "Calibration", href: "/patient/calibration", icon: Zap },
          { label: "Profile & Device", href: "/patient/profile", icon: Settings },
        ],
        secondary: [],
      },
      caregiver: {
        primary: [
          { label: "Dashboard", href: "/caregiver/dashboard", icon: Home },
          { label: "Patients", href: "/caregiver/patients", icon: Users },
          { label: "Alerts", href: "/caregiver/alerts", icon: AlertCircle },
          { label: "Profile", href: "/caregiver/profile", icon: Settings },
        ],
        secondary: [{ label: "Add Patient", href: "/caregiver/add-patient", icon: UserPlus }],
      },
      clinician: {
        primary: [
          { label: "Dashboard", href: "/clinician/dashboard", icon: Home },
          { label: "Patients", href: "/clinician/patients", icon: Users },
          { label: "Analytics", href: "/clinician/analysis", icon: BarChart3 },
          { label: "Reports & Export", href: "/clinician/reports", icon: FileText },
          { label: "Alerts & Risk", href: "/clinician/alerts", icon: AlertCircle },
          { label: "Model Transparency", href: "/clinician/model", icon: Stethoscope },
        ],
        secondary: [{ label: "Add Patient", href: "/clinician/add-patient", icon: UserPlus }],
      },
    }),
    [],
  ) satisfies Record<UserRole, { primary: { label: string; href: string; icon: ComponentType<any> }[]; secondary: { label: string; href: string; icon: ComponentType<any> }[] }>

  const navItems = role === "patient" ? navConfig.patient : role === "caregiver" ? navConfig.caregiver : navConfig.clinician

  const activePrimaryPath = useMemo(() => {
  return navItems.primary.find((item) => {
    // Dashboard special handling
    if (item.href.endsWith("/dashboard")) {
      return pathname === `/${role}` || pathname === item.href
    }

    return pathname.startsWith(item.href)
  })?.href
}, [pathname, navItems.primary, role])


  const activeSecondaryPath = useMemo(
    () => navItems.secondary.find((item) => pathname.startsWith(item.href))?.href,
    [pathname, navItems.secondary],
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div
            className="relative h-full w-[260px] bg-card border-r shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b px-4 py-4 flex items-center justify-between">
              <Link href={`/${role}/dashboard`} className="flex items-center gap-2 font-semibold" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg">HyperWatch</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-1">
                {navItems.primary.map((item) => (
                  <PrimaryNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={item.href === activePrimaryPath}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              {navItems.secondary.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-border/60">
                  {navItems.secondary.map((item) => (
                    <SecondaryNavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      isActive={item.href === activeSecondaryPath}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              )}
            </nav>

            <div className="border-t p-4 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { logout(); setMobileOpen(false) }} title="Logout">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[260px] border-r bg-card flex-col">
        <div className="border-b px-6 py-4">
          <Link href={`/${role}/dashboard`} className="flex items-center gap-2 font-semibold">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg">HyperWatch</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            {navItems.primary.map((item) => (
              <PrimaryNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={item.href === activePrimaryPath}
              />
            ))}
          </div>

          {navItems.secondary.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/60">
              {navItems.secondary.map((item) => (
                <SecondaryNavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={item.href === activeSecondaryPath}
                />
              ))}
            </div>
          )}
        </nav>

        <div className="border-t p-4 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-[260px] h-screen">
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>

            <Link
              href={`/${role}/dashboard`}
              className="flex items-center gap-2 font-semibold lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-base">HyperWatch</span>
            </Link>

            <div className="flex-1" />

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

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
