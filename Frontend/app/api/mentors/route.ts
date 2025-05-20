import { NextResponse } from "next/server"
import axios from 'axios';

// Mock data for mentors
// const mentors = [
//   {
//     id: 1,
//     name: "Dr. Sarah Johnson",
//     role: "AI Research Scientist",
//     company: "TechInnovate",
//     image: "/placeholder.svg?height=400&width=300",
//     rating: 4.9,
//     reviews: 127,
//     hourlyRate: 120,
//     expertise: ["Machine Learning", "Neural Networks", "Computer Vision", "Research Methods"],
//     bio: "Former lead AI researcher at Google with 10+ years of experience in machine learning and neural networks. I help aspiring AI researchers and practitioners develop cutting-edge skills and navigate their career path.",
//     availability: "Evenings & Weekends",
//     category: "Technology",
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     role: "Senior Product Manager",
//     company: "ProductSphere",
//     image: "/placeholder.svg?height=400&width=300",
//     rating: 4.8,
//     reviews: 93,
//     hourlyRate: 95,
//     expertise: ["Product Strategy", "User Research", "Roadmapping", "Go-to-Market"],
//     bio: "Product leader with experience at Amazon, Airbnb, and two successful startups. I specialize in helping product managers level up their skills and advance their careers through practical, real-world guidance.",
//     availability: "Weekdays",
//     category: "Business",
//   },
//   {
//     id: 3,
//     name: "Jessica Williams",
//     role: "UX Design Director",
//     company: "DesignCo",
//     image: "/placeholder.svg?height=400&width=300",
//     rating: 5.0,
//     reviews: 156,
//     hourlyRate: 110,
//     expertise: ["UX Strategy", "Design Systems", "User Testing", "Design Leadership"],
//     bio: "Award-winning design leader who has built and led design teams at Spotify and Netflix. I'm passionate about helping designers develop both their craft and leadership skills to create meaningful impact.",
//     availability: "Flexible",
//     category: "Design",
//   },
//   {
//     id: 4,
//     name: "David Rodriguez",
//     role: "Engineering Manager",
//     company: "TechGrowth",
//     image: "/placeholder.svg?height=400&width=300",
//     rating: 4.7,
//     reviews: 84,
//     hourlyRate: 100,
//     expertise: ["Engineering Leadership", "System Architecture", "Team Building", "Career Development"],
//     bio: "Engineering leader with 15+ years of experience scaling teams and systems at Microsoft and Stripe. I help engineers and engineering managers navigate technical and leadership challenges.",
//     availability: "Weekday Evenings",
//     category: "Technology",
//   },
// ]

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
    
    // Fetch mentors from the backend API
    const response = await axios.get(`${process.env.BACKEND_URL}/api/mentors`, {
      headers: authHeader ? { 'Authorization': authHeader } : {}
    });

    let backendMentors = response.data.data || [];

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
  } catch (error) {
    console.error("Error fetching mentors:", error);
    
    // Return empty array on error to prevent rendering issues
    return NextResponse.json({ mentors: [] });
  }
}

