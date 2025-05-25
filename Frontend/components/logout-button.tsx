"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null
  size?: "default" | "sm" | "lg" | "icon" | null
  showIcon?: boolean
  className?: string
}

export default function LogoutButton({ 
  variant = "ghost", 
  size = "default", 
  showIcon = true,
  className = ""
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Get token from localStorage
      let token = null
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token')
      }
      
      // Call the logout API with proper authorization header
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      
      if (!response.ok) {
        throw new Error('Logout failed')
      }
      
      // Clear all auth-related items from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userRole')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      
      // Redirect to home page
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        title: "Error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
      {showIcon && <LogOut className="ml-2 h-4 w-4" />}
    </Button>
  )
}
