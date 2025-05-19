import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if in browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Handle 401 Unauthorized errors (token expired, etc.)
      if (error.response.status === 401) {
        // Clear token and redirect to login if in browser
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          // Redirect to login page
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  },
)

// Authentication APIs
export const authAPI = {
  register: (userData: any) => api.post("/auth/register", userData),
  login: (credentials: { email: string; password: string }) => api.post("/auth/login", credentials),
  logout: () => api.get("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (data: any) => api.put("/auth/updatedetails", data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put("/auth/updatepassword", data),
}

// Mentor APIs
export const mentorAPI = {
  getAllMentors: (params?: any) => api.get("/mentors", { params }),
  getMentor: (id: string) => api.get(`/mentors/${id}`),
  getMentorProfile: () => api.get("/mentors/profile"),
  updateMentorProfile: (data: any) => api.put("/mentors/profile", data),
  getMentorReviews: (mentorId: string) => api.get(`/mentors/${mentorId}/reviews`),
}

// Mentee APIs
export const menteeAPI = {
  getMenteeProfile: () => api.get("/mentees/profile"),
  updateMenteeProfile: (data: any) => api.put("/mentees/profile", data),
  getConnectedMentors: () => api.get("/mentees/mentors"),
  connectWithMentor: (mentorId: string) => api.post(`/mentees/connect/${mentorId}`),
  disconnectFromMentor: (mentorId: string) => api.delete(`/mentees/disconnect/${mentorId}`),
}

// Session APIs
export const sessionAPI = {
  getSessions: () => api.get("/sessions"),
  getSession: (id: string) => api.get(`/sessions/${id}`),
  createSession: (data: any) => api.post("/sessions", data),
  updateSession: (id: string, data: any) => api.put(`/sessions/${id}`, data),
  deleteSession: (id: string) => api.delete(`/sessions/${id}`),
  updateSessionStatus: (id: string, status: string) => 
    api.put(`/sessions/${id}/status`, { status }),
}

// Review APIs
export const reviewAPI = {
  addReview: (mentorId: string, data: any) => api.post(`/mentors/${mentorId}/reviews`, data),
  updateReview: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
}

// Message APIs
export const messageAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getMessages: (userId: string) => api.get(`/messages/${userId}`),
  sendMessage: (data: any) => api.post("/messages", data),
  deleteMessage: (id: string) => api.delete(`/messages/${id}`),
  getUnreadCount: () => api.get("/messages/unread"),
}

export default api

