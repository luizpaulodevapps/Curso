"use client"

import { useEffect, useState } from "react"
import type { Curso } from "@/lib/types"

interface CursoProgresso {
  id: string
  nome: string
  icone: string
  total: number
  concluidos: number
}

export function ProgressPanel() {
  const [cursos, setCursos] = useState<CursoProgresso[]>([])

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/cursos")
        const data = await res.json()
        const perfil = JSON.parse(localStorage.getItem("perfil") || "{}")
        const progresso = perfil.progressoCursos || {}

        const lista: CursoProgresso[] = data.cursos.map((c: Curso) => {
          const p = progresso[c.id]
          return {
            id: c.id,
            nome: c.nome,
            icone: c.icone,
            total: c.modulos,
            concluidos: p ? Object.values(p.questoesRespondidas || {}).filter(Boolean).length : 0,
          }
        })
        setCursos(lista)
      } catch {}
    }
    carregar()
  }, [])

  if (cursos.length === 0) return null

  return (
    <div className="bg-[#161b22] border border-gray-700 rounded-xl p-4 space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Evolução</h3>
      <div className="space-y-1.5">
        {cursos.map(c => {
          const pct = c.total > 0 ? Math.round((c.concluidos / c.total) * 100) : 0
          return (
            <div key={c.id} className="flex items-center gap-2 text-xs">
              <span>{c.icone}</span>
              <span className="w-16 text-gray-400 truncate">{c.nome}</span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-gray-500 w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
