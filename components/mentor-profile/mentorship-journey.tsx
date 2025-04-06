"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Award, CheckCircle } from "lucide-react"

interface MentorshipJourneyProps {
  mentor: any
}

export default function MentorshipJourney({ mentor }: MentorshipJourneyProps) {
  const steps = [
    {
      title: "Initial Consultation",
      description: "Begin with a discovery call to understand your goals and challenges.",
      icon: <BookOpen className="h-5 w-5 text-cyan-400" />,
      color: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      title: "Personalized Plan",
      description: "Receive a tailored mentorship plan based on your specific needs.",
      icon: <Users className="h-5 w-5 text-purple-400" />,
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      title: "Regular Sessions",
      description: "Engage in ongoing sessions to implement strategies and track progress.",
      icon: <Award className="h-5 w-5 text-blue-400" />,
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      title: "Growth & Achievement",
      description: "Celebrate milestones and continue evolving your skills and career.",
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      color: "from-green-500/20 to-green-500/5",
    },
  ]

  return (
    <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Mentorship Journey</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute top-10 left-10 w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-800 hidden md:block"></div>
            )}

            {/* Step content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`h-20 w-20 rounded-full bg-gradient-to-b ${step.color} flex items-center justify-center mb-4`}
              >
                <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center">{step.icon}</div>
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

