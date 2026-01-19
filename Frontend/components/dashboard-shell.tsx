"use client"

import React from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRoleNavigation, getRoleDisplayName } from "@/lib/role-navigation"
import { Button } from "@/components/ui/button"
import { Heart, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

interface DashboardShellProps {
  children: React.ReactNode
  title?: string
  description?: string
}

/**
 * Dashboard Shell Component
 * Provides consistent layout with role-aware sidebar navigation
 * Enforces UI visibility based on user role
 * 
 * RBAC: Only renders navigation items applicable to user's role
 */
export function DashboardShell({ children, title, description }: DashboardShellProps) {
  const { user, logout } = useAuth()
  const navItems = useRoleNavigation(user?.role || null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // If no user, don't render (should be caught by layout)
  if (!user) {
    return <div>Loading...</div>
  }

  const currentRole = user.role
  const roleName = getRoleDisplayName(currentRole)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out hidden md:flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link href={`/${currentRole}/dashboard`} className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">HyperWatch</h1>
                <p className="text-xs text-gray-500">{roleName}</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col pt-16">
          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
          <div>
            {title && <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>}
            {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  )
}

export default DashboardShell
