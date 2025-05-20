import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

interface Mentor {
  id: string
  name: string
  role: string
  company: string
  image: string
  rating: number
  reviews: number
  expertise: string[]
  matchScore: number
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const menteeId = params.id;
    
    // Get authorization header from request
    const authHeader = request.headers.get('authorization');
    
    // Fallback to cookie if needed
    let token = null;
    if (!authHeader) {
      const cookieStore = cookies();
      token = cookieStore.get("token")?.value;
      
      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
    }

    // Call the backend API for mentor recommendations
    const response = await axios.get(`${process.env.BACKEND_URL}/api/mentors/recommended/${menteeId}`, {
      headers: authHeader ? 
        { 'Authorization': authHeader } : 
        { 'Authorization': `Bearer ${token}` }
    }).catch(() => null);

    // If we get data from the backend, transform and use it
    if (response?.data?.data) {
      const recommendedMentors = response.data.data.map((mentor: any) => ({
        id: mentor._id || mentor.id || '',
        name: mentor.name || mentor.user?.name || '',
        role: mentor.title || mentor.role || "Mentor",
        company: mentor.company || "",
        image: mentor.avatar || mentor.user?.avatar || "/placeholder.svg?height=100&width=100",
        rating: mentor.rating || 4.5,
        reviews: mentor.reviews || 0,
        expertise: mentor.skills || mentor.expertise || [],
        matchScore: mentor.matchScore || Math.floor(Math.random() * 30) + 70
      }));
      
      return NextResponse.json(recommendedMentors);
    }
    
    // Fallback to simplified matching
    const mentorsResponse = await axios.get(`${process.env.BACKEND_URL}/api/mentors`, {
      headers: authHeader ? 
        { 'Authorization': authHeader } : 
        { 'Authorization': `Bearer ${token}` }
    }).catch(() => ({ data: { data: [] } }));
    
    const rawMentors = mentorsResponse.data?.data || [];
    
    // Transform and add match score
    const mentors = rawMentors.map((mentor: any) => ({
      id: mentor._id || mentor.id || '',
      name: mentor.name || mentor.user?.name || '',
      role: mentor.title || mentor.role || "Mentor",
      company: mentor.company || "",
      image: mentor.avatar || mentor.user?.avatar || "/placeholder.svg?height=100&width=100",
      rating: mentor.rating || 4.5,
      reviews: mentor.reviews || 0,
      expertise: mentor.skills || mentor.expertise || [],
      matchScore: Math.floor(Math.random() * 30) + 70 // Score between 70-100
    }));
    
    // Sort by match score, highest first
    mentors.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top 5 recommendations
    return NextResponse.json(mentors.slice(0, 5));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Return empty array to prevent rendering issues
    return NextResponse.json([]);
  }
} 