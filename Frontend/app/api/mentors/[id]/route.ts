import { NextResponse } from "next/server"

// Mock data for a single mentor
const getMentorById = (id: string) => {
  // This would normally come from a database
  return {
    id,
    name: "Dr. Sarah Johnson",
    role: "AI Research Scientist",
    company: "TechInnovate",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviews: [
      {
        id: 1,
        user: {
          name: "Michael Chen",
          image: "/placeholder.svg?height=40&width=40",
        },
        rating: 5,
        date: "2023-10-15",
        comment:
          "Sarah is an exceptional mentor! Her deep knowledge of machine learning and neural networks helped me understand complex concepts that I was struggling with. She provided practical advice that I could immediately apply to my research project.",
      },
      {
        id: 2,
        user: {
          name: "Jessica Williams",
          image: "/placeholder.svg?height=40&width=40",
        },
        rating: 5,
        date: "2023-09-22",
        comment:
          "Working with Sarah has been transformative for my career. She helped me navigate the transition from academia to industry and provided invaluable guidance on how to apply my research skills in a commercial setting.",
      },
      {
        id: 3,
        user: {
          name: "David Rodriguez",
          image: "/placeholder.svg?height=40&width=40",
        },
        rating: 4,
        date: "2023-08-10",
        comment:
          "Sarah's mentorship has been incredibly helpful. She's very knowledgeable and patient. The only reason I'm not giving 5 stars is that sometimes our sessions ran over time, but that's partly because I had so many questions!",
      },
    ],
    hourlyRate: 120,
    expertise: [
      "Machine Learning",
      "Neural Networks",
      "Computer Vision",
      "Research Methods",
      "AI Ethics",
      "Deep Learning",
    ],
    expertiseDetails: [
      {
        name: "Machine Learning",
        description:
          "Specializing in supervised and unsupervised learning algorithms, with a focus on practical applications in industry settings.",
        skills: ["Regression", "Classification", "Clustering", "Dimensionality Reduction"],
      },
      {
        name: "Neural Networks",
        description: "Expert in designing and optimizing neural network architectures for various applications.",
        skills: ["CNNs", "RNNs", "Transformers", "GANs"],
      },
      {
        name: "Computer Vision",
        description:
          "Experienced in developing computer vision systems for object detection, recognition, and tracking.",
        skills: ["Object Detection", "Image Segmentation", "Facial Recognition", "Motion Analysis"],
      },
    ],
    bio: "Former lead AI researcher at Google with 10+ years of experience in machine learning and neural networks. I help aspiring AI researchers and practitioners develop cutting-edge skills and navigate their career path. My approach combines theoretical foundations with practical applications, ensuring you can apply what you learn in real-world scenarios.\n\nI'm passionate about mentoring the next generation of AI professionals and helping them make meaningful contributions to this rapidly evolving field.",
    yearsOfExperience: 12,
    industry: "Artificial Intelligence",
    location: "San Francisco, CA",
    languages: ["English", "Mandarin"],
    isAvailable: true,
    availability: "Evenings & Weekends",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    github: "https://github.com/sarahjohnson",
    twitter: "https://twitter.com/sarahjohnson",
    website: "https://sarahjohnson.ai",
    certifications: [
      {
        name: "PhD in Computer Science",
        issuer: "Stanford University",
        year: "2011",
      },
      {
        name: "TensorFlow Developer Certificate",
        issuer: "Google",
        year: "2019",
      },
      {
        name: "AWS Machine Learning Specialty",
        issuer: "Amazon Web Services",
        year: "2020",
      },
    ],
    experience: [
      {
        role: "AI Research Scientist",
        company: "TechInnovate",
        period: "2020 - Present",
        description:
          "Leading research initiatives in computer vision and natural language processing. Mentoring junior researchers and collaborating with cross-functional teams.",
      },
      {
        role: "Senior Research Scientist",
        company: "Google AI",
        period: "2015 - 2020",
        description:
          "Conducted research on deep learning models for computer vision applications. Published multiple papers in top-tier conferences.",
      },
      {
        role: "Research Scientist",
        company: "Stanford AI Lab",
        period: "2011 - 2015",
        description: "Focused on developing novel neural network architectures for image recognition tasks.",
      },
    ],
    pastSessions: [
      {
        title: "Introduction to Neural Networks",
        date: "2023-10-10",
        duration: 60,
        status: "completed",
        description: "Overview of neural network fundamentals and practical implementation strategies.",
        feedback: "Great session! Sarah explained complex concepts in a way that was easy to understand.",
      },
      {
        title: "Career Transition: Academia to Industry",
        date: "2023-09-15",
        duration: 90,
        status: "completed",
        description: "Strategies for transitioning from academic research to industry roles in AI.",
        feedback: "Invaluable insights that helped me land my first industry position!",
      },
    ],
    menteeCount: 87,
    sessionCount: 215,
    successRate: 97,
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get mentor data
  const mentor = getMentorById(id)

  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 })
  }

  return NextResponse.json(mentor)
}

