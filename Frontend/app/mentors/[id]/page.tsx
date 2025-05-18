import type { Metadata } from "next"
import MentorProfilePage from "@/components/mentor-profile/mentor-profile-page"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch mentor data
  const mentorId = params.id
  const mentor = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/mentors/${mentorId}`).then((res) =>
    res.json(),
  )

  return {
    title: `${mentor?.name || "Mentor"} | ConnectEd Platform`,
    description: mentor?.bio || "Connect with expert mentors through our AI-powered matching platform.",
    openGraph: {
      images: [mentor?.image || "/placeholder.svg?height=400&width=300"],
    },
  }
}

export default function MentorProfile({ params }: Props) {
  const mentorId = params.id

  return <MentorProfilePage mentorId={mentorId} />
}

