import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { mentorId: string } }) {
  const mentorId = params.mentorId

  try {
    const body = await request.json()
    const { rating, comment } = body

    // Validate input
    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 })
    }

    // In a real app, this would save to a database
    // For demo purposes, we'll just return success

    // Add artificial delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      review: {
        id: Date.now(),
        mentorId,
        rating,
        comment,
        date: new Date().toISOString(),
        user: {
          name: "Current User",
          image: "/placeholder.svg?height=40&width=40",
        },
      },
    })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

