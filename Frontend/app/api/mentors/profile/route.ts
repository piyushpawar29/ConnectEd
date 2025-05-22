import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// GET method to fetch mentor profile
export async function GET(request: NextRequest) {
  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authentication token required' },
        { status: 401 }
      );
    }

    // Forward request to backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    const response = await axios.get(
      `${backendUrl}/api/mentors/profile`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return the response from backend
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching mentor profile:', error);
    
    // If there's a response error
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || 'Failed to fetch profile' },
        { status: error.response.status || 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 