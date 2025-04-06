"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Send, User, Bot, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatWidgetProps {
  onClose: () => void
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi there! I'm the MentorAI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'd be happy to help you find the right mentor for your needs. Could you tell me more about what skills or expertise you're looking for?",
        "That's a great question! Our mentors specialize in a variety of fields including technology, business, design, marketing, and more. Is there a specific area you're interested in?",
        "Our pricing plans are designed to be flexible. You can start with a free trial session before committing to a subscription. Would you like me to explain the different plans?",
        "I can definitely help you get started! The first step is to create an account and complete your profile so we can match you with the right mentors.",
        "Thanks for your interest! I've noted your question and one of our mentorship experts will reach out to you shortly with more information.",
      ]

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-24 right-6 w-full max-w-md h-[500px] bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-40 flex flex-col"
    >
      <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-sm opacity-70"></div>
            <div className="relative h-8 w-8 bg-gray-900 rounded-full border border-cyan-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-cyan-500" />
            </div>
          </div>
          <div>
            <h3 className="font-medium">MentorAI Assistant</h3>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-800" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className={`h-8 w-8 ${message.sender === "bot" ? "bg-cyan-950 text-cyan-500" : "bg-gray-800"}`}>
                {message.sender === "bot" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8 bg-cyan-950 text-cyan-500">
                <Bot className="h-4 w-4" />
              </Avatar>
              <div>
                <div className="rounded-lg p-3 bg-gray-800 text-gray-200">
                  <div className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce animation-delay-200">•</span>
                    <span className="animate-bounce animation-delay-400">•</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-800">
            <Paperclip className="h-5 w-5 text-gray-400" />
          </Button>
          <Input
            placeholder="Type your message..."
            className="bg-gray-800 border-gray-700"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-800">
            <Smile className="h-5 w-5 text-gray-400" />
          </Button>
          <Button
            className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 p-0"
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ""}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

