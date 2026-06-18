"use client"

import { useEffect, useState } from "react"
import { useProfile } from "@/lib/use-profile"
import { calcularNivel } from "@/lib/types"

export function EvolutionPanel() {
  const { perfil, nivel } = useProfile()
  const [tempo, setTempo] = useState({ hoje: "0 min", streak: 0 })
  const [cursos, setCursos] = useState<{ id: string; nome: string; icone: string; pct: number }[]>([])

  useEffect(() => {
    function tick() {
      if (perfil?.sessaoInicio) {
        const ms = Date.now() - perfil.sessaoInicio
        const min = Math.floor(ms / 60000)
        setTempo({ hoje: `${min} min`, streak: perfil.streak || 0 })
      }
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [perfil?.sessaoInicio, perfil?.streak])

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/cursos")
        const data = await res.json()
        const p = JSON.parse(localStorage.getItem("perfil") || "{}")
        const prog = p.progressoCursos || {}
        const lista = data.cursos.map((c: { id: string; nome: string; icone: string; modulos: number }) => {
          const mod = prog[c.id]
          const total = c.modulos * 5
          const feitos = mod ? Object.values(mod.questoesRespondidas || {}).filter(Boolean).length : 0
          return { id: c.id, nome: c.nome, icone: c.icone, pct: total > 0 ? Math.round((feitos / total) * 100) : 0 }
        })
        setCursos(lista)
      } catch {}
    }
    carregar()
  }, [])

  const xpProximo = perfil ? (() => {
    const lim = [0, 100, 250, 500, 1000, 2000, 3500, 5000]
    for (let i = 0; i < lim.length; i++) {
      if (perfil.xp < lim[i]) return lim[i] - lim[i - 1]
    }
    return 0
  })() : 0
  const xpNesteNivel = perfil && xpProximo > 0 ? Math.min(100, Math.round(((perfil.xp % xpProximo) / xpProximo) * 100)) : 0

  return (
    <div className="bg-[#161b22] border border-gray-700 rounded-xl p-4 space-y-4 text-sm">
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">🎯 Objetivo Atual</p>
        <p className="text-gray-300 font-medium">Laboratório Livre</p>
        <p className="text-xs text-gray-500">Experimentação</p>
      </div>

      {nivel && (
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Nível {nivel.nivel} — {nivel.titulo}</span>
            <span className="text-gray-500">{perfil?.xp ?? 0} XP</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${xpNesteNivel}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <p className="text-gray-500">Tempo hoje</p>
          <p className="text-gray-200 font-medium">{tempo.hoje}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <p className="text-gray-500">Streak</p>
          <p className="text-orange-400 font-medium">🔥 {tempo.streak} dias</p>
        </div>
      </div>

      {perfil && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="text-gray-500">Acertos</p>
            <p className="text-green-400 font-medium">{perfil.acertos}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="text-gray-500">Questões</p>
            <p className="text-gray-200 font-medium">{perfil.totalQuestoes}</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">📚 Cursos</p>
        <div className="space-y-1.5">
          {cursos.slice(0, 5).map(c => (
            <div key={c.id} className="flex items-center gap-2 text-xs">
              <span>{c.icone}</span>
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${c.pct}%` }} />
              </div>
              <span className="text-gray-500 w-7 text-right">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
