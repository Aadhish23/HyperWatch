/**
 * Role-based access control utilities for HyperWatch frontend
 * Enforces strict role-based routing and access control
 */

import { UserRole } from "./auth-context"
import { redirect } from "next/navigation"

/**
 * Allowed routes per role
 * Frontend enforces these - backend also validates
 */
export const roleRoutes: Record<UserRole, string[]> = {
  patient: [
    "/patient/dashboard",
    "/patient/alerts",
    "/patient/live",
    "/patient/history",
    "/patient/calibration",
    "/patient/profile",
  ],
  caregiver: [
    "/caregiver/dashboard",
    "/caregiver/patients",
    "/caregiver/alerts",
    "/caregiver/add-patient",
    "/caregiver/profile",
  ],
  clinician: [
    "/clinician/dashboard",
    "/clinician/patients",
    "/clinician/alerts",
    "/clinician/analysis",
    "/clinician/reports",
    "/clinician/model",
    "/clinician/add-patient",
  ],
}

/**
 * Check if user role can access a specific route
 * @param role - User's role
 * @param pathname - Current pathname
 * @returns true if role can access this route
 */
export function canAccessRoute(role: UserRole | null, pathname: string): boolean {
  if (!role) return false

  const allowedRoutes = roleRoutes[role]
  return allowedRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Get the dashboard route for a given role
 * @param role - User's role
 * @returns Dashboard URL for that role
 */
export function getDashboardRoute(role: UserRole): string {
  const dashboards: Record<UserRole, string> = {
    patient: "/patient/dashboard",
    caregiver: "/caregiver/dashboard",
    clinician: "/clinician/dashboard",
  }
  return dashboards[role]
}

/**
 * Protected route guard - use in layouts
 * Redirects if user is not authenticated or role doesn't match
 * @param userRole - User's authenticated role
 * @param allowedRoles - Roles that can access this route
 * @param currentPath - Current route path (for logging)
 */
export function enforceRoleAccess(
  userRole: UserRole | null,
  allowedRoles: UserRole[],
  currentPath?: string
): void {
  // Not authenticated
  if (!userRole) {
    console.warn(`[RBAC] Unauthenticated access attempt to ${currentPath}`)
    redirect("/login")
  }

  // Role not allowed
  if (!allowedRoles.includes(userRole)) {
    console.warn(`[RBAC] Role '${userRole}' denied access to ${currentPath}`)
    redirect("/login")
  }

  // Access granted
  console.log(`[RBAC] Role '${userRole}' granted access to ${currentPath}`)
}
