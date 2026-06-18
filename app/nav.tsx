"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/use-auth"
import { StudyTimer } from "@/components/StudyTimer"

const links = [
  { href: "/cursos", label: "Cursos", icon: "📚" },
  { href: "/busca", label: "Buscar", icon: "🔍" },
  { href: "/editor", label: "Editor", icon: "💻" },
  { href: "/flashcards", label: "Revisão", icon: "🃏" },
  { href: "/roadmap", label: "Roadmap", icon: "🗺️" },
  { href: "/conquistas", label: "Conquistas", icon: "🏆" },
  { href: "/estatisticas", label: "Estatísticas", icon: "📊" },
]

export function Nav() {
  const pathname = usePathname()
  const { user, sair } = useAuth()

  if (pathname === "/" || pathname === "/entrar" || pathname === "/cadastro") return null

  return (
    <>
      <div className="hidden md:block h-16" />
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center gap-1 px-4 h-16 max-w-6xl mx-auto w-full overflow-x-auto">
          <Link
            href="/cursos"
            className="font-bold text-blue-400 text-lg mr-6 shrink-0"
          >
            DevEstudos
          </Link>
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors shrink-0 ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
          <div className="flex-1" />
          <StudyTimer />
          {user && (
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-700">
              <Link href="/perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center text-xs text-blue-300 font-medium">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-gray-400 max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </Link>
              <button
                onClick={sair}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-t border-gray-800">
        <div className="flex items-center justify-around h-16 px-2">
          {links.slice(0, 5).map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                  isActive ? "text-blue-400" : "text-gray-500"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
