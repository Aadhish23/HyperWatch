"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function ToastDemoPage() {
  const { toast } = useToast()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl">Toast Notification Demo</CardTitle>
          <CardDescription>
            Click the buttons below to see centered popup notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              onClick={() =>
                toast({
                  variant: "destructive",
                  title: "Login Failed",
                  description: "Invalid credentials. Please check your email and password.",
                })
              }
              variant="destructive"
            >
              Show Error (Wrong Credentials)
            </Button>

            <Button
              onClick={() =>
                toast({
                  variant: "success",
                  title: "Success!",
                  description: "Your action was completed successfully.",
                })
              }
              className="bg-green-600 hover:bg-green-700"
            >
              Show Success Message
            </Button>

            <Button
              onClick={() =>
                toast({
                  variant: "destructive",
                  title: "Missing Fields",
                  description: "Please fill in all required fields.",
                })
              }
              variant="destructive"
            >
              Show Validation Error
            </Button>

            <Button
              onClick={() =>
                toast({
                  title: "Information",
                  description: "This is a default toast notification.",
                })
              }
              variant="outline"
            >
              Show Info Message
            </Button>

            <Button
              onClick={() =>
                toast({
                  variant: "destructive",
                  title: "Network Error",
                  description: "Failed to connect to the server. Please try again.",
                })
              }
              variant="destructive"
            >
              Show Network Error
            </Button>

            <Button
              onClick={() =>
                toast({
                  variant: "success",
                  title: "Profile Updated",
                  description: "Your profile has been saved successfully.",
                })
              }
              className="bg-green-600 hover:bg-green-700"
            >
              Show Update Success
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All toasts appear at the <strong>accurate center</strong> of the screen</li>
              <li>Multiple variants: Error (red), Success (green), Default</li>
              <li>Auto-dismiss with manual close option</li>
              <li>Fully accessible and responsive</li>
              <li>Perfect for login errors, form validations, and success messages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
