"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import {
  User,
  Upload,
  Save,
  Clock,
  CalendarIcon,
  Video,
  MessageSquare,
  ExternalLink,
  Plus,
  X,
  Loader2,Home
} from "lucide-react"
import axios from "axios"

// // Mock data for the mentor profile
// const mockMentorProfile = {
//   id: "m123",
//   name: "Dr. Sarah Johnson",
//   email: "sarah.johnson@example.com",
//   bio: "Former lead AI researcher at Google with 10+ years of experience in machine learning and neural networks. I help aspiring AI researchers and practitioners develop cutting-edge skills and navigate their career path.",
//   skills: ["Machine Learning", "Neural Networks", "Computer Vision", "Research Methods"],
//   experience: "10+ years",
//   languages: ["English", "Mandarin"],
//   communicationPreference: "video",
//   availability: [
//     { day: "Monday", slots: ["10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM"] },
//     { day: "Wednesday", slots: ["1:00 PM - 2:00 PM", "4:00 PM - 5:00 PM"] },
//     { day: "Friday", slots: ["9:00 AM - 10:00 AM", "3:00 PM - 4:00 PM"] },
//   ],
//   profilePicture: "/placeholder.svg?height=200&width=200",
//   rating: 4.9,
//   reviewCount: 127,
// }

// // Mock data for upcoming sessions
// const mockUpcomingSessions = [
//   {
//     id: "s1",
//     menteeId: "mentee1",
//     menteeName: "Michael Chen",
//     menteeImage: "/placeholder.svg?height=40&width=40",
//     date: "2023-11-15T14:00:00",
//     duration: 60,
//     topic: "Introduction to Neural Networks",
//     status: "confirmed",
//   },
//   {
//     id: "s2",
//     menteeId: "mentee2",
//     menteeName: "Jessica Williams",
//     menteeImage: "/placeholder.svg?height=40&width=40",
//     date: "2023-11-17T10:00:00",
//     duration: 45,
//     topic: "Career Transition to AI Research",
//     status: "confirmed",
//   },
//   {
//     id: "s3",
//     menteeId: "mentee3",
//     menteeName: "David Rodriguez",
//     menteeImage: "/placeholder.svg?height=40&width=40",
//     date: "2023-11-20T15:30:00",
//     duration: 30,
//     topic: "Research Paper Review",
//     status: "pending",
//   },
// ]

interface Profile {
  id: string
  name: string
  email: string
  bio: string
  skills: string[]
  experience: string
  languages: string[]
  communicationPreference: string
  availability: { day: string; slots: string[] }[]
  profilePicture?: string
  rating: number
  reviewCount: number
}

interface Session {
  id: string
  menteeId: string
  menteeName: string
  menteeImage: string
  date: string
  duration: number
  topic: string
  status: string
}

// Debug token formatting helper
const debugToken = (token: string | null) => {
  if (!token) {
    console.error("DEBUG: Token is null or empty");
    return false;
  }

  console.log("DEBUG: Token length:", token.length);
  console.log("DEBUG: First 10 chars:", token.substring(0, 10) + "...");
  
  // Check if token is wrapped in quotes
  const isQuoted = token.startsWith('"') && token.endsWith('"');
  console.log("DEBUG: Token is quoted:", isQuoted);
  
  // Check if token looks like a JWT (three parts separated by dots)
  const jwtFormat = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  const formattedToken = isQuoted ? token.slice(1, -1) : token;
  const isJwtFormat = jwtFormat.test(formattedToken);
  console.log("DEBUG: Is JWT format:", isJwtFormat);
  
  return isJwtFormat;
};

// Debug axios response handler
const debugAxiosResponse = (response: any, source: string) => {
  console.log(`DEBUG ${source} response:`, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    hasData: !!response.data
  });
  
  if (response.data) {
    console.log(`DEBUG ${source} data:`, {
      success: response.data.success,
      message: response.data.message,
      dataKeys: response.data.data ? Object.keys(response.data.data) : 'no data'
    });
  }
};

