"use client"

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    
      <main className="container mx-auto px-4 py-8 pt-0">
        {children}
      </main>
    </>
  )
}
