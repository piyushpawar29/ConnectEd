"use client"

import { motion } from "framer-motion"
import { Users, Clock, Award, BookOpen } from "lucide-react"

interface MentorshipStatsProps {
  mentor: any
}

export default function MentorshipStats({ mentor }: MentorshipStatsProps) {
  // Generate stats based on mentor data or use defaults
  const stats = [
    {
      label: "Mentees",
      value: mentor.menteeCount || Math.floor(Math.random() * 100) + 20,
      icon: <Users className="h-5 w-5 text-cyan-400" />,
      color: "bg-cyan-950/50",
    },
    {
      label: "Sessions",
      value: mentor.sessionCount || Math.floor(Math.random() * 200) + 50,
      icon: <Clock className="h-5 w-5 text-purple-400" />,
      color: "bg-purple-950/50",
    },
    {
      label: "Success Rate",
      value: `${mentor.successRate || 95}%`,
      icon: <Award className="h-5 w-5 text-blue-400" />,
      color: "bg-blue-950/50",
    },
    {
      label: "Topics",
      value: mentor.expertise?.length || 8,
      icon: <BookOpen className="h-5 w-5 text-green-400" />,
      color: "bg-green-950/50",
    },
  ]

  return (
    <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Mentorship Stats</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <div className={`h-16 w-16 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

