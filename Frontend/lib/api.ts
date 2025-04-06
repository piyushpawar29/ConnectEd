import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
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

// API endpoints
export const mentorApi = {
  // Get all mentors with optional filters
  getMentors: (filters = {}) => api.get("/mentors", { params: filters }),

  // Get a specific mentor by ID
  getMentorById: (id: string) => api.get(`/mentors/${id}`),

  // Search mentors by query
  searchMentors: (query: string) => api.get("/mentors/search", { params: { query } }),

  // Get mentor availability
  getMentorAvailability: (id: string, startDate: string, endDate: string) =>
    api.get(`/mentors/${id}/availability`, { params: { startDate, endDate } }),
}

export const sessionApi = {
  // Book a session with a mentor
  bookSession: (data: any) => api.post("/sessions", data),

  // Get user's upcoming sessions
  getUpcomingSessions: () => api.get("/sessions/upcoming"),

  // Get user's past sessions
  getPastSessions: () => api.get("/sessions/past"),

  // Cancel a session
  cancelSession: (id: string) => api.delete(`/sessions/${id}`),

  // Reschedule a session
  rescheduleSession: (id: string, data: any) => api.put(`/sessions/${id}/reschedule`, data),
}

export const userApi = {
  // Register a new user
  register: (data: any) => api.post("/auth/register", data),

  // Login user
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),

  // Get current user profile
  getProfile: () => api.get("/users/me"),

  // Update user profile
  updateProfile: (data: any) => api.put("/users/me", data),

  // Change password
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/users/me/password", { currentPassword, newPassword }),
}

export default api

