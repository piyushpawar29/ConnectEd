"use client"
import { useState, useEffect } from "react"
import Chat from "@/components/chat/Chat"
import { Card, CardContent } from "@/components/ui/card"

export default function ChatTestPage() {
  const [user, setUser] = useState({
    id: "test-user-1",
    name: "Test User",
    avatar: "/placeholder.svg",
    role: "mentor" as const
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Chat Page</h1>
      <Card className="h-[calc(100vh-180px)]" style={{ height: 'calc(100vh - 180px)' }}>
        <CardContent className="p-0 h-full">
          <Chat 
            userId={user.id}
            userName={user.name}
            userAvatar={user.avatar}
            userRole={user.role}
          />
        </CardContent>
      </Card>
    </div>
  );
}
