import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    // Call the backend API to logout
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    try {
      // Even if the backend call fails, we'll still clear the client-side tokens
      if (authHeader) {
        await axios.get(
          `${backendUrl}/api/auth/logout`,
          { headers: { Authorization: authHeader } }
        );
      }
      
      // Return a response that clears the token cookie
      const response = NextResponse.json({ 
        success: true, 
        message: "Logged out successfully" 
      });
      
      // Clear the token cookie
      response.cookies.set({
        name: "token",
        value: "",
        expires: new Date(0),
        path: "/"
      });
      
      return response;
    } catch (apiError: any) {
      console.error("Error during logout:", apiError);
      
      // Even if the backend call fails, we'll still clear the client-side tokens
      const response = NextResponse.json({ 
        success: true, 
        message: "Logged out on client side" 
      });
      
      // Clear the token cookie
      response.cookies.set({
        name: "token",
        value: "",
        expires: new Date(0),
        path: "/"
      });
      
      return response;
    }
  } catch (error) {
    console.error("Error in logout route:", error);
    return NextResponse.json({ 
      success: false, 
      error: "An error occurred during logout" 
    }, { status: 500 });
  }
}
