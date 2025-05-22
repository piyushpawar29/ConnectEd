import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    // Get the authorization header from the request
    let authHeader = request.headers.get('authorization');
    
    // If no auth header, try to get token from cookies
    if (!authHeader) {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get("token");
      const token = tokenCookie ? tokenCookie.value : null;
      
      if (token) {
        authHeader = `Bearer ${token}`;
      }
    }
    
    // For testing purposes, we'll continue even without authentication
    // In production, you would want to require authentication
    console.log('Fetching mentor sessions');
    
    // Call the backend API to get sessions
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    try {
      // Make a direct request to the backend
      const response = await axios.get(
        `${backendUrl}/api/sessions`,
        { headers: authHeader ? { Authorization: authHeader } : {} }
      );
      
      console.log('Mentor sessions fetched successfully');
      
      // Extract the data from the response
      const responseData = response.data;
      const sessions = responseData.data || [];
      
      // Format the sessions for the frontend
      const formattedSessions = sessions.map((session: any) => ({
        id: session._id,
        menteeId: session.mentee?._id || session.mentee,
        menteeName: session.mentee?.name || 'Anonymous Mentee',
        menteeImage: session.mentee?.avatar || '/placeholder.svg',
        date: session.date,
        duration: session.duration,
        topic: session.title,
        description: session.description,
        status: session.status,
        communicationType: session.communicationType
      }));
      
      return NextResponse.json(formattedSessions);
    } catch (apiError: any) {
      console.error('Backend API error:', apiError.response?.data || apiError.message);
      
      // For testing, return mock data if backend is not available
      const mockSessions = [
        {
          id: "s1",
          menteeId: "mentee1",
          menteeName: "John Doe",
          menteeImage: "/placeholder.svg",
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          duration: 60,
          topic: "Introduction to Machine Learning",
          description: "Basic concepts and applications of ML",
          status: "scheduled",
          communicationType: "Video Call"
        },
        {
          id: "s2",
          menteeId: "mentee2",
          menteeName: "Jane Smith",
          menteeImage: "/placeholder.svg",
          date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          duration: 45,
          topic: "Career Guidance in Tech",
          description: "Discussion about career paths in technology",
          status: "scheduled",
          communicationType: "Chat"
        }
      ];
      
      console.log('Returning mock mentor sessions for testing');
      return NextResponse.json(mockSessions);
    }
  } catch (error) {
    console.error("Error fetching mentor sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
