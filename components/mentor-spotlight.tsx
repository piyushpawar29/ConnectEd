"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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
    expertise: ["Machine Learning", "Neural Networks", "Computer Vision"],
    bio: "Former lead AI researcher with 10+ years of experience helping aspiring AI practitioners develop cutting-edge skills.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Product Manager",
    company: "ProductSphere",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviews: 93,
    expertise: ["Product Strategy", "User Research", "Roadmapping"],
    bio: "Product leader with experience at Amazon and Airbnb, specializing in helping product managers level up their skills.",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "UX Design Director",
    company: "DesignCo",
    image: "/placeholder.svg?height=400&width=300",
    rating: 5.0,
    reviews: 156,
    expertise: ["UX Strategy", "Design Systems", "User Testing"],
    bio: "Award-winning design leader passionate about helping designers develop both craft and leadership skills.",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Engineering Manager",
    company: "TechGrowth",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviews: 84,
    expertise: ["Engineering Leadership", "System Architecture", "Team Building"],
    bio: "Engineering leader with 15+ years of experience helping engineers navigate technical and leadership challenges.",
  },
]

export default function MentorSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mentors.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextMentor = () => {
    setIsAutoPlaying(false)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mentors.length)
  }

  const prevMentor = () => {
    setIsAutoPlaying(false)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mentors.length) % mentors.length)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Custom ease curve for smoother motion
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110"
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
          className="h-10 w-10 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110"
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
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 1,
            }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="relative group cursor-pointer overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-lg"></div>
              <Image
                src={mentors[currentIndex].image || "/placeholder.svg"}
                width={300}
                height={400}
                alt={mentors[currentIndex].name}
                className="relative z-10 rounded-xl w-full object-cover h-[400px] transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
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

              <Link href={`/mentor/${mentors[currentIndex].id}`} passHref>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  View Full Profile
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {mentors.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false)
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

