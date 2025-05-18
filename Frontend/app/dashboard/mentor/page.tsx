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
  profilePicture: string
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
  const { toast } = useToast()

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be actual API calls
        const profileResponse = await axios.get('/api/mentor/profile');
        const sessionsResponse = await axios.get('/api/mentor/sessions');

        setProfile(profileResponse.data);
        setUpcomingSessions(sessionsResponse.data);

        // Simulate API delay
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleProfileUpdate = async () => {
    setSaving(true)
    try {
      // In a real app, this would be an actual API call
      await axios.put('/api/mentor/profile', profile);

      // Simulate API delay
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pt-24 pb-16">
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
          <Link href="/logout" passHref>
            <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
              
              Logout
            </Button>
          </Link>
        </div>
      </div>

      </header>
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
            <Link href={`/mentor/${profile.id}`} passHref>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Profile Picture Section */}
                <div className="md:col-span-1">
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className="relative mb-4 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-md opacity-70"></div>
                        <Image
                          src={profile.profilePicture || "/placeholder.svg"}
                          alt={profile.name}
                          width={150}
                          height={150}
                          className="rounded-full border-2 border-gray-800 relative z-10"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Photo
                      </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <div className="w-full text-center">
                        <div className="flex justify-center mb-1">
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
                          {profile.rating} ({profile.reviewCount} reviews)
                        </p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm text-gray-400 mb-1">Member since</p>
                        <p className="font-medium">November 2023</p>
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                {/* Profile Details Section */}
                <div className="md:col-span-3">
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Profile Details</CardTitle>
                      <CardDescription>Update your profile information to help mentees find you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="bg-gray-800 border-gray-700"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="bg-gray-800 border-gray-700 min-h-[120px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills & Expertise</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profile.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-gray-800 border-gray-700 group hover:border-red-500/50"
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
                        <div className="flex gap-2">
                          <Input
                            id="newSkill"
                            placeholder="Add a skill"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                          <Button
                            variant="outline"
                            className="border-cyan-500 text-cyan-500 hover:bg-cyan-950"
                            onClick={handleAddSkill}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Select
                            value={profile.experience}
                            onValueChange={(value) => setProfile({ ...profile, experience: value })}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select years of experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="4-6">4-6 years</SelectItem>
                              <SelectItem value="7-10">7-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div> */}
                        <div className="space-y-2">
                          <Label htmlFor="communication">Preferred Communication Method</Label>
                          <Select
                            value={profile.communicationPreference}
                            onValueChange={(value) => setProfile({ ...profile, communicationPreference: value })}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700">
                              <SelectValue placeholder="Select communication method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">Video Call</SelectItem>
                              <SelectItem value="chat">Chat</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="languages">Languages</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profile.languages.map((language, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-gray-800 border-gray-700 group hover:border-red-500/50"
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
                        <div className="flex gap-2">
                          <Input
                            id="newLanguage"
                            placeholder="Add a language"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                          <Button
                            variant="outline"
                            className="border-cyan-500 text-cyan-500 hover:bg-cyan-950"
                            onClick={handleAddLanguage}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Availability</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h4 className="font-medium mb-2">Current Availability</h4>
                            {profile.availability.length > 0 ? (
                              <div className="space-y-3">
                                {profile.availability.map((day, dayIndex) => (
                                  <div key={dayIndex}>
                                    <h5 className="text-sm font-medium text-gray-400">{day.day}</h5>
                                    <div className="flex flex-wrap gap-2 mt-1">
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

                          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h4 className="font-medium mb-2">Add Time Slot</h4>
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="day" className="text-sm">
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
                                <Label htmlFor="time" className="text-sm">
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
                    <CardFooter>
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sessions">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800">
                    <CardHeader>
                      <CardTitle>Upcoming Sessions</CardTitle>
                      <CardDescription>Your scheduled mentoring sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {upcomingSessions.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingSessions.map((session) => (
                            <div
                              key={session.id}
                              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-cyan-500/50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    <AvatarImage src={session.menteeImage} alt={session.menteeName} />
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
                                <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-950">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Session
                                </Button>
                                <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
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
                      <CardTitle>Calendar</CardTitle>
                      <CardDescription>View your schedule</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border border-gray-800 bg-gray-900/50"
                      />

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">
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
                          <div className="space-y-2">
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
                                <div key={session.id} className="bg-gray-800 rounded p-2 border border-gray-700">
                                  <p className="font-medium text-sm">{session.topic}</p>
                                  <div className="flex justify-between text-xs text-gray-400 mt-1">
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
                          <p className="text-gray-500 text-sm">No sessions scheduled for this day</p>
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

