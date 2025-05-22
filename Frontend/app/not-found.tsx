import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">404 - Page Not Found</h1>
          <p className="text-gray-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" passHref>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white min-w-32">
              Go Home
            </Button>
          </Link>
          <Link href="/mentors" passHref>
            <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950 min-w-32">
              Browse Mentors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 