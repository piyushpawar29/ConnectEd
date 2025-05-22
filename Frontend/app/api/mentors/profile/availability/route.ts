import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// PUT method to update mentor availability
export async function PUT(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
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
    const response = await axios.put(
      `${backendUrl}/api/mentors/profile/availability`,
      body,
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
    console.error('Error updating mentor availability:', error);
    
    // If there's a response error
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || 'Failed to update availability' },
        { status: error.response.status || 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to update availability' },
      { status: 500 }
    );
  }
} 