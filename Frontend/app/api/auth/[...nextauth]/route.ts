import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { DefaultSession } from "next-auth"

// Extend the types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

interface User {
  id: string
  name: string
  email: string
  image: string
  password: string
}

// Static users array instead of using useState
const users: User[] = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    image: "/placeholder.svg",
    password: "password123"
  }
]
  

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user by email
        const user = users.find((user) => user.email === credentials.email)

        // Check if user exists and password matches
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        }

        return null
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID || "mock-client-id",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-client-secret",
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
  if (user) {
    token.id = (user as { id: string }).id;
  }
  return token;
},
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }

