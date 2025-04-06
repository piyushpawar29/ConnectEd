"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

const categories = ["Technology", "Business", "Design", "Marketing", "Product", "Career", "Leadership", "Finance"]

interface Mentor {
  id: number
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
}

export default function MentorSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [experienceLevel, setExperienceLevel] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mentors, setMentors] = useState<Mentor[]>([])

  const popularTags = [
    "JavaScript",
    "React",
    "UX Design",
    "Product Management",
    "Leadership",
    "Career Change",
    "Startup",
    "AI",
  ]

  // Fetch mentors when filters change
  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true)
      try {
        const params: Record<string, string> = {}

        if (searchTerm) params.query = searchTerm
        if (selectedCategory) params.category = selectedCategory
        if (priceRange[0] > 0) params.minPrice = priceRange[0].toString()
        if (priceRange[1] < 300) params.maxPrice = priceRange[1].toString()
        if (experienceLevel) params.experienceLevel = experienceLevel

        const response = await axios.get("/api/mentors", { params })
        setMentors(response.data.mentors || []) // Ensure we set an empty array if response.data.mentors is undefined
      } catch (error) {
        console.error("Error fetching mentors:", error)
        setMentors([]) // Set to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce the search to avoid too many requests
    const handler = setTimeout(() => {
      fetchMentors()
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, selectedCategory, priceRange, experienceLevel, selectedTags])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setPriceRange([0, 300])
    setExperienceLevel("")
    setSelectedTags([])
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl blur-3xl"></div>

        <div className="relative p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for mentors by name, skill, or expertise..."
                className="pl-10 bg-gray-800 border-gray-700 focus:border-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-gray-700 hover:border-cyan-500 hover:bg-gray-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(selectedCategory ||
                  experienceLevel ||
                  selectedTags.length > 0 ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 300) && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center text-xs text-white font-medium">
                    {(selectedCategory ? 1 : 0) +
                      (experienceLevel ? 1 : 0) +
                      selectedTags.length +
                      (priceRange[0] > 0 || priceRange[1] < 300 ? 1 : 0)}
                  </span>
                )}
              </Button>

              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-800"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filter Mentors</h3>
                <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-white" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Experience Level</label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Price Range ($/hour)</label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 300]}
                      max={300}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-5"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Availability</label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm text-gray-400 mb-2 block">Popular Tags</label>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`cursor-pointer ${
                        selectedTags.includes(tag)
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Search results preview */}
          {isLoading ? (
            <div className="mt-4 flex justify-center">
              <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
            </div>
          ) : mentors && mentors.length > 0 && searchTerm ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <p className="text-sm text-gray-400 mb-2">Found {mentors.length} mentors matching your search</p>
              <div className="flex gap-2 flex-wrap">
                {mentors.slice(0, 3).map((mentor) => (
                  <Badge key={mentor.id} className="bg-gray-700 hover:bg-gray-600">
                    {mentor.name} - {mentor.role}
                  </Badge>
                ))}
                {mentors.length > 3 && (
                  <Badge variant="outline" className="border-gray-600">
                    +{mentors.length - 3} more
                  </Badge>
                )}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

