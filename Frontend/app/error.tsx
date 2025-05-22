"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Something went wrong</h1>
          <p className="text-gray-400">
            Sorry, we encountered an unexpected error while processing your request.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()} 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white min-w-32"
          >
            Try again
          </Button>
          <Link href="/" passHref>
            <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 min-w-32">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 