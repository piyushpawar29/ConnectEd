import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request, { params }: { params: { mentorId: string } }) {
  const mentorId = params.mentorId

  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    // Parse the request body
    const body = await request.json()
    const { rating, comment } = body

    // Validate input
    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 })
    }

    // Call the backend API to create the review
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    try {
      // Log the request details for debugging
      console.log('Sending review to backend:', {
        url: `${backendUrl}/api/mentors/${mentorId}/reviews`,
        data: { rating, comment },
        headers: { Authorization: authHeader }
      });
      
      const response = await axios.post(
        `${backendUrl}/api/mentors/${mentorId}/reviews`,
        { rating, comment },
        { headers: { Authorization: authHeader } }
      );
      
      // Return the response from the backend
      return NextResponse.json(response.data);
    } catch (apiError: any) {
      // Handle specific API errors
      const statusCode = apiError.response?.status || 500;
      const errorMessage = apiError.response?.data?.message || "Failed to create review";
      
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

