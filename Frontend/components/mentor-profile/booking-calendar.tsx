"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface BookingCalendarProps {
  mentor: any
  compact?: boolean
  selectedDate?: Date | undefined
  onDateSelect?: (date: Date | undefined) => void
  selectedTime?: string | null
  onTimeSelect?: (time: string | null) => void
}

export default function BookingCalendar({
  mentor,
  compact = false,
  selectedDate: propSelectedDate,
  onDateSelect,
  selectedTime: propSelectedTime,
  onTimeSelect
}: BookingCalendarProps) {
  // Use local state if no props are provided
  const [localDate, setLocalDate] = useState<Date | undefined>(new Date())
  const [localTime, setLocalTime] = useState<string | null>(null)
  
  // Use either the prop value or the local state
  const date = propSelectedDate !== undefined ? propSelectedDate : localDate
  const selectedTime = propSelectedTime !== undefined ? propSelectedTime : localTime
  
  // Handler for date changes
  const handleDateChange = (newDate: Date | undefined) => {
    if (onDateSelect) {
      onDateSelect(newDate)
    } else {
      setLocalDate(newDate)
    }
  }
  
  // Handler for time selection
  const handleTimeSelect = (time: string) => {
    if (onTimeSelect) {
      onTimeSelect(time)
    } else {
      setLocalTime(time)
    }
  }

  // Generate available time slots for the selected date based on mentor's availability
  const getAvailableTimeSlots = (date: Date | undefined) => {
    if (!date) return []

    const day = date.getDay()
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = dayNames[day]
    
    // Parse mentor's availability if it exists
    if (mentor && mentor.availability && Array.isArray(mentor.availability)) {
      // Find the availability for the selected day
      const dayAvailability = mentor.availability.find((a: { day: string; slots: string[] }) => a.day === dayName)
      
      // If there's availability for this day, return those slots
      if (dayAvailability && Array.isArray(dayAvailability.slots)) {
        return dayAvailability.slots
      }
    }
    
    // If no structured availability data, use the availability preference
    const availabilityPreference = mentor.communicationPreference || mentor.availability || 'Flexible'
    
    // Generate slots based on general availability preference
    const slots = []
    
    // Check if the day is compatible with the mentor's availability preference
    const isWeekend = day === 0 || day === 6
    const isWeekday = !isWeekend
    
    // If weekend and mentor is not available on weekends
    if (isWeekend && availabilityPreference === 'Weekdays') {
      return []
    }
    
    // If weekday and mentor is only available on weekends
    if (isWeekday && availabilityPreference === 'Weekends') {
      return []
    }
    
    // Generate time slots based on mentor availability preference
    
    // Morning slots (9 AM - 12 PM)
    if (availabilityPreference !== 'Evenings') {
      for (let hour = 9; hour < 12; hour++) {
        slots.push(`${hour}:00 AM`)
        slots.push(`${hour}:30 AM`)
      }
    }
    
    // Afternoon slots (12 PM - 5 PM)
    for (let hour = 12; hour < 17; hour++) {
      const formattedHour = hour === 12 ? 12 : hour - 12
      const period = 'PM'
      
      slots.push(`${formattedHour}:00 ${period}`)
      slots.push(`${formattedHour}:30 ${period}`)
    }
    
    // Evening slots (5 PM - 9 PM)
    if (availabilityPreference !== 'Mornings') {
      for (let hour = 17; hour < 21; hour++) {
        const formattedHour = hour - 12
        slots.push(`${formattedHour}:00 PM`)
        slots.push(`${formattedHour}:30 PM`)
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
    <div className="flex flex-col space-y-6">
      {/* Calendar section with a fixed height and scrollbar */}
      <div className="calendar-container bg-gray-900/50 rounded-lg border border-gray-800">
        <div className="h-[300px] overflow-y-auto custom-scrollbar">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={disabledDays}
            className="rounded-md bg-transparent"
          />
        </div>
      </div>
      
      {/* Time slots section with fixed height and scrollbar */}
      <div className="time-slots-container">
        {availableTimeSlots.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400 px-1">
              <Clock className="h-4 w-4" />
              <span>Available time slots for {date?.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            
            <div className="h-[200px] overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-2 gap-2">
                {availableTimeSlots.map((time: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`border-gray-700 hover:border-cyan-500 ${selectedTime === time ? "bg-cyan-950/50 border-cyan-500 text-cyan-400" : ""}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
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

