"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  CalendarIcon,
  Video,
  MessageSquare,
  Search,
  Filter,
  Star,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react"

// Mock data for the mentee profile
const mockMenteeProfile = {
  id: "mentee123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  interests: ["Machine Learning", "Web Development", "UX Design"],
  goals:
    "I want to transition from a software developer role to a machine learning engineer position within the next year.",
  preferredLanguages: ["English", "Spanish"],
  profilePicture: "/placeholder.svg?height=200&width=200",
}

// Mock data for upcoming sessions
const mockUpcomingSessions = [
  {
    id: "s1",
    mentorId: "mentor1",
    mentorName: "Dr. Sarah Johnson",
    mentorImage: "/placeholder.svg?height=40&width=40",
    date: "2023-11-15T14:00:00",
    duration: 60,
    topic: "Introduction to Neural Networks",
    status: "confirmed",
  },
  {
    id: "s2",
    mentorId: "mentor2",
    mentorName: "Michael Chen",
    mentorImage: "/placeholder.svg?height=40&width=40",
    date: "2023-11-20T10:00:00",
    duration: 45,
    topic: "React Performance Optimization",
    status: "confirmed",
  },
]

// Mock data for recommended mentors
const mockRecommendedMentors = [
  {
    id: "mentor1",
    name: "Dr. Sarah Johnson",
    role: "AI Research Scientist",
    company: "TechInnovate",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    reviews: 127,
    expertise: ["Machine Learning", "Neural Networks", "Computer Vision"],
    matchScore: 98,
  },
  {
    id: "mentor3",
    name: "Jessica Williams",
    role: "UX Design Director",
    company: "DesignCo",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5.0,
    reviews: 156,
    expertise: ["UX Strategy", "Design Systems", "User Testing"],
    matchScore: 92,
  },
  {
    id: "mentor4",
    name: "David Rodriguez",
    role: "Engineering Manager",
    company: "TechGrowth",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    reviews: 84,
    expertise: ["Engineering Leadership", "System Architecture", "Team Building"],
    matchScore: 85,
  },
]

// Mock data for all mentors
const mockAllMentors = [
  ...mockRecommendedMentors,
  {
    id: "mentor2",
    name: "Michael Chen",
    role: "Senior Product Manager",
    company: "ProductSphere",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    reviews: 93,
    expertise: ["Product Strategy", "User Research", "Roadmapping"],
    matchScore: 78,
  },
  {
    id: "mentor5",
    name: "Emma Thompson",
    role: "Frontend Developer",
    company: "WebTech",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.6,
    reviews: 62,
    expertise: ["React", "TypeScript", "CSS Animation"],
    matchScore: 75,
  },
  {
    id: "mentor6",
    name: "James Wilson",
    role: "Data Scientist",
    company: "DataCorp",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    reviews: 108,
    expertise: ["Python", "Data Analysis", "Machine Learning"],
    matchScore: 72,
  },
]

