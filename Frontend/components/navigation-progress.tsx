"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    
    // Start the loading animation
    const startLoading = () => {
      setIsNavigating(true)
      setProgress(0)
      
      // Simulate progress
      timer = setInterval(() => {
        setProgress((prev) => {
          // Move faster at the beginning, slower as it approaches 90%
          const increment = prev < 30 ? 15 : prev < 60 ? 8 : prev < 80 ? 3 : 1
          const nextProgress = Math.min(prev + increment, 90)
          return nextProgress
        })
      }, 100)
    }

    // Complete the loading animation
    const completeLoading = () => {
      clearInterval(timer)
      setProgress(100)
      
      // After reaching 100%, hide the progress bar
      const completeTimer = setTimeout(() => {
        setIsNavigating(false)
        setProgress(0)
      }, 500)
      
      return () => clearTimeout(completeTimer)
    }

    // Start loading
    startLoading()
    
    // Complete loading when navigation is done
    return () => {
      clearInterval(timer)
      completeLoading()
    }
  }, [pathname, searchParams])

  if (!isNavigating && progress === 0) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <Progress 
        value={progress} 
        className="h-1 w-full rounded-none bg-transparent"
      />
    </div>
  )
}