// Debug axios error handler
const debugAxiosError = (error: any, source: string) => {
  console.error(`DEBUG ${source} error:`, {
    message: error.message,
    code: error.code,
    hasResponse: !!error.response,
    hasRequest: !!error.request
  });
  
  if (error.response) {
    console.error(`DEBUG ${source} response error:`, {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    });
  }
};

export default function MentorDashboard() {
  const [profile, setProfile] = useState<Profile>({
    id: "",
    name: "",
    email: "",
    bio: "",
    skills: [],
    experience: "",
    languages: [],
    communicationPreference: "",
    availability: [],
    profilePicture: "",
    rating: 0,
    reviewCount: 0,
  })
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newTimeSlot, setNewTimeSlot] = useState({ day: "", time: "" })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [backendAvailable, setBackendAvailable] = useState(false)
  const { toast } = useToast()

  // Check if backend server is running
  const checkBackendStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/test', {
        timeout: 3000 // 3 second timeout
      });
      debugAxiosResponse(response, 'Backend status check');
      setBackendAvailable(true);
      return true;
    } catch (error) {
      debugAxiosError(error, 'Backend status check');
      setBackendAvailable(false);
      return false;
    }
  };
  
  // Add a function to test the connection on demand
  const testBackendConnection = async () => {
    toast({
      title: "Testing Connection",
      description: "Checking connection to backend server...",
    });
    
    try {
      const result = await checkBackendStatus();
      
      if (result) {
        toast({
          title: "Connection Successful",
          description: "Connected to backend server successfully!",
        });
        
        // Refresh data
        window.location.reload();
      } else {
        toast({
          title: "Connection Failed",
          description: "Cannot connect to backend server. Please make sure it's running on port 5001.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while checking the connection.",
        variant: "destructive",
      });
    }
  };

  // Fetch sessions from API
  const fetchSessions = async (token: string | null) => {
    try {
      console.log('Fetching mentor sessions...');
      
      // Call our Next.js API route for mentor sessions
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/mentor/sessions', { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Sessions fetched successfully:', data);
      
      // Update state with the fetched sessions
      setUpcomingSessions(data);
      return data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error Fetching Sessions",
        description: "Could not load your upcoming sessions. Using sample data instead.",
        variant: "destructive",
      });
      
      // Use mock data for testing if API fails
      const mockSessions = [
        {
          id: "s1",
          menteeId: "mentee1",
          menteeName: "John Doe",
          menteeImage: "/placeholder.svg",
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          duration: 60,
          topic: "Introduction to Machine Learning",
          status: "scheduled"
        },
        {
          id: "s2",
          menteeId: "mentee2",
          menteeName: "Jane Smith",
          menteeImage: "/placeholder.svg",
          date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          duration: 45,
          topic: "Career Guidance in Tech",
          status: "scheduled"
        }
      ];
      
      setUpcomingSessions(mockSessions);
      return mockSessions;
    }
  };
  
  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First check if backend is available without authentication
        try {
          // Simple test to see if backend is responding
          const testResponse = await axios.get('http://localhost:5001/api/auth/test', { timeout: 3000 });
          debugAxiosResponse(testResponse, 'Backend test');
          setBackendAvailable(true);
        } catch (testError) {
          debugAxiosError(testError, 'Backend test');
          setBackendAvailable(false);
          setLoading(false);
          toast({
            title: "Backend Server Unavailable",
            description: "Cannot connect to the backend server. Please ensure it's running at http://localhost:5001",
            variant: "destructive",
          });
          // Continue anyway to show UI with mock data
        }
        
        // Get token from localStorage
        let token = null;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('token');
          console.log("Token found in localStorage:", token ? "Yes" : "No");
        }
        
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          setLoading(false);
          
          // For testing, we'll still fetch sessions with mock data
          await fetchSessions(null);
          return;
        }
        
        // Debug token format before applying any transformations
        console.log("Original token format:");
        debugToken(token);
        
        // Ensure token is properly formatted (without extra quotes)
        if (token.startsWith('"') && token.endsWith('"')) {
          token = token.slice(1, -1);
          console.log("After removing quotes:");
          debugToken(token);
        }
        
        // Fetch sessions first to ensure they appear on the dashboard
        await fetchSessions(token);
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        console.log("Final request headers:", {
          Authorization: headers.Authorization.substring(0, 15) + '...',
          Accept: headers.Accept,
          ContentType: headers['Content-Type']
        });

        // Try direct API call first
        try {
          console.log("Attempting direct API call to backend");
          const response = await axios.get(
            'http://localhost:5001/api/mentors/profile', 
            { headers, timeout: 5000 }
          );
          
          debugAxiosResponse(response, 'Direct API');
          
          // Transform the data from the backend format to the frontend format
          const { user, profile } = response.data.data;
          const transformedData = {
            id: user?.id || "",
            name: user?.name || "",
            email: user?.email || "",
            bio: user?.bio || profile?.bio || "",
            skills: Array.isArray(profile?.expertise) ? profile.expertise : [],
            languages: Array.isArray(profile?.languages) ? profile.languages : ["English"],
            availability: profile?.availability ? formatAvailability(profile.availability) : defaultAvailability(),
            experience: profile?.experience || "",
            hourlyRate: profile?.hourlyRate || 0,
            communicationPreference: profile?.communicationPreference || "Any",
            company: profile?.company || "",
            category: profile?.category || "Technology",
            socials: profile?.socials || {},
            rating: profile?.rating || 0,
            reviewCount: profile?.reviews || 0
          };
          
          setProfile(transformedData);
          setLoading(false);
          return;
          
        } catch (error: any) {
          debugAxiosError(error, 'Direct API');
          
          // If direct API call fails, try Next.js API route
          try {
            const response = await axios.get('/api/mentor/profile', { headers });
            debugAxiosResponse(response, 'Next.js API');
            
            // Ensure data is properly formatted
            const mentorData = response.data;
            
            // Set default values for potentially missing fields
            const transformedData = {
              ...mentorData,
              bio: mentorData.bio || "",
              skills: Array.isArray(mentorData.skills) ? mentorData.skills : [], 
              languages: Array.isArray(mentorData.languages) ? mentorData.languages : ["English"],
              availability: mentorData.availability && Array.isArray(mentorData.availability) ? 
                mentorData.availability : defaultAvailability(),
              rating: mentorData.rating || 0,
              reviewCount: mentorData.reviewCount || 0
            };
            
            setProfile(transformedData);
            
          } catch (apiError: any) {
            debugAxiosError(apiError, 'Next.js API');
            throw new Error("Failed to fetch mentor data from both direct API and API routes");
          }
        }
        
        setLoading(false);
        
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load mentor data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);
  
  // Helper function to format availability from string to structured format
  const formatAvailability = (availabilityString: string) => {
    // Default structured availability
    const defaultAvail = defaultAvailability();
    
    try {
      // If it's already an array, return it
      if (Array.isArray(availabilityString)) {
        return availabilityString;
      }
      
      // Try to parse if it's a JSON string
      if (typeof availabilityString === 'string' && availabilityString.trim().startsWith('[')) {
        return JSON.parse(availabilityString);
      }
      
      // If it's just a text like "Flexible", create a basic structure
      return [
        {
          day: "Monday-Friday",
          slots: ["9:00 AM - 5:00 PM"]
        },
        {
          day: "Weekends",
          slots: ["By appointment"]
        }
      ];
    } catch (e) {
      console.error("Error parsing availability:", e);
      return defaultAvail;
    }
  };
  
  // Default availability structure
  const defaultAvailability = () => {
    return [
      {
        day: "Monday",
        slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"]
      },
      {
        day: "Tuesday",
        slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"]
      },
      {
        day: "Wednesday",
        slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"]
      },
      {
        day: "Friday",
        slots: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"]
      }
    ];
  };

  const handleProfileUpdate = async () => {
    setSaving(true)
    try {
      // Get token from localStorage
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
      
      // Ensure token is properly formatted (without extra quotes)
      if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      // Import the mentorAPI from our utility
      try {
        const { mentorAPI } = await import('@/lib/api');
        
        console.log("Updating mentor profile via API utility");
        const payload = {
          availability: profile.availability,
          expertise: profile.skills,
          languages: profile.languages
        };
        
        // Use our API utility to update the mentor profile
        const response = await mentorAPI.updateMentorProfile(payload);
        
        console.log("Profile update response:", response.status);
        
        toast({
          title: "Profile Updated",
          description: "Your profile settings have been successfully updated.",
        });
      } catch (directError) {
        console.error("Direct API update failed:", directError);
        
        // Fall back to Next.js API route
        try {
          console.log("Trying Next.js API route");
          // Import the frontendApi directly
          const { default: frontendApi } = await import('@/lib/api');
          
          const response = await frontendApi.put(
            '/api/mentors/profile', 
            { 
              availability: profile.availability,
              expertise: profile.skills,
              languages: profile.languages
            }
          );
          
          console.log("Next.js API update response:", response.status);
          
          toast({
            title: "Profile Updated",
            description: "Your profile settings have been successfully updated.",
          });
        } catch (apiError) {
          console.error("All update attempts failed:", apiError);
          throw new Error("Failed to update profile through any available route");
        }
      }
    } catch (error: any) {
      console.error("Error updating profile settings:", error);
      
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update your profile settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    })
  }

  const handleAddLanguage = () => {
    if (newLanguage && !profile.languages.includes(newLanguage)) {
      setProfile({
        ...profile,
        languages: [...profile.languages, newLanguage],
      })
      setNewLanguage("")
    }
  }

  const handleRemoveLanguage = (language: string) => {
    setProfile({
      ...profile,
      languages: profile.languages.filter((l) => l !== language),
    })
  }

  const handleAddTimeSlot = () => {
    if (newTimeSlot.day && newTimeSlot.time) {
      const existingDayIndex = profile.availability.findIndex((a) => a.day === newTimeSlot.day)

      if (existingDayIndex >= 0) {
        // Add to existing day
        const updatedAvailability = [...profile.availability]
        if (!updatedAvailability[existingDayIndex].slots.includes(newTimeSlot.time)) {
          updatedAvailability[existingDayIndex].slots.push(newTimeSlot.time)
        }
        setProfile({
          ...profile,
          availability: updatedAvailability,
        })
      } else {
        // Add new day
        setProfile({
          ...profile,
          availability: [...profile.availability, { day: newTimeSlot.day, slots: [newTimeSlot.time] }],
        })
      }

      setNewTimeSlot({ day: "", time: "" })
    }
  }

  const handleRemoveTimeSlot = (day: string, slot: string) => {
    const updatedAvailability = profile.availability
      .map((a) => {
        if (a.day === day) {
          return {
            ...a,
            slots: a.slots.filter((s) => s !== slot),
          }
        }
        return a
      })
      .filter((a) => a.slots.length > 0) // Remove days with no slots

    setProfile({
      ...profile,
      availability: updatedAvailability,
    })
  }

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
              <div className="md:col-span-3">
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Display a message when backend is unavailable
  if (!backendAvailable && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6 mt-12">
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-8 max-w-lg text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Backend Server Unavailable</h2>
              <p className="text-gray-300 mb-6">
                Cannot connect to the backend server at <span className="font-mono bg-gray-800 px-2 py-1 rounded">http://localhost:5001</span>
              </p>
              <div className="space-y-4">
                <p className="text-gray-400">
                  Please ensure the backend server is running. Common issues:
                </p>
                <ul className="text-gray-400 text-left list-disc ml-8">
                  <li>Backend server is not started</li>
                  <li>Backend is running on a different port than 5001</li>
                  <li>Firewall is blocking the connection</li>
                  <li>CORS settings preventing access (check console for details)</li>
                </ul>
                <div className="pt-4">
                  <Button 
                    onClick={testBackendConnection}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  >
                    Test Connection
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <header className="absolute top-4 left-0 w-full h-14 bg-gray-900/50 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
       <Link href="/" className="flex items-center gap-2 z-50">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-70"></div>
              <div className="relative flex items-center justify-center w-full h-full bg-gray-900 rounded-full border border-cyan-500 z-10">
                <span className="font-bold text-cyan-500">C</span>
              </div>
            </div>
            <span className="font-bold text-xl">ConnectEd</span>
          </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" passHref>
            <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
              <Home className="h-4 w-4 mr-2" />
              Home Page
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
              Logout
            </Button>
          </Link>
        </div>
      </div>
      </header>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Mentor Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your profile, sessions, and availability</p>
            </div>
            <Link href={`/mentors/${profile.id}`} passHref>
              <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Profile
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 bg-gray-900/50 p-1 rounded-lg">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 data-[state=active]:text-cyan-400"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 data-[state=active]:text-cyan-400"
              >
                <Video className="h-4 w-4 mr-2" />
                Upcoming Sessions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                <CardHeader className="border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{profile.name}</CardTitle>
                      <CardDescription>{profile.email}</CardDescription>
                    </div>
                    <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(profile.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">
                        {profile.rating.toFixed(1)} ({profile.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm text-gray-400">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="bg-gray-800 border-gray-700 min-h-[120px] text-gray-200"
                      placeholder="Write your professional bio here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-sm text-gray-400">Skills & Expertise</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profile.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gray-800 border-gray-700 group"
                          >
                            {skill}
                            <button
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              <X className="h-3 w-3 text-red-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a new skill"
                          className="bg-gray-800 border-gray-700"
                        />
                        <Button
                          variant="outline"
                          className="border-cyan-500 text-cyan-500 hover:bg-cyan-950"
                          onClick={handleAddSkill}
                          disabled={!newSkill}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languages" className="text-sm text-gray-400">Languages</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profile.languages.map((language, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gray-800 border-gray-700 group"
                          >
                            {language}
                            <button
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveLanguage(language)}
                            >
                              <X className="h-3 w-3 text-red-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          placeholder="Add a new language"
                          className="bg-gray-800 border-gray-700"
                        />
                        <Button
                          variant="outline"
                          className="border-cyan-500 text-cyan-500 hover:bg-cyan-950"
                          onClick={handleAddLanguage}
                          disabled={!newLanguage}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="communication" className="text-sm text-gray-400">Preferred Communication</Label>
                      <Input
                        id="communication"
                        value={profile.communicationPreference}
                        className="bg-gray-800 border-gray-700"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-sm text-gray-400">Experience</Label>
                      <Input
                        id="experience"
                        value={profile.experience}
                        className="bg-gray-800 border-gray-700"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-6 mt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-cyan-400">Availability Settings</h3>
                      <p className="text-sm text-gray-400">Set up when you're available to mentor</p>
                    </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-medium mb-4 text-white">Current Availability</h4>
                        {profile.availability.length > 0 ? (
                          <div className="space-y-4">
                            {profile.availability.map((day, dayIndex) => (
                              <div key={dayIndex} className="border-b border-gray-700 last:border-0 pb-3 last:pb-0">
                                <h5 className="text-sm font-medium text-cyan-400 mb-2">{day.day}</h5>
                                <div className="flex flex-wrap gap-2">
                                  {day.slots.map((slot, slotIndex) => (
                                    <Badge
                                      key={slotIndex}
                                      variant="outline"
                                      className="bg-gray-700 border-gray-600 group hover:border-red-500/50"
                                    >
                                      {slot}
                                      <button
                                        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveTimeSlot(day.day, slot)}
                                      >
                                        <X className="h-3 w-3 text-red-500" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No availability set yet</p>
                        )}
                      </div>

                      <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-medium mb-4 text-white">Add Time Slot</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="day" className="text-sm text-gray-400">
                              Day
                            </Label>
                            <Select
                              value={newTimeSlot.day}
                              onValueChange={(value) => setNewTimeSlot({ ...newTimeSlot, day: value })}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Monday">Monday</SelectItem>
                                <SelectItem value="Tuesday">Tuesday</SelectItem>
                                <SelectItem value="Wednesday">Wednesday</SelectItem>
                                <SelectItem value="Thursday">Thursday</SelectItem>
                                <SelectItem value="Friday">Friday</SelectItem>
                                <SelectItem value="Saturday">Saturday</SelectItem>
                                <SelectItem value="Sunday">Sunday</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="time" className="text-sm text-gray-400">
                              Time
                            </Label>
                            <Select
                              value={newTimeSlot.time}
                              onValueChange={(value) => setNewTimeSlot({ ...newTimeSlot, time: value })}
                            >
                              <SelectTrigger className="bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</SelectItem>
                                <SelectItem value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</SelectItem>
                                <SelectItem value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</SelectItem>
                                <SelectItem value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</SelectItem>
                                <SelectItem value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</SelectItem>
                                <SelectItem value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</SelectItem>
                                <SelectItem value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</SelectItem>
                                <SelectItem value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            variant="outline"
                            className="w-full border-cyan-500 text-cyan-500 hover:bg-cyan-950"
                            onClick={handleAddTimeSlot}
                            disabled={!newTimeSlot.day || !newTimeSlot.time}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Time Slot
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-6">
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    onClick={handleProfileUpdate}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800 h-full">
                    <CardHeader>
                      <CardTitle className="text-xl text-cyan-400">Upcoming Sessions</CardTitle>
                      <CardDescription>Your scheduled mentoring sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {upcomingSessions.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingSessions.map((session) => (
                            <div
                              key={session.id}
                              className="bg-gray-800/60 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    {/* <AvatarImage src={session.menteeImage} alt={session.menteeName} /> */}
                                    <AvatarFallback>{session.menteeName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium">{session.menteeName}</h4>
                                    <p className="text-sm text-gray-400">{session.topic}</p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    session.status === "confirmed"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }
                                >
                                  {session.status === "confirmed" ? "Confirmed" : "Pending"}
                                </Badge>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-400">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{formatSessionDate(session.date)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span>{session.duration} minutes</span>
                                </div>
                              </div>
                              <div className="mt-3 flex gap-2">
                                <Link href="https://meet.google.com/bfy-jzcd-hxv" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Session
                                </Button>
                                </Link>
                                <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-800/40 rounded-lg border border-gray-700">
                          <CalendarIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                          <p className="text-gray-400 mb-4">You don't have any scheduled sessions yet.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-xl text-cyan-400">Calendar</CardTitle>
                      <CardDescription>View your schedule</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border border-gray-800 bg-gray-900/50"
                      />

                      <div className="mt-6 bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-medium mb-3 text-cyan-400">
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>

                        {upcomingSessions.filter((session) => {
                          const sessionDate = new Date(session.date)
                          return (
                            selectedDate &&
                            sessionDate.getDate() === selectedDate.getDate() &&
                            sessionDate.getMonth() === selectedDate.getMonth() &&
                            sessionDate.getFullYear() === selectedDate.getFullYear()
                          )
                        }).length > 0 ? (
                          <div className="space-y-3">
                            {upcomingSessions
                              .filter((session) => {
                                const sessionDate = new Date(session.date)
                                return (
                                  selectedDate &&
                                  sessionDate.getDate() === selectedDate.getDate() &&
                                  sessionDate.getMonth() === selectedDate.getMonth() &&
                                  sessionDate.getFullYear() === selectedDate.getFullYear()
                                )
                              })
                              .map((session) => (
                                <div key={session.id} className="bg-gray-800/80 rounded p-3 border border-gray-700 hover:border-cyan-500/50 transition-colors">
                                  <p className="font-medium text-sm">{session.topic}</p>
                                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>
                                      {new Date(session.date).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                    <span>with {session.menteeName}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500 text-sm">No sessions scheduled for this day</p>
                            <p className="text-gray-600 text-xs mt-1">Select another date or add a new session</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