export default function MenteeDashboard() {
  const [profile, setProfile] = useState(mockMenteeProfile)
  const [upcomingSessions, setUpcomingSessions] = useState(mockUpcomingSessions)
  const [recommendedMentors, setRecommendedMentors] = useState(mockRecommendedMentors)
  const [allMentors, setAllMentors] = useState(mockAllMentors)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [filteredMentors, setFilteredMentors] = useState(mockAllMentors)
  const { toast } = useToast()

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be actual API calls
        // const profileResponse = await axios.get('/api/mentee/profile');
        // const sessionsResponse = await axios.get('/api/mentee/sessions');
        // const recommendedResponse = await axios.get(`/api/match/${mockMenteeProfile.id}`);
        // const allMentorsResponse = await axios.get('/api/mentors');

        // setProfile(profileResponse.data);
        // setUpcomingSessions(sessionsResponse.data);
        // setRecommendedMentors(recommendedResponse.data);
        // setAllMentors(allMentorsResponse.data);

        // Simulate API delay
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your dashboard data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter mentors based on search term and selected skills
  useEffect(() => {
    let filtered = [...allMentors]

    if (searchTerm) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.expertise.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((mentor) => selectedSkills.some((skill) => mentor.expertise.includes(skill)))
    }

    setFilteredMentors(filtered)
  }, [searchTerm, selectedSkills, allMentors])

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

  const toggleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  // Get all unique skills from all mentors
  const allSkills = Array.from(new Set(allMentors.flatMap((mentor) => mentor.expertise)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">Mentee Dashboard</h1>

          {/* Upcoming Sessions Section */}
          <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={session.mentorImage} alt={session.mentorName} />
                            <AvatarFallback>{session.mentorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{session.mentorName}</h4>
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
                        <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                  <p className="text-gray-400 mb-4">You don't have any scheduled sessions yet.</p>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                    Find a Mentor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentors Section */}
          <Tabs defaultValue="recommended" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 bg-gray-900/50 p-1 rounded-lg">
              <TabsTrigger
                value="recommended"
                className="data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 data-[state=active]:text-cyan-400"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Recommended Mentors
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 data-[state=active]:text-cyan-400"
              >
                <User className="h-4 w-4 mr-2" />
                Browse All Mentors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended">
              <div className="space-y-6">
                <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">AI-Matched Mentors for You</h3>
                  <p className="text-gray-400 mb-6">
                    Based on your profile, interests, and goals, we've found these mentors who would be a great match
                    for you.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedMentors.map((mentor, index) => (
                      <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group"
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-md opacity-70"></div>
                              <Avatar className="h-16 w-16 border-2 border-gray-700">
                                <AvatarImage src={mentor.image} alt={mentor.name} />
                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <h4 className="font-bold">{mentor.name}</h4>
                              <p className="text-sm text-gray-400">
                                {mentor.role} at {mentor.company}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-400">
                              {mentor.rating} ({mentor.reviews} reviews)
                            </span>
                          </div>

                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {mentor.expertise.map((skill, skillIndex) => (
                                <Badge
                                  key={skillIndex}
                                  variant="outline"
                                  className="bg-gray-700/50 border-gray-600 text-gray-300"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-cyan-950/30 rounded-lg px-3 py-1 border border-cyan-500/30">
                              <div className="flex items-center gap-1">
                                <Sparkles className="h-4 w-4 text-cyan-400" />
                                <span className="text-cyan-400 font-medium">{mentor.matchScore}% Match</span>
                              </div>
                            </div>
                          </div>

                          <Link href={`/mentor/${mentor.id}`} passHref>
                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                              View Profile
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-6">
                <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by name, role, or expertise..."
                        className="pl-10 bg-gray-800 border-gray-700 focus:border-cyan-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="border-gray-700 hover:border-cyan-500 hover:bg-gray-800">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Filter by Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`cursor-pointer ${
                            selectedSkills.includes(skill)
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                          }`}
                          onClick={() => toggleSkillFilter(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {filteredMentors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredMentors.map((mentor, index) => (
                        <motion.div
                          key={mentor.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group"
                        >
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-md opacity-70"></div>
                                <Avatar className="h-16 w-16 border-2 border-gray-700">
                                  <AvatarImage src={mentor.image} alt={mentor.name} />
                                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <h4 className="font-bold">{mentor.name}</h4>
                                <p className="text-sm text-gray-400">
                                  {mentor.role} at {mentor.company}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-400">
                                {mentor.rating} ({mentor.reviews} reviews)
                              </span>
                            </div>

                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {mentor.expertise.map((skill, skillIndex) => (
                                  <Badge
                                    key={skillIndex}
                                    variant="outline"
                                    className="bg-gray-700/50 border-gray-600 text-gray-300"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <Link href={`/mentor/${mentor.id}`} passHref>
                              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                                View Profile
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No mentors found</h3>
                      <p className="text-gray-400 mb-4">Try adjusting your search or filters to find mentors.</p>
                      <Button
                        variant="outline"
                        className="border-cyan-500 text-cyan-500 hover:bg-cyan-950"
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedSkills([])
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

