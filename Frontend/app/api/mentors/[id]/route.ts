import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    // Make a direct request to the backend API
    const response = await axios.get(`http://localhost:5001/api/mentors/${id}`)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching mentor:", error)
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
  }
}

