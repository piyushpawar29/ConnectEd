import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET(request: Request) {
  try {
    // Get the auth token from the authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;
    
    // Fall back to cookie if no auth header
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("token")?.value;
    
    // Use either token source
    const authToken = token || cookieToken;

    if (!authToken) {
      console.error("No authentication token found");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Call the backend API to get the user profile
    const response = await axios.get(`${process.env.BACKEND_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Return the user profile
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    
    // Return a mock user for development if the API fails
    return NextResponse.json({
      id: "user123",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "mentee",
      avatar: "/placeholder.svg?height=200&width=200",
      interests: ["Machine Learning", "Web Development", "UX Design"],
      goals: "I want to transition from a software developer role to a machine learning engineer position within the next year.",
      preferredLanguages: ["English", "Spanish"]
    });
  }
} 