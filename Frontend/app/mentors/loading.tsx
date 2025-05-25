import GradientSpinner from "@/components/ui/gradient-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <GradientSpinner size={64} />
    </div>
  )
}

