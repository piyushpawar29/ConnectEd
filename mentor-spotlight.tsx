"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Calendar, Video, MessageSquare } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "AI Research Scientist",
    company: "TechInnovate",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 120,
    expertise: ["Machine Learning", "Neural Networks", "Computer Vision", "Research Methods"],
    bio: "Former lead AI researcher at Google with 10+ years of experience in machine learning and neural networks. I help aspiring AI researchers and practitioners develop cutting-edge skills and navigate their career path.",
    availability: "Evenings & Weekends",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Product Manager",
    company: "ProductSphere",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviews: 93,
    hourlyRate: 95,
    expertise: ["Product Strategy", "User Research", "Roadmapping", "Go-to-Market"],
    bio: "Product leader with experience at Amazon, Airbnb, and two successful startups. I specialize in helping product managers level up their skills and advance their careers through practical, real-world guidance.",
    availability: "Weekdays",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "UX Design Director",
    company: "DesignCo",
    image: "/placeholder.svg?height=400&width=300",
    rating: 5.0,
    reviews: 156,
    hourlyRate: 110,
    expertise: ["UX Strategy", "Design Systems", "User Testing", "Design Leadership"],
    bio: "Award-winning design leader who has built and led design teams at Spotify and Netflix. I'm passionate about helping designers develop both their craft and leadership skills to create meaningful impact.",
    availability: "Flexible",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Engineering Manager",
    company: "TechGrowth",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviews: 84,
    hourlyRate: 100,
    expertise: ["Engineering Leadership", "System Architecture", "Team Building", "Career Development"],
    bio: "Engineering leader with 15+ years of experience scaling teams and systems at Microsoft and Stripe. I help engineers and engineering managers navigate technical and leadership challenges.",
    availability: "Weekday Evenings",
  },
]

export default function MentorSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextMentor = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mentors.length)
  }

  const prevMentor = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mentors.length) % mentors.length)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800 hover:border-cyan-500/50"
          onClick={prevMentor}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800 hover:border-cyan-500/50"
          onClick={nextMentor}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="relative group cursor-pointer overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-lg"></div>
              <Image
                src={mentors[currentIndex].image || "/placeholder.svg"}
                width={300}
                height={400}
                alt={mentors[currentIndex].name}
                className="relative z-10 rounded-xl w-full object-cover h-[400px] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-cyan-500/80 hover:bg-cyan-500 text-white">Top Mentor</Badge>
                  <Badge className="bg-gray-800/80 hover:bg-gray-800 text-gray-200">
                    {mentors[currentIndex].availability}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(mentors[currentIndex].rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300">
                    {mentors[currentIndex].rating} ({mentors[currentIndex].reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-cyan-500">
                  <AvatarImage src={mentors[currentIndex].image} alt={mentors[currentIndex].name} />
                  <AvatarFallback>
                    {mentors[currentIndex].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{mentors[currentIndex].name}</h3>
                  <p className="text-gray-400">
                    {mentors[currentIndex].role} at {mentors[currentIndex].company}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{mentors[currentIndex].bio}</p>

              <div className="mb-6">
                <h4 className="text-sm uppercase text-gray-500 mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mentors[currentIndex].expertise.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-400">Hourly Rate</p>
                  <p className="text-xl font-bold">${mentors[currentIndex].hourlyRate}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-400">Sessions</p>
                  <p className="text-xl font-bold">30-90 min</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-400">Languages</p>
                  <p className="text-xl font-bold">English</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Session
                </Button>
                <Button variant="outline" className="flex-1 border-gray-700 hover:bg-gray-800">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" className="flex-1 border-gray-700 hover:bg-gray-800">
                  <Video className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {mentors.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 w-6"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            aria-label={`Go to mentor ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

