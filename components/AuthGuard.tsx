"use client"

import { useAuth } from "@/lib/use-auth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const rotasProtegidas = [
  "/cursos",
  "/editor",
  "/flashcards",
  "/conquistas",
  "/estatisticas",
  "/roadmap",
  "/perfil",
  "/admin",
]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const protegida = rotasProtegidas.some(r => pathname.startsWith(r))

  useEffect(() => {
    if (!loading && !user && protegida) {
      router.replace("/")
    }
  }, [user, loading, protegida, router])

  if (loading || (!user && protegida)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
