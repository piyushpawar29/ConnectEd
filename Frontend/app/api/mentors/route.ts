import { NextResponse } from "next/server"
import axios from 'axios';

interface Mentor {
  id: string
  name: string
  role: string
  company: string
  image: string
  rating: number
  reviews: number
  hourlyRate: number
  expertise: string[]
  bio: string
  availability: string
  category: string
  matchScore?: number
}

export async function GET(request: Request) {
  // Get URL and search params
  const { searchParams } = new URL(request.url)

  // Extract filter parameters
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const availability = searchParams.get("availability")
  const query = searchParams.get("query")?.toLowerCase()

  try {
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    
    // Ensure we have a valid backend URL with fallback
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    // Fetch mentors from the backend API with timeout and proper error handling
    const response = await axios.get(`${backendUrl}/api/mentors`, {
      headers: authHeader ? { 'Authorization': authHeader } : {},
      timeout: 5000 // 5 second timeout
    });

    const backendMentors = response.data.data || [];

    // Transform the data to match the frontend structure
    const mentors = backendMentors.map((mentor: any) => ({
      id: mentor._id || mentor.id || '',
      name: mentor.name || mentor.user?.name || '',
      role: mentor.title || mentor.role || "Mentor",
      company: mentor.company || "",
      image: mentor.avatar || mentor.user?.avatar || "/placeholder.svg?height=100&width=100",
      rating: mentor.rating || 4.5,
      reviews: mentor.reviews || 0,
      hourlyRate: mentor.hourlyRate || 50,
      expertise: mentor.skills || mentor.expertise || [],
      bio: mentor.bio || "",
      availability: mentor.availability || "Flexible",
      category: mentor.category || "Technology"
    }));

    // Apply filters if provided
    let filteredMentors = [...mentors];

    if (category) {
      filteredMentors = filteredMentors.filter((mentor) => mentor.category === category)
    }

    if (minPrice) {
      filteredMentors = filteredMentors.filter((mentor) => mentor.hourlyRate >= Number(minPrice))
    }

    if (maxPrice) {
      filteredMentors = filteredMentors.filter((mentor) => mentor.hourlyRate <= Number(maxPrice))
    }

    if (availability) {
      filteredMentors = filteredMentors.filter((mentor) => mentor.availability === availability)
    }

    if (query) {
      filteredMentors = filteredMentors.filter(
        (mentor) =>
          mentor.name?.toLowerCase().includes(query) ||
          mentor.role?.toLowerCase().includes(query) ||
          mentor.company?.toLowerCase().includes(query) ||
          mentor.bio?.toLowerCase().includes(query) ||
          mentor.expertise?.some((skill: string) => skill.toLowerCase().includes(query))
      )
    }

    return NextResponse.json({ mentors: filteredMentors })
  } catch (error: any) {
    console.error("Error fetching mentors from backend:", error.message);
    
    // Return empty array on error instead of using mock data
    return NextResponse.json({ 
      mentors: [],
      error: "Failed to fetch mentors data. Please try again later."
    });
  }
}

