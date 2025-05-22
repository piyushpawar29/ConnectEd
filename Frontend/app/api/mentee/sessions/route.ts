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
  description: string
  status: string
  communicationType: string
}

export async function GET(request: Request) {
  try {
    console.log('Fetching mentee sessions');
    
    // Get authorization header from request
    let authHeader = request.headers.get('authorization');
    
    // Fallback to cookie if needed
    if (!authHeader) {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get("token");
      const token = tokenCookie ? tokenCookie.value : null;
      
      if (token) {
        authHeader = `Bearer ${token}`;
        console.log('Using token from cookie');
      }
    }

    // For testing purposes, we'll continue even without authentication
    // In production, you would want to require authentication
    
    // Call backend API to get sessions for the logged-in mentee
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    try {
      console.log(`Calling backend API: ${backendUrl}/api/sessions`);
      
      const response = await axios.get(
        `${backendUrl}/api/sessions`,
        { headers: authHeader ? { Authorization: authHeader } : {} }
      );
      
      console.log('Mentee sessions fetched successfully');
      
      // Extract the data from the response
      const responseData = response.data;
      const sessions = responseData.data || [];
      
      // Format sessions for the frontend
      const formattedSessions: Session[] = sessions.map((session: any) => ({
        id: session._id || session.id || '',
        mentorId: session.mentor?._id || session.mentor || '',
        mentorName: session.mentor?.name || 'Unknown Mentor',
        mentorImage: session.mentor?.avatar || "/placeholder.svg",
        date: session.date || new Date().toISOString(),
        duration: session.duration || 60,
        topic: session.title || 'Mentoring Session',
        description: session.description || '',
        status: session.status || 'scheduled',
        communicationType: session.communicationType || 'Video Call'
      }));

      return NextResponse.json(formattedSessions);
    } catch (apiError: any) {
      console.error('Backend API error:', apiError.response?.data || apiError.message);
      
      // For testing, return mock data if backend is not available
      // const mockSessions: Session[] = [
      //   {
      //     id: "s1",
      //     mentorId: "mentor1",
      //     mentorName: "Dr. Sarah Johnson",
      //     mentorImage: "/placeholder.svg",
      //     date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      //     duration: 60,
      //     topic: "Introduction to Machine Learning",
      //     description: "Basic concepts and applications of ML",
      //     status: "scheduled",
      //     communicationType: "Video Call"
      //   },
      //   {
      //     id: "s2",
      //     mentorId: "mentor2",
      //     mentorName: "Prof. Michael Chen",
      //     mentorImage: "/placeholder.svg",
      //     date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      //     duration: 45,
      //     topic: "Career Guidance in Tech",
      //     description: "Discussion about career paths in technology",
      //     status: "scheduled",
      //     communicationType: "Chat"
      //   }
      // ];
      
      // console.log('Returning mock mentee sessions for testing');
      // return NextResponse.json(mockSessions);
    }
  } catch (error) {
    console.error("Error in mentee sessions API route:", error);
    // Return empty array to prevent rendering issues
    return NextResponse.json([]);
  }
} 