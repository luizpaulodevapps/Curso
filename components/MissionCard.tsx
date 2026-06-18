"use client"

import { useState } from "react"

interface MissionCardProps {
  titulo: string
  descricao: string
  xp: number
  dica?: string
}

export function MissionCard({ titulo, descricao, xp, dica }: MissionCardProps) {
  const [mostrarDica, setMostrarDica] = useState(false)

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border border-blue-900/50 rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Missão</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{descricao}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1.5">
          <span className="text-yellow-400 text-sm">+{xp} XP</span>
        </div>
      </div>
      {dica && (
        <div>
          <button
            onClick={() => setMostrarDica(!mostrarDica)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            💡 {mostrarDica ? "Ocultar dica" : "Preciso de uma dica"}
          </button>
          {mostrarDica && (
            <p className="mt-2 text-xs text-gray-400 bg-blue-900/10 border border-blue-800/20 rounded-lg p-3">
              {dica}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
