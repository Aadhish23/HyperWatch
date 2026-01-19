# Toast Notification Examples

This file demonstrates how to use the toast notification system throughout the application.

## Basic Usage

```tsx
import { useToast } from "@/components/ui/use-toast"

export function MyComponent() {
  const { toast } = useToast()

  const showNotification = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
    })
  }

  return <button onClick={showNotification}>Show Toast</button>
}
```

## Toast Variants

### 1. Default Toast
```tsx
toast({
  title: "Information",
  description: "This is a default toast message.",
})
```

### 2. Destructive/Error Toast (Centered Red Popup)
```tsx
toast({
  variant: "destructive",
  title: "Error!",
  description: "Wrong credentials. Please try again.",
})
```

### 3. Success Toast (Centered Green Popup)
```tsx
toast({
  variant: "success",
  title: "Success!",
  description: "Operation completed successfully.",
})
```

## Common Use Cases

### Login Errors
```tsx
toast({
  variant: "destructive",
  title: "Login Failed",
  description: "Invalid credentials. Please check your email and password.",
})
```

### Form Validation
```tsx
toast({
  variant: "destructive",
  title: "Missing Fields",
  description: "Please fill in all required fields.",
})
```

### Success Messages
```tsx
toast({
  variant: "success",
  title: "Profile Updated",
  description: "Your profile has been updated successfully.",
})
```

### API Errors
```tsx
try {
  // API call
} catch (error) {
  toast({
    variant: "destructive",
    title: "Network Error",
    description: error.message || "Failed to connect to server.",
  })
}
```

## Toast Positioning

All toasts appear **centered** on the screen using:
- Horizontal center: `left-1/2 -translate-x-1/2`
- Vertical center: `top-1/2 -translate-y-1/2`

This ensures all error messages, success notifications, and alerts appear prominently in the center of the viewport for maximum visibility.

## Features

✅ **Centered positioning** - All toasts appear at the accurate center of the screen
✅ **Auto-dismiss** - Toasts automatically dismiss after a delay
✅ **Manual close** - Users can close toasts with the X button
✅ **Multiple variants** - Destructive (red), Success (green), and Default
✅ **Accessible** - Built with Radix UI for full accessibility
✅ **Responsive** - Works on all screen sizes
