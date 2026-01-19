/**
 * Role-aware navigation hook
 * Returns navigation items based on user's role
 */

import { UserRole } from "./auth-context"
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  UserCircle,
  Heart,
  Activity,
  Zap,
  BarChart3,
  PlusCircle,
  Brain,
  FileText,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
}

export function useRoleNavigation(role: UserRole | null): NavItem[] {
  if (!role) return []

  // Patient navigation
  if (role === "patient") {
    return [
      {
        label: "Dashboard",
        href: "/patient/dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        label: "Live Monitoring",
        href: "/patient/live",
        icon: <Zap className="w-4 h-4" />,
      },
      {
        label: "History",
        href: "/patient/history",
        icon: <Activity className="w-4 h-4" />,
      },
      {
        label: "Alerts",
        href: "/patient/alerts",
        icon: <AlertCircle className="w-4 h-4" />,
      },
      {
        label: "Calibration",
        href: "/patient/calibration",
        icon: <Heart className="w-4 h-4" />,
      },
      {
        label: "Profile",
        href: "/patient/profile",
        icon: <UserCircle className="w-4 h-4" />,
      },
    ]
  }

  // Caregiver navigation
  if (role === "caregiver") {
    return [
      {
        label: "Dashboard",
        href: "/caregiver/dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        label: "Patients",
        href: "/caregiver/patients",
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: "Add Patient",
        href: "/caregiver/add-patient",
        icon: <PlusCircle className="w-4 h-4" />,
      },
      {
        label: "Alerts",
        href: "/caregiver/alerts",
        icon: <AlertCircle className="w-4 h-4" />,
      },
      {
        label: "Profile",
        href: "/caregiver/profile",
        icon: <UserCircle className="w-4 h-4" />,
      },
    ]
  }

  // Clinician navigation
  if (role === "clinician") {
    return [
      {
        label: "Dashboard",
        href: "/clinician/dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        label: "Patients",
        href: "/clinician/patients",
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: "Add Patient",
        href: "/clinician/add-patient",
        icon: <PlusCircle className="w-4 h-4" />,
      },
      {
        label: "Alerts",
        href: "/clinician/alerts",
        icon: <AlertCircle className="w-4 h-4" />,
      },
      {
        label: "Analysis",
        href: "/clinician/analysis",
        icon: <BarChart3 className="w-4 h-4" />,
      },
      {
        label: "AI Model",
        href: "/clinician/model",
        icon: <Brain className="w-4 h-4" />,
      },
      {
        label: "Reports",
        href: "/clinician/reports",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        label: "Profile",
        href: "/clinician/profile",
        icon: <UserCircle className="w-4 h-4" />,
      },
    ]
  }

  return []
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    patient: "Patient",
    caregiver: "Family Caregiver",
    clinician: "Medical Authority",
  }
  return names[role]
}
