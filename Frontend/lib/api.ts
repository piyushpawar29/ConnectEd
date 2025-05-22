import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Create a separate instance for frontend API routes
const frontendApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add the same request interceptor to frontendApi
frontendApi.interceptors.request.use(
  (config) => {
    // Get token from localStorage if in browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        
        // Also ensure token is set in cookie for server-side API routes
        const cookieExists = document.cookie.split(';').some(item => item.trim().startsWith('token='))
        if (!cookieExists) {
          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if in browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        
        // Also ensure token is set in cookie for server-side API routes
        const cookieExists = document.cookie.split(';').some(item => item.trim().startsWith('token='))
        if (!cookieExists) {
          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        }
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
  // Use frontendApi for client-side requests
  getAllMentors(params?: any) {
    return api.get("/mentors", { params })
  },
  getMentor(id: string) {
    return api.get(`/mentors/${id}`)
  },
  getMentorProfile() {
    return api.get("/mentors/profile")
  },
  updateMentorProfile(data: any) {
    return api.put("/mentors/profile", data)
  },
  getMentorReviews(mentorId: string) {
    return api.get(`/reviews/${mentorId}`)
  },
  submitReview(mentorId: string, data: { rating: number, comment: string }) {
    return api.post(`/mentors/${mentorId}/reviews`, data)
  },
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
  // Use frontendApi for client-side requests
  getSessions() {
    return api.get("/sessions")
  },
  getMenteeSessions() {
    return api.get("/mentee/sessions")
  },
  getMentorSessions() {
    return api.get("/mentor/sessions")
  },
  getSession(id: string) {
    return api.get(`/sessions/${id}`)
  },
  createSession(data: any) {
    return api.post("/sessions", data)
  },
  bookSession(data: {
    mentor: string,
    title: string,
    description?: string,
    date: string,
    duration: number,
    communicationType: string
  }) {
    return api.post("/sessions", data)
  },
  updateSession(id: string, data: any) {
    return api.put(`/sessions/${id}`, data)
  },
  deleteSession(id: string) {
    return api.delete(`/sessions/${id}`)
  },
  updateSessionStatus(id: string, status: string) {
    return api.put(`/sessions/${id}/status`, { status })
  },
}

// Review APIs
export const reviewAPI = {
  // Use frontendApi for client-side requests
  addReview(mentorId: string, data: any) {
    return api.post(`/reviews/${mentorId}`, data)
  },
  updateReview(id: string, data: any) {
    return api.put(`/reviews/${id}`, data)
  },
  deleteReview(id: string) {
    return api.delete(`/reviews/${id}`)
  },
}

// Message APIs
export const messageAPI = {
  getConversations: () =>  api.get("/messages/conversations"),
  getMessages: (userId: string) => api.get(`/messages/${userId}`),
  sendMessage: (data: any) => api.post("/messages", data),
  deleteMessage: (id: string) => api.delete(`/messages/${id}`),
  getUnreadCount: () => api.get("/messages/unread"),
}

export default api

