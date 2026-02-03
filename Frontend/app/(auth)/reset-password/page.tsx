"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Link",
        description: "No reset token found. Please request a new password reset link.",
      })
    }
  }, [searchParams, toast])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast({
        variant: "destructive",
        title: "Invalid Token",
        description: "Reset token is missing. Please request a new password reset link.",
      })
      return
    }

    if (!newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Required",
        description: "Please enter your new password",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password?token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResetSuccess(true)
        toast({
          title: "Password Reset Successfully!",
          description: "You can now login with your new password.",
        })
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: data.detail || "Failed to reset password. The link may have expired.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Unable to connect to the server. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-green-500 w-10 h-10" />
              <CardTitle className="text-2xl">Password Reset Successful!</CardTitle>
            </div>
            <CardDescription>
              Your password has been reset successfully.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                ✅ You can now login with your new password.
              </p>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Redirecting to login page...
            </p>

            <Link href="/login" className="block">
              <Button className="w-full">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-destructive w-10 h-10" />
              <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
            </div>
            <CardDescription>
              The password reset link is invalid or missing.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                ❌ This link appears to be invalid or incomplete.
              </p>
            </div>

            <Link href="/forgot-password" className="block">
              <Button className="w-full">
                Request New Reset Link
              </Button>
            </Link>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Lock className="text-primary" />
            <CardTitle className="text-2xl">Reset Password</CardTitle>
          </div>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input 
                type="password" 
                required 
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input 
                type="password" 
                required 
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>

            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full">
                Back to Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
