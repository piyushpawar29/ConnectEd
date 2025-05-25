"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  mentorId: string
  onSuccess: () => void
}

export default function ReviewForm({ mentorId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment before submitting your review",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Import the reviewAPI from our utility
      const { reviewAPI } = await import('@/lib/api');
      
      // Log the mentorId for debugging
      console.log('Submitting review for mentor with ID:', mentorId);
      
      if (!mentorId) {
        throw new Error('Mentor ID is missing or undefined');
      }
      
      try {
        // Use the addReview method with the correct field names expected by the backend
        const apiResponse = await reviewAPI.addReview(mentorId, {
          rating,
          text: comment // Send 'text' instead of 'comment' to match the Review model
        });
        
        console.log("Review submission response:", apiResponse.data);
        
        if (apiResponse.status !== 201 && apiResponse.status !== 200) {
          throw new Error(apiResponse.data.message || apiResponse.data.error || 'Failed to submit review');
        }
        
        return apiResponse;
      } catch (error: any) {
        console.error('Error in review API call:', error);
        
        // Get the error message
        const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review';
        
        // For other errors, try a direct API call as a fallback
        try {
          const token = localStorage.getItem('token');
          const directResponse = await fetch(`http://localhost:5001/api/mentors/${mentorId}/reviews`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rating, text: comment })
          });
          
          const responseData = await directResponse.json();
          console.log("Direct API response:", responseData);
          
          if (!directResponse.ok) {
            throw new Error(responseData.message || 'Failed to submit review');
          }
          
          return {
            status: directResponse.status,
            data: responseData
          };
        } catch (fallbackError) {
          console.error('Fallback API call failed:', fallbackError);
          throw error; // Throw the original error
        }
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      onSuccess()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-8 h-8 ${
                  (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <Textarea
          id="comment"
          placeholder="Share your experience with this mentor..."
          className="bg-gray-800 border-gray-700 focus:border-cyan-500 h-32"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  )
}

