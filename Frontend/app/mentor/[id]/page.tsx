"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, ArrowLeft, CalendarIcon, Video, MessageSquare, Languages, Briefcase, Award, Loader2 } from "lucide-react"

// Mock data for the mentor profile
const mockMentorProfile = {
  id: "m123",
  name: "Dr. Sarah Johnson",
  role: "AI Research Scientist",
  company: "TechInnovate",
  bio: "Former lead AI researcher at Google with 10+ years of experience in machine learning and neural networks. I help aspiring AI researchers and practitioners develop cutting-edge skills and navigate their career path.",
  skills: ["Machine Learning", "Neural Networks", "Computer Vision", "Research Methods"],
  yearsOfExperience: "10+ years",
  languages: ["English", "Mandarin"],
  communicationPreference: "video",
  availability: [
    { day: "Monday", slots: ["10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM"] },
    { day: "Wednesday", slots: ["1:00 PM - 2:00 PM", "4:00 PM - 5:00 PM"] },
    { day: "Friday", slots: ["9:00 AM - 10:00 AM", "3:00 PM - 4:00 PM"] },
  ],
  profilePicture: "/placeholder.svg?height=400&width=300",
  rating: 4.9,
  reviewCount: 127,
  hourlyRate: 120,
  sessionTypes: [
    { id: "1on1", name: "1:1 Video Session", duration: 60, price: 120 },
    { id: "group", name: "Group Session", duration: 90, price: 80 },
    { id: "code", name: "Code Review", duration: 45, price: 100 },
  ],
  education: [
    { degree: "PhD in Computer Science", institution: "Stanford University", year: "2011" },
    { degree: "MS in Computer Science", institution: "MIT", year: "2008" },
    { degree: "BS in Computer Science", institution: "UC Berkeley", year: "2006" },
  ],
  certifications: [
    { name: "TensorFlow Developer Certificate", issuer: "Google", year: "2019" },
    { name: "AWS Machine Learning Specialty", issuer: "Amazon Web Services", year: "2020" },
  ],
  workExperience: [
    {
      role: "AI Research Scientist",
      company: "TechInnovate",
      period: "2020 - Present",
      description:
        "Leading research initiatives in computer vision and natural language processing. Mentoring junior researchers and collaborating with cross-functional teams.",
    },
    {
      role: "Senior Research Scientist",
      company: "Google AI",
      period: "2015 - 2020",
      description:
        "Conducted research on deep learning models for computer vision applications. Published multiple papers in top-tier conferences.",
    },
    {
      role: "Research Scientist",
      company: "Stanford AI Lab",
      period: "2011 - 2015",
      description: "Focused on developing novel neural network architectures for image recognition tasks.",
    },
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: "Michael Chen",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2023-10-15",
      comment:
        "Sarah is an exceptional mentor! Her deep knowledge of machine learning and neural networks helped me understand complex concepts that I was struggling with. She provided practical advice that I could immediately apply to my research project.",
    },
    {
      id: 2,
      user: {
        name: "Jessica Williams",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2023-09-22",
      comment:
        "Working with Sarah has been transformative for my career. She helped me navigate the transition from academia to industry and provided invaluable guidance on how to apply my research skills in a commercial setting.",
    },
    {
      id: 3,
      user: {
        name: "David Rodriguez",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "2023-08-10",
      comment:
        "Sarah's mentorship has been incredibly helpful. She's very knowledgeable and patient. The only reason I'm not giving 5 stars is that sometimes our sessions ran over time, but that's partly because I had so many questions!",
    },
    {
      id: 4,
      user: {
        name: "Emma Thompson",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2023-07-05",
      comment:
        "I've had several mentors in the past, but Sarah stands out for her ability to explain complex concepts in a way that's easy to understand. She's also great at providing constructive feedback that has helped me improve my skills significantly.",
    },
    {
      id: 5,
      user: {
        name: "James Wilson",
        image: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2023-06-18",
      comment:
        "Sarah's guidance has been instrumental in helping me land my dream job in AI research. Her insights into the industry and advice on how to position myself were spot on. I can't recommend her enough!",
    },
  ],
}

export default function MentorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [mentor, setMentor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [selectedSessionType, setSelectedSessionType] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [bookingNote, setBookingNote] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)

  // Fetch mentor data
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an actual API call
        // const response = await axios.get(`/api/mentors/${params.id}`);
        // setMentor(response.data);

        // Simulate API delay
        setTimeout(() => {
          setMentor(mockMentorProfile)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching mentor:", error)
        toast({
          title: "Error",
          description: "Failed to load mentor profile. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchMentor()
  }, [params.id, toast])

  const handleBookSession = async () => {
    if (!selectedSessionType || !selectedDate || !selectedTimeSlot) {
      toast({
        title: "Incomplete booking",
        description: "Please select a session type, date, and time slot.",
        variant: "destructive",
      })
      return
    }

    setBookingLoading(true)
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.post('/api/bookings', {
      //   mentorId: mentor.id,
      //   sessionType: selectedSessionType,
      //   date: selectedDate,
      //   timeSlot: selectedTimeSlot,
      //   note: bookingNote,
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Booking Successful",
        description: "Your session has been booked successfully.",
      })

      setShowBookingDialog(false)
      // Reset form
      setSelectedSessionType("")
      setSelectedTimeSlot("")
      setBookingNote("")
    } catch (error) {
      console.error("Error booking session:", error)
      toast({
        title: "Booking Failed",
        description: "Failed to book your session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBookingLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    if (!reviewComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please write a comment before submitting your review.",
        variant: "destructive",
      })
      return
    }

    setReviewLoading(true)
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.post(`/api/mentors/${mentor.id}/reviews`, {
      //   rating: reviewRating,
      //   comment: reviewComment,
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully.",
      })

      // Add the new review to the list
      const newReview = {
        id: Date.now(),
        user: {
          name: "You",
          image: "/placeholder.svg?height=40&width=40",
        },
        rating: reviewRating,
        date: new Date().toISOString().split("T")[0],
        comment: reviewComment,
      }

      setMentor({
        ...mentor,
        reviews: [newReview, ...mentor.reviews],
        reviewCount: mentor.reviewCount + 1,
        // Recalculate average rating
        rating: (mentor.rating * mentor.reviewCount + reviewRating) / (mentor.reviewCount + 1),
      })

      setShowReviewDialog(false)
      // Reset form
      setReviewRating(0)
      setReviewComment("")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Submission Failed",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setReviewLoading(false)
    }
  }

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !mentor) return []

    const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" })
    const availabilityForDay = mentor.availability.find((a: any) => a.day === dayOfWeek)

    return availabilityForDay ? availabilityForDay.slots : []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Skeleton className="h-[500px] w-full rounded-xl" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-[200px] w-full rounded-xl mb-6" />
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Mentor Not Found</h2>
          <p className="text-gray-400 mb-6">The mentor you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/dashboard/mentee")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-xl p-6 sticky top-24"
            >
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-md opacity-70"></div>
                  <Image
                    src={mentor.profilePicture || "/placeholder.svg"}
                    width={160}
                    height={160}
                    alt={mentor.name}
                    className="rounded-full border-2 border-gray-800 object-cover relative z-10"
                  />
                </div>

                {/* Name and Title */}
                <h1 className="text-2xl font-bold mb-1">{mentor.name}</h1>
                <p className="text-gray-400 mb-4">
                  {mentor.role} at {mentor.company}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-300">
                    {mentor.rating.toFixed(1)} ({mentor.reviewCount} reviews)
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-3 mb-6">
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    onClick={() => setShowBookingDialog(true)}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Book a Session
                  </Button>

                  <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>

                {/* Key Info */}
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-950/50 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Experience</p>
                      <p className="font-medium">{mentor.yearsOfExperience}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-950/50 flex items-center justify-center">
                      <Languages className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Languages</p>
                      <p className="font-medium">{mentor.languages.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-950/50 flex items-center justify-center">
                      <Video className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Session Rate</p>
                      <p className="font-medium">${mentor.hourlyRate}/hour</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8 bg-gray-900/50 p-1 rounded-lg">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 data-[state=active]:text-cyan-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 data-[state=active]:text-cyan-400"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-blue-500/20 data-[state=active]:text-cyan-400"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>About {mentor.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 whitespace-pre-line">{mentor.bio}</p>

                      <div className="mt-6">
                        <h3 className="text-sm uppercase text-gray-500 mb-3">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills.map((skill: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-gradient-to-r from-cyan-950/50 to-blue-950/50 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Session Types</CardTitle>
                      <CardDescription>Choose the type of session that works best for you</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mentor.sessionTypes.map((type: any) => (
                          <div
                            key={type.id}
                            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedSessionType(type.id)
                              setShowBookingDialog(true)
                            }}
                          >
                            <h3 className="font-medium mb-1">{type.name}</h3>
                            <div className="flex justify-between text-sm text-gray-400 mb-3">
                              <span>{type.duration} minutes</span>
                              <span>${type.price}</span>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full border-cyan-500 text-cyan-500 hover:bg-cyan-950"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Availability</CardTitle>
                      <CardDescription>When {mentor.name} is available for sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mentor.availability.map((day: any, index: number) => (
                          <div key={index} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                            <div className="font-medium w-32">{day.day}</div>
                            <div className="flex flex-wrap gap-2">
                              {day.slots.map((slot: string, slotIndex: number) => (
                                <Badge key={slotIndex} variant="outline" className="bg-gray-800 border-gray-700">
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        onClick={() => setShowBookingDialog(true)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Book a Session
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Work Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {mentor.workExperience.map((exp: any, index: number) => (
                          <div key={index} className="relative pl-8 pb-6 last:pb-0">
                            {index < mentor.workExperience.length - 1 && (
                              <div className="absolute left-3 top-3 bottom-0 w-0.5 bg-gray-800"></div>
                            )}
                            <div className="absolute left-0 top-3 h-6 w-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                            </div>
                            <div>
                              <h3 className="font-bold">{exp.role}</h3>
                              <p className="text-gray-400 mb-2">
                                {exp.company} • {exp.period}
                              </p>
                              <p className="text-gray-300">{exp.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Education & Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Education</h3>
                          <div className="space-y-4">
                            {mentor.education.map((edu: any, index: number) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-950/50 flex items-center justify-center shrink-0 mt-1">
                                  <Award className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{edu.degree}</h4>
                                  <p className="text-gray-400 text-sm">
                                    {edu.institution} • {edu.year}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-3">Certifications</h3>
                          <div className="space-y-4">
                            {mentor.certifications.map((cert: any, index: number) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-purple-950/50 flex items-center justify-center shrink-0 mt-1">
                                  <Award className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{cert.name}</h4>
                                  <p className="text-gray-400 text-sm">
                                    {cert.issuer} • {cert.year}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Rating Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3 flex flex-col items-center justify-center">
                          <div className="text-5xl font-bold mb-2">{mentor.rating.toFixed(1)}</div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.floor(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-400">{mentor.reviewCount} reviews</p>
                        </div>

                        <div className="md:w-2/3">
                          <Button
                            variant="outline"
                            className="w-full border-gray-700 hover:bg-gray-800 mb-4"
                            onClick={() => setShowReviewDialog(true)}
                          >
                            Write a Review
                          </Button>
                          <Progress value={(mentor.rating / 5) * 100} className="mb-4" />
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>0 stars</span>
                            <span>5 stars</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mentor.reviews.slice(0, showAllReviews ? mentor.reviews.length : 3).map((review: any) => (
                        <div key={review.id} className="border-b border-gray-800 pb-4 last:border-none">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.user.image} alt={review.user.name} />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.user.name}</div>
                              <div className="text-gray-400 text-sm">{new Date(review.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                        </div>
                      ))}

                      {mentor.reviews.length > 3 && !showAllReviews && (
                        <Button variant="link" className="text-sm" onClick={() => setShowAllReviews(true)}>
                          Show All Reviews ({mentor.reviewCount})
                        </Button>
                      )}

                      {mentor.reviews.length > 3 && showAllReviews && (
                        <Button variant="link" className="text-sm" onClick={() => setShowAllReviews(false)}>
                          Show Less
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Book a Session with {mentor.name}</DialogTitle>
            <DialogDescription>Choose a date and time slot that works best for you.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[1fr_2fr] items-center gap-4">
              <label htmlFor="session-type">Session Type</label>
              <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
                <SelectTrigger className="bg-gray-800 text-white">
                  <SelectValue placeholder="Select a session type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  {mentor.sessionTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.duration} minutes, ${type.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-[1fr_2fr] items-center gap-4">
              <label htmlFor="date">Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border bg-gray-800 text-white"
              />
            </div>

            <div className="grid grid-cols-[1fr_2fr] items-center gap-4">
              <label htmlFor="time-slot">Time Slot</label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger className="bg-gray-800 text-white">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  {getAvailableTimeSlots().map((slot: string, index: number) => (
                    <SelectItem key={index} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-[1fr_2fr] items-start gap-4">
              <label htmlFor="note">Note (optional)</label>
              <Textarea
                id="note"
                value={bookingNote}
                onChange={(e) => setBookingNote(e.target.value)}
                placeholder="Let the mentor know what you'd like to discuss"
                className="bg-gray-800 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleBookSession} disabled={bookingLoading}>
              {bookingLoading ? (
                <>
                  Booking...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Book Session"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Write a Review for {mentor.name}</DialogTitle>
            <DialogDescription>Share your experience to help other mentees.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[1fr_2fr] items-center gap-4">
              <label htmlFor="rating">Rating</label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 cursor-pointer ${i < reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                    onClick={() => setReviewRating(i + 1)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] items-start gap-4">
              <label htmlFor="comment">Comment</label>
              <Textarea
                id="comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review here"
                className="bg-gray-800 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleSubmitReview} disabled={reviewLoading}>
              {reviewLoading ? (
                <>
                  Submitting...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

