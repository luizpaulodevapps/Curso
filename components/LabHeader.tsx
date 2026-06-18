"use client"

import { useEffect, useState } from "react"
import { useProfile } from "@/lib/use-profile"
import { calcularNivel } from "@/lib/types"

interface LabHeaderProps {
  titulo?: string
  modulo?: string
  licaoAtual?: number
  totalLicoes?: number
}

export function LabHeader({ titulo = "Laboratório JavaScript", modulo, licaoAtual, totalLicoes }: LabHeaderProps) {
  const { perfil } = useProfile()
  const [tempo, setTempo] = useState("0 min")

  useEffect(() => {
    function atualizar() {
      if (perfil?.sessaoInicio) {
        const ms = Date.now() - perfil.sessaoInicio
        const min = Math.floor(ms / 60000)
        setTempo(`${min} min`)
      }
    }
    atualizar()
    const id = setInterval(atualizar, 30000)
    return () => clearInterval(id)
  }, [perfil?.sessaoInicio])

  const nivel = perfil ? calcularNivel(perfil.xp) : null
  const xpProximo = perfil ? (() => {
    for (let i = 0; i < 8; i++) {
      if (perfil.xp < [0, 100, 250, 500, 1000, 2000, 3500, 5000][i]) {
        return [100, 150, 250, 500, 1000, 1500, 1500, Infinity][i - 1]
      }
    }
    return 0
  })() : 0
  const progressoXP = perfil && xpProximo > 0
    ? Math.min(100, Math.round(((perfil.xp % xpProximo) / xpProximo) * 100))
    : 0

  return (
    <div className="bg-[#161b22] border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span>🧠</span> {titulo}
          </h1>
          {modulo && (
            <p className="text-sm text-gray-400 mt-0.5">
              Módulo: {modulo}
              {licaoAtual && totalLicoes ? ` — Lição ${licaoAtual} de ${totalLicoes}` : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          {nivel && (
            <div className="text-right">
              <span className="text-gray-400">Nível {nivel.nivel}</span>
              <div className="w-20 h-1.5 bg-gray-700 rounded-full mt-1">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${progressoXP}%` }} />
              </div>
            </div>
          )}
          {perfil && (
            <div className="text-right">
              <span className="text-gray-400">{perfil.xp} XP</span>
            </div>
          )}
          <div className="text-right">
            <span className="text-gray-400">⏱ {tempo}</span>
          </div>
          {perfil && perfil.streak > 0 && (
            <div className="text-right">
              <span className="text-orange-400">🔥 {perfil.streak} dias</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
