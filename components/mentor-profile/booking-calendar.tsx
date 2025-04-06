"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface BookingCalendarProps {
  mentor: any
  compact?: boolean
}

export default function BookingCalendar({ mentor, compact = false }: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate available time slots for the selected date
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return []

    // This would normally come from an API based on the mentor's availability
    // For demo purposes, we'll generate some random slots
    const day = date.getDay()

    // If weekend and mentor is not available on weekends
    if ((day === 0 || day === 6) && mentor.availability !== "Weekends" && mentor.availability !== "Flexible") {
      return []
    }

    // If weekday and mentor is not available on weekdays
    if (day >= 1 && day <= 5 && mentor.availability === "Weekends") {
      return []
    }

    // Generate time slots based on mentor availability
    const slots = []

    // Morning slots (9 AM - 12 PM)
    if (mentor.availability !== "Evenings") {
      for (let hour = 9; hour < 12; hour++) {
        // Skip some slots randomly to simulate unavailability
        if (Math.random() > 0.3) {
          slots.push(`${hour}:00 AM`)
        }
        if (Math.random() > 0.3) {
          slots.push(`${hour}:30 AM`)
        }
      }
    }

    // Afternoon slots (12 PM - 5 PM)
    for (let hour = 12; hour < 17; hour++) {
      const formattedHour = hour === 12 ? 12 : hour - 12
      const period = hour === 12 ? "PM" : "PM"

      // Skip some slots randomly to simulate unavailability
      if (Math.random() > 0.3) {
        slots.push(`${formattedHour}:00 ${period}`)
      }
      if (Math.random() > 0.3) {
        slots.push(`${formattedHour}:30 ${period}`)
      }
    }

    // Evening slots (5 PM - 9 PM)
    if (mentor.availability !== "Weekdays") {
      for (let hour = 17; hour < 21; hour++) {
        const formattedHour = hour - 12

        // Skip some slots randomly to simulate unavailability
        if (Math.random() > 0.3) {
          slots.push(`${formattedHour}:00 PM`)
        }
        if (Math.random() > 0.3) {
          slots.push(`${formattedHour}:30 PM`)
        }
      }
    }

    return slots
  }

  const availableTimeSlots = getAvailableTimeSlots(date)

  // Function to disable dates in the past
  const disabledDays = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className={`grid ${compact ? "grid-cols-1" : "md:grid-cols-2"} gap-6`}>
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDays}
          className="rounded-md border border-gray-800 bg-gray-900/50"
        />
      </div>

      <div>
        {availableTimeSlots.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Available time slots</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableTimeSlots.map((time, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`border-gray-700 hover:border-cyan-500 ${selectedTime === time ? "bg-cyan-950/50 border-cyan-500 text-cyan-400" : ""}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <Clock className="h-10 w-10 text-gray-500 mb-3" />
            <h3 className="font-medium mb-1">No availability</h3>
            <p className="text-gray-400 text-sm mb-4">
              {mentor.name} is not available on this date. Please select another date.
            </p>
            <Badge className="bg-gray-700 text-gray-300">{mentor.availability || "Flexible"} availability</Badge>
          </div>
        )}
      </div>
    </div>
  )
}

