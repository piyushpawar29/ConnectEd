"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "UX Designer",
    company: "Design Co.",
    image: "/placeholder.svg?height=80&width=80",
    stars: 5,
    text: "Finding a mentor who truly understands my career goals was a game-changer. The AI matching was spot-on, and my mentor has helped me navigate complex design challenges with ease. I've grown more in 3 months than I did in a year at my job!",
    category: "Design",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "Tech Innovations",
    image: "/placeholder.svg?height=80&width=80",
    stars: 5,
    text: "As someone looking to advance in my software engineering career, the guidance I've received through this platform has been invaluable. My mentor helped me prepare for senior-level interviews and provided actionable feedback on my coding projects.",
    category: "Technology",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Marketing Director",
    company: "Growth Labs",
    image: "/placeholder.svg?height=80&width=80",
    stars: 4,
    text: "I've been both a mentee and mentor on this platform, and the experience has been exceptional on both sides. The scheduling system makes it easy to find time even with my busy calendar. The platform's focus on meaningful connections sets it apart.",
    category: "Marketing",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Product Manager",
    company: "Product Sphere",
    image: "/placeholder.svg?height=80&width=80",
    stars: 5,
    text: "The personalized matching algorithm connected me with a mentor who had exactly the experience I needed. Within three months of mentorship, I successfully transitioned into a senior product role. The ROI on this platform is incredible!",
    category: "Product",
  },
]

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [direction, setDirection] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Infinite autoplay with pause on hover
  useEffect(() => {
    if (!autoplay || isHovering) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, isHovering])

  const next = () => {
    setAutoplay(false)
    setDirection(1)
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prev = () => {
    setAutoplay(false)
    setDirection(-1)
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
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
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  return (
    <div
      className="relative max-w-4xl mx-auto"
      ref={carouselRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl blur-3xl"></div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-50"></div>

        <div className="relative p-8 md:p-12 overflow-hidden">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={current}
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
              className="flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-md"></div>
                  <Avatar className="h-24 w-24 border-2 border-white">
                    <AvatarImage src={testimonials[current].image} alt={testimonials[current].name} />
                    <AvatarFallback>
                      {testimonials[current].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <h4 className="font-bold text-xl">{testimonials[current].name}</h4>
                  <p className="text-gray-400">
                    {testimonials[current].role} at {testimonials[current].company}
                  </p>

                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonials[current].stars ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>

                  <Badge className="mt-3 bg-gray-800 hover:bg-gray-700">{testimonials[current].category}</Badge>
                </div>
              </div>

              <div className="md:w-2/3">
                <svg
                  className="h-10 w-10 text-cyan-500/20 mb-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-gray-300 text-lg italic leading-relaxed">"{testimonials[current].text}"</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800 hover:border-cyan-500/50"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6">
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800 hover:border-cyan-500/50"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setAutoplay(false)
              setDirection(index > current ? 1 : -1)
              setCurrent(index)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-gradient-to-r from-cyan-500 to-purple-500 w-6" : "bg-gray-700 hover:bg-gray-600"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

