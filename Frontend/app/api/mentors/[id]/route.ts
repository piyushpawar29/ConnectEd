import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const getMentorById = async (id: string) => {
    try {
      const response = await axios.get(`/api/mentors/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching mentor:", error)
      return null
    }
  }

  // Get mentor data
  const mentor = getMentorById(id)

  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
  }

  return NextResponse.json(mentor)
}

