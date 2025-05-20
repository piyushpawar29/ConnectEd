"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import zxcvbn from "zxcvbn"
import { motion } from "framer-motion"
import { X, Mail, Lock, User, ChromeIcon as Google, Briefcase, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { redirectToDashboard } from "@/utils/navigation"

interface AuthModalProps {
  type: "login" | "signup"
  onClose: () => void
  onSwitchType: (type: "login" | "signup") => void
}

export default function AuthModal({ type, onClose, onSwitchType }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState<"mentee" | "mentor" | "">("")
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  // Mentor profile fields
  const [bio, setBio] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [experience, setExperience] = useState("")
  const [languages, setLanguages] = useState<string[]>([])
  const [communicationPreference, setCommunicationPreference] = useState<string>("")
  const [categoryValue, setCategoryValue] = useState("Technology")

  // Mentee profile fields
  const [interests, setInterests] = useState<string[]>([])
  const [goals, setGoals] = useState("")
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([])

  const router = useRouter()

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordError, setPasswordError] = useState("")

  // Direct form submission functions to avoid recursive issues
  const submitMentorForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("Submitting mentor form directly");
    
    if (loading) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Extract company name from experience text if available
      const companyMatch = experience.match(/at\s+([^,\.]+)/i);
      const company = companyMatch ? companyMatch[1].trim() : 'Independent';
      
      const userData = {
        name,
        email,
        password,
        role: "mentor",
        bio, 
        skills,
        experience,
        languages,
        communicationPreference,
        company,
        hourlyRate: 50,
        category: categoryValue,
        expertise: skills
      };
      
      console.log("Sending mentor registration data:", userData);
      
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
      });
      
      const responseText = await res.text();
      console.log("Registration response status:", res.status, "text:", responseText);
      
      try {
        const data = JSON.parse(responseText);
        
        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }
        
        // Success! Store token and redirect
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Display success message
          setLoading(false);
          setError(""); // Clear any errors
          
          // Show success UI with login prompt
          const successMessage = `
            Registration successful! 
            
            Please login with your new account credentials.
          `;
          
          // Create success element and display it
          const successDiv = document.createElement('div');
          successDiv.innerHTML = successMessage;
          successDiv.style.padding = '1rem';
          successDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          successDiv.style.border = '1px solid rgb(16, 185, 129)';
          successDiv.style.borderRadius = '0.5rem';
          successDiv.style.marginTop = '1rem';
          successDiv.style.marginBottom = '1rem';
          
          // Find form container and insert success message
          const formContainer = document.querySelector('form');
          if (formContainer) {
            formContainer.innerHTML = '';
            formContainer.appendChild(successDiv);
          }
          
          // Switch to login tab after short delay
          setTimeout(() => {
            onSwitchType("login");
          }, 1500);
        } else {
          throw new Error("No token received");
        }
      } catch (err: any) {
        console.error("Error parsing response:", err);
        setError(err.message || "Failed to process response");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  
  const submitMenteeForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("Submitting mentee form directly");
    
    if (loading) return;
    
    setLoading(true);
    setError("");
    
    try {
      const userData = {
        name,
        email,
        password,
        role: "mentee",
        interests,
        goals,
        preferredLanguages,
        educationLevel: 'Other',
        preferredCommunication: 'Any'
      };
      
      console.log("Sending mentee registration data:", userData);
      
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
      });
      
      const responseText = await res.text();
      console.log("Registration response status:", res.status, "text:", responseText);
      
      try {
        const data = JSON.parse(responseText);
        
        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }
        
        // Success! Store token and redirect
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Display success message
          setLoading(false);
          setError(""); // Clear any errors
          
          // Show success UI with login prompt
          const successMessage = `
            Registration successful! 
            
            Please login with your new account credentials.
          `;
          
          // Create success element and display it
          const successDiv = document.createElement('div');
          successDiv.innerHTML = successMessage;
          successDiv.style.padding = '1rem';
          successDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          successDiv.style.border = '1px solid rgb(16, 185, 129)';
          successDiv.style.borderRadius = '0.5rem';
          successDiv.style.marginTop = '1rem';
          successDiv.style.marginBottom = '1rem';
          
          // Find form container and insert success message
          const formContainer = document.querySelector('form');
          if (formContainer) {
            formContainer.innerHTML = '';
            formContainer.appendChild(successDiv);
          }
          
          // Switch to login tab after short delay
          setTimeout(() => {
            onSwitchType("login");
          }, 1500);
        } else {
          throw new Error("No token received");
        }
      } catch (err: any) {
        console.error("Error parsing response:", err);
        setError(err.message || "Failed to process response");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted - current state:", { type, showRoleSelection, showProfileForm, userRole })

    // Prevent multiple submissions
    if (loading) {
      console.log("Submission already in progress, ignoring request");
      return;
    }

    // First screen - basic info
    if (type === "signup" && !showRoleSelection) {
      setShowRoleSelection(true)
      return
    }

    // Second screen - role selection
    if (type === "signup" && showRoleSelection && !showProfileForm && userRole) {
      setShowProfileForm(true)
      return
    }

    // Password strength check
    if (type === "signup" && passwordStrength < 3) {
      setPasswordError("Password is too weak. Use a mix of letters, numbers, and symbols.")
      return
    }

    // IMPORTANT: Only reach here when actually submitting the final form data
    console.log("Proceeding with final form submission");
    setLoading(true)
    setError("")
    

    try {
      if (type === "login") {
        try {
          console.log("Attempting login with:", { email, password })
          const res = await fetch("http://localhost:5001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })

          const data = await res.json()
          console.log("Login response:", data)

          if (!res.ok) {
            throw new Error(data.message || "Invalid email or password")
          }

          // Store token in localStorage
          if (data.token) {
            localStorage.setItem('token', data.token);
          }

          onClose()
          
          // Redirect based on user role
          if (data.user.role === 'mentor') {
            router.push('/dashboard/mentor')
          } else {
            router.push('/dashboard/mentee')
          }
        } catch (error: any) {
          console.error("Login error:", error)
          setError(error.message || "Invalid email or password")
        }
      } else {
        // Signup form submission - final screen with profile info
        console.log("Processing registration - current state:", { 
          userRole, 
          mentor: { bio, skills, experience, languages, communicationPreference },
          mentee: { interests, goals, preferredLanguages }
        })
        
        // Validate required fields first
        if (userRole === "mentor") {
          if (!bio) {
            setError("Please provide your professional bio");
            setLoading(false);
            return;
          }
          if (skills.length === 0) {
            setError("Please select at least one skill");
            setLoading(false);
            return;
          }
          if (!experience) {
            setError("Please provide your experience details");
            setLoading(false);
            return;
          }
          if (languages.length === 0) {
            setError("Please select at least one language");
            setLoading(false);
            return;
          }
          if (!communicationPreference) {
            setError("Please select your preferred communication method");
            setLoading(false);
            return;
          }
        } else if (userRole === "mentee") {
          if (interests.length === 0) {
            setError("Please select at least one area of interest");
            setLoading(false);
            return;
          }
          if (!goals) {
            setError("Please describe your learning goals");
            setLoading(false);
            return;
          }
          if (preferredLanguages.length === 0) {
            setError("Please select at least one preferred language");
            setLoading(false);
            return;
          }
        }

        // Extract company name from experience text if available
        const companyMatch = experience.match(/at\s+([^,\.]+)/i);
        const company = companyMatch ? companyMatch[1].trim() : 'Independent';

        // Create appropriate data structure based on role
        let userData;
        if (userRole === "mentor") {
          userData = {
            name,
            email,
            password,
            role: userRole,
            bio, 
            skills,
            experience,
            languages,
            communicationPreference,
            company,
            hourlyRate: 50,
            category: categoryValue,
            expertise: skills
          };
        } else {
          userData = {
            name,
            email,
            password,
            role: userRole,
            interests,
            goals,
            preferredLanguages,
            educationLevel: 'Other',
            preferredCommunication: 'Any'
          };
        }

        console.log("Attempting registration with:", userData)
        
        try {
          // Show the user what's happening
          setLoading(true);
          setError("");
          
          console.log("Sending registration request to:", "http://localhost:5001/api/auth/register");
          const res = await fetch("http://localhost:5001/api/auth/register", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(userData),
          }).catch(err => {
            console.error("Network error during fetch:", err);
            throw new Error("Network error: Please check your connection and try again");
          });

          console.log("Registration response status:", res.status);
          let responseText;
          try {
            responseText = await res.text();
            console.log("Raw response text:", responseText);
            
            // Try to parse the response as JSON
            let data;
            try {
              data = JSON.parse(responseText);
              console.log("Registration response data:", data);
            } catch (parseErr) {
              console.error("Failed to parse response as JSON:", parseErr);
              throw new Error("The server returned an invalid response. Please try again later.");
            }

            if (!res.ok) {
              // Extract validation error message if available
              if (data.message && data.message.includes("validation failed")) {
                const errorField = data.message.split("validation failed:")[1]?.trim() || "";
                throw new Error(`Validation error: ${errorField}. Please check your form.`);
              } else {
                throw new Error(data.message || "Failed to register user")
              }
            }

            // Store token in localStorage
            if (data.token) {
              localStorage.setItem('token', data.token);
              console.log("Token stored in localStorage, preparing to redirect user");
              
              // Store user data for easier access
              localStorage.setItem('user', JSON.stringify(data.user));
              
              // Clear any form errors
              setError("");
              
              // Show success UI with login prompt
              const successMessage = `
                Registration successful! 
                
                Please login with your new account credentials.
              `;
              
              // Create success element and display it
              const successDiv = document.createElement('div');
              successDiv.innerHTML = successMessage;
              successDiv.style.padding = '1rem';
              successDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
              successDiv.style.border = '1px solid rgb(16, 185, 129)';
              successDiv.style.borderRadius = '0.5rem';
              successDiv.style.marginTop = '1rem';
              successDiv.style.marginBottom = '1rem';
              
              // Find form container and insert success message
              const formContainer = document.querySelector('form');
              if (formContainer) {
                formContainer.innerHTML = '';
                formContainer.appendChild(successDiv);
              }
              
              // Switch to login tab after short delay
              setTimeout(() => {
                onSwitchType("login");
              }, 1500);
            } else {
              setError("Registration successful but no token received. Please try logging in.");
              setLoading(false);
            }
          } catch (parseError: any) {
            console.error("Error processing response:", parseError);
            setError(`Error processing server response: ${parseError.message}`);
            setLoading(false);
          }
        } catch (error: any) {
          console.error("Registration error:", error)
          // Check for network errors which could indicate CORS issues
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            setError("Network error: Unable to connect to the server. This could be due to CORS issues or the server is down.")
          } else {
            setError(error.message || "An unexpected error occurred")
          }
          setLoading(false);
        }
      } 
    } catch (error: any) {
      console.error("Form submission error:", error)
      setError(error.message || "An unexpected error occurred")
      setLoading(false);
    } finally {
      // Note: We're not setting loading to false here because we want to keep
      // the loading state active until we either redirect or handle an error above
    }
  }

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">I want to join as a:</h3>

      <RadioGroup value={userRole} onValueChange={(value) => setUserRole(value as "mentee" | "mentor")}>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`flex flex-col items-center p-4 rounded-lg border ${userRole === "mentee" ? "border-cyan-500 bg-cyan-950/20" : "border-gray-700"} cursor-pointer transition-all duration-200`}
            onClick={() => setUserRole("mentee")}
          >
            <GraduationCap className="h-10 w-10 mb-3 text-cyan-500" />
            <RadioGroupItem value="mentee" id="mentee" className="sr-only" />
            <Label htmlFor="mentee" className="text-lg font-medium cursor-pointer">
              Mentee
            </Label>
            <p className="text-sm text-gray-400 text-center mt-2">
              I'm looking for guidance and want to learn from experts
            </p>
          </div>

          <div
            className={`flex flex-col items-center p-4 rounded-lg border ${userRole === "mentor" ? "border-purple-500 bg-purple-950/20" : "border-gray-700"} cursor-pointer transition-all duration-200`}
            onClick={() => setUserRole("mentor")}
          >
            <Briefcase className="h-10 w-10 mb-3 text-purple-500" />
            <RadioGroupItem value="mentor" id="mentor" className="sr-only" />
            <Label htmlFor="mentor" className="text-lg font-medium cursor-pointer">
              Mentor
            </Label>
            <p className="text-sm text-gray-400 text-center mt-2">I want to share my knowledge and guide others</p>
          </div>
        </div>
      </RadioGroup>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        disabled={!userRole}
      >
        Continue
      </Button>
    </div>
  )

  const renderMentorProfileForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          placeholder="Share your professional background and expertise..."
          className="bg-gray-800 border-gray-700"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Areas of Expertise</Label>
        <Select onValueChange={(value) => setSkills((prev) => [...prev, value])}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select your skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="programming">Programming</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="data-science">Data Science</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-gray-800 border-gray-700">
              {skill}
              <button className="ml-1" onClick={() => setSkills(skills.filter((_, i) => i !== index))}>
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          type="text"
          placeholder="e.g., Senior Developer at Google"
          className="bg-gray-800 border-gray-700"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />
        <p className="text-xs text-gray-400">Please include your role and company if applicable</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages">Languages</Label>
        <Select onValueChange={(value) => setLanguages((prev) => [...prev, value])}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="mandarin">Mandarin</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-2">
          {languages.map((language, index) => (
            <Badge key={index} variant="outline" className="bg-gray-800 border-gray-700">
              {language}
              <button className="ml-1" onClick={() => setLanguages(languages.filter((_, i) => i !== index))}>
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="communication">Preferred Communication Method</Label>
        <Select onValueChange={setCommunicationPreference}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select communication method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Video Call">Video Call</SelectItem>
            <SelectItem value="Audio Call">Audio Call</SelectItem>
            <SelectItem value="Chat">Chat</SelectItem>
            <SelectItem value="Any">Any</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Primary Category</Label>
        <Select onValueChange={(value) => setCategoryValue(value)}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select your primary category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={(e) => {
          e.preventDefault();
          console.log("Mentor profile form button clicked");
          // Verify fields are filled
          if (!bio) {
            setError("Please provide your professional bio");
            return;
          }
          if (skills.length === 0) {
            setError("Please select at least one skill");
            return;
          }
          if (!experience) {
            setError("Please provide your experience details");
            return;
          }
          if (languages.length === 0) {
            setError("Please select at least one language");
            return;
          }
          if (!communicationPreference) {
            setError("Please select your preferred communication method");
            return;
          }
          if (!categoryValue) {
            setError("Please select a primary category");
            return;
          }
          
          // All checks passed, proceed with direct form submission
          // Instead of calling handleSubmit, perform the submission directly
          submitMentorForm(e);
        }}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        disabled={
          loading || !bio || skills.length === 0 || !experience || languages.length === 0 || !communicationPreference || !categoryValue
        }
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            Creating account...
          </>
        ) : (
          "Complete Registration"
        )}
      </Button>
    </div>
  )

  const renderMenteeProfileForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="interests">Areas of Interest</Label>
        <Select onValueChange={(value) => setInterests((prev) => [...prev, value])}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select your interests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="programming">Programming</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="data-science">Data Science</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-2">
          {interests.map((interest, index) => (
            <Badge key={index} variant="outline" className="bg-gray-800 border-gray-700">
              {interest}
              <button className="ml-1" onClick={() => setInterests(interests.filter((_, i) => i !== index))}>
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Learning Goals</Label>
        <Textarea
          id="goals"
          placeholder="What do you hope to achieve through mentorship?"
          className="bg-gray-800 border-gray-700"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredLanguages">Preferred Languages</Label>
        <Select onValueChange={(value) => setPreferredLanguages((prev) => [...prev, value])}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="mandarin">Mandarin</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2 mt-2">
          {preferredLanguages.map((language, index) => (
            <Badge key={index} variant="outline" className="bg-gray-800 border-gray-700">
              {language}
              <button
                className="ml-1"
                onClick={() => setPreferredLanguages(preferredLanguages.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button
        onClick={(e) => {
          e.preventDefault();
          console.log("Mentee profile form button clicked");
          // Verify fields are filled
          if (interests.length === 0) {
            setError("Please select at least one area of interest");
            return;
          }
          if (!goals) {
            setError("Please describe your learning goals");
            return;
          }
          if (preferredLanguages.length === 0) {
            setError("Please select at least one preferred language");
            return;
          }
          
          // All checks passed, perform direct submission
          // Instead of calling handleSubmit, perform the submission directly
          submitMenteeForm(e);
        }}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        disabled={loading || interests.length === 0 || !goals || preferredLanguages.length === 0}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            Creating account...
          </>
        ) : (
          "Complete Registration"
        )}
      </Button>
    </div>
  )

  // Add direct backend testing function
  const testBackendConnection = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/test", {
        method: "GET",
      });
      const data = await res.json();
      console.log("Backend connection test:", data);
      alert(`Backend connection: ${res.ok ? "SUCCESS" : "FAILED"}\nStatus: ${res.status}\nResponse: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Backend connection test error:", error);
      alert(`Backend connection test failed: ${error}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-70"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-gray-900 rounded-full border border-cyan-500 z-10">
              <span className="font-bold text-cyan-500 text-lg">C</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{type === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-gray-400 mt-1">
            {type === "login" ? "Sign in to your account" : "Join thousands of learners and mentors"}
          </p>
          
          {/* Debug mode toggle */}
          <div className="absolute top-4 left-4">
            <button 
              className="text-xs text-gray-500 hover:text-gray-300"
              onClick={(e) => {
                e.preventDefault();
                setDebugMode(!debugMode);
              }}
            >
              Debug: {debugMode ? "ON" : "OFF"}
            </button>
          </div>
          
          {/* Backend connection test */}
          {debugMode && (
            <div className="mt-2">
              <button
                className="text-xs text-cyan-500 hover:text-cyan-400"
                onClick={(e) => {
                  e.preventDefault();
                  testBackendConnection();
                }}
              >
                Test Backend Connection
              </button>
              <div className="text-xs text-gray-500 mt-1">Backend URL: http://localhost:5001</div>
              
              {/* Debug dashboard links */}
              <div className="mt-2 space-x-2">
                <a href="/dashboard/mentor" className="text-xs text-purple-500 hover:text-purple-400">
                  Mentor Dashboard
                </a>
                <span className="text-gray-500">|</span>
                <a href="/dashboard/mentee" className="text-xs text-cyan-500 hover:text-cyan-400">
                  Mentee Dashboard
                </a>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue={type} onValueChange={(value) => onSwitchType(value as "login" | "signup")}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 bg-gray-800 border-gray-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {/* <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-cyan-500 hover:text-cyan-400">
                      Forgot password?
                    </a>
                  </div> */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-gray-800 border-gray-700"
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value
                        setPassword(value)
                        const result = zxcvbn(value)
                        setPasswordStrength(result.score)
                        setPasswordError("")
                      }}
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>

           
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-4 text-sm">
                  {error}
                </div>
              )}

              {!showRoleSelection && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={password}
                        onChange={(e) => {
                          const value = e.target.value
                          setPassword(value)
                          const result = zxcvbn(value)
                          setPasswordStrength(result.score)
                          setPasswordError("")
                        }}
                        required
                      />
                    </div>
                    <div className="mt-1">
                      <div className="h-2 w-full bg-gray-700 rounded">
                        <div
                          className={`h-2 rounded transition-all duration-300 ${
                            ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"][passwordStrength]
                          }`}
                          style={{ width: `${(passwordStrength + 1) * 20}%` }}
                        />
                      </div>
                      {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                      {!passwordError && (
                        <p className="text-xs text-gray-400 mt-1">
                          Strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength]}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              )}

              {showRoleSelection && !showProfileForm && renderRoleSelection()}

              {showRoleSelection && showProfileForm && userRole === "mentee" && (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-4 text-sm">
                      {error}
                    </div>
                  )}
                  {renderMenteeProfileForm()}
                </div>
              )}

              {showRoleSelection && showProfileForm && userRole === "mentor" && (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-4 text-sm">
                      {error}
                    </div>
                  )}
                  {renderMentorProfileForm()}
                </div>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

