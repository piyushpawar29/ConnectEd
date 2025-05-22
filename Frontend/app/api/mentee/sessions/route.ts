import { NextResponse } from "next/server"
import axios from "axios"
import { cookies } from "next/headers"

interface Session {
  id: string
  mentorId: string
  mentorName: string
  mentorImage: string
  date: string
  duration: number
  topic: string
  status: string
}

export async function GET(request: Request) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    
    // Fallback to cookie if needed
    let token = null;
    if (!authHeader) {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get("token");
      token = tokenCookie ? tokenCookie.value : null;
      
      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    }

    // Call backend API to get sessions for the logged-in mentee
    const response = await axios.get(`${process.env.BACKEND_URL}/api/sessions`, {
      headers: authHeader ? 
        { 'Authorization': authHeader } : 
        { 'Authorization': `Bearer ${token}` }
    }).catch(error => {
      console.error("Error fetching sessions from backend:", error);
      return null;
    });

    // If we got a valid response, transform the data
    if (response?.data?.data) {
      // Format sessions for the frontend
      const sessions: Session[] = response.data.data.map((session: any) => ({
        id: session._id || session.id || '',
        mentorId: session.mentor?._id || session.mentorId || '',
        mentorName: session.mentor?.name || 'Unknown Mentor',
        mentorImage: session.mentor?.avatar || "/placeholder.svg?height=40&width=40",
        date: session.date || new Date().toISOString(),
        duration: session.duration || 60,
        topic: session.title || 'Mentoring Session',
        status: session.status || 'confirmed'
      }));

      return NextResponse.json(sessions);
    }

    // Provide mock data if API fails or returns empty data
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error in sessions API route:", error);
    // Return empty array to prevent rendering issues
    return NextResponse.json([]);
  }
} 