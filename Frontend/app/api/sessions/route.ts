import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
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
      } else {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    }
    
    // Parse the request body
    const body = await request.json();
    const { mentorUserId, title, description, date, duration, communicationType } = body;

    // Validate required fields
    if (!mentorUserId || !title || !date || !duration) {
      return NextResponse.json({ 
        error: "Missing required fields. Please provide mentorUserId, title, date, and duration." 
      }, { status: 400 });
    }

    // Call the backend API to create the session
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    try {
      console.log('Sending request to backend:', {
        url: `${backendUrl}/api/sessions`,
        data: {
          mentorUserId: mentorUserId,
          title,
          description: description || title,
          date,
          duration,
          communicationType: communicationType || 'video'
        },
        headers: { Authorization: authHeader }
      });
      
      const response = await axios.post(
        `${backendUrl}/api/sessions`,
        {
          mentorUserId: mentorUserId,
          title,
          description: description || title,
          date,
          duration,
          communicationType: communicationType || 'video'
        },
        { headers: { Authorization: authHeader } }
      );
      
      console.log('Backend response:', response.data);
      
      // Return the response from the backend
      return NextResponse.json(response.data);
    } catch (apiError: any) {
      // Handle specific API errors
      console.error('Backend API error:', apiError.response?.data || apiError.message);
      const statusCode = apiError.response?.status || 500;
      const errorMessage = apiError.response?.data?.message || "Failed to create session";
      
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

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
      } else {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    }
    
    // Call the backend API to get sessions
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    try {
      console.log('Fetching sessions from backend');
      
      const response = await axios.get(
        `${backendUrl}/api/sessions`,
        { headers: { Authorization: authHeader } }
      );
      
      console.log('Sessions fetched successfully');
      
      // Format the response for the frontend
      const sessions = response.data.data.map((session: any) => ({
        id: session._id || session.id,
        mentor: session.mentor?._id || session.mentor,
        mentorName: session.mentor?.name || 'Unknown Mentor',
        mentorImage: session.mentor?.avatar || "/placeholder.svg",
        title: session.title,
        description: session.description,
        date: session.date,
        duration: session.duration,
        status: session.status,
        communicationType: session.communicationType
      }));
      
      return NextResponse.json(sessions);
    } catch (apiError: any) {
      // Handle specific API errors
      console.error('Backend API error:', apiError.response?.data || apiError.message);
      const statusCode = apiError.response?.status || 500;
      const errorMessage = apiError.response?.data?.message || "Failed to fetch sessions";
      
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
