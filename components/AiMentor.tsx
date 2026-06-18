"use client"

import { useState } from "react"
import { useMentor } from "@/lib/mentor"

interface AiMentorProps {
  codigo?: string
  erro?: string
  questao?: string
}

export function AiMentor({ codigo = "", erro, questao }: AiMentorProps) {
  const [expandido, setExpandido] = useState(true)
  const { resposta, loading, erroApi, perguntar } = useMentor({ codigo, erro, questao })

  return (
    <div className="bg-[#161b22] border border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#1c2333] transition-colors"
      >
        <span className="flex items-center gap-2">🤖 Mentor IA</span>
        <div className="flex items-center gap-2">
          {loading && <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
          <span className="text-gray-500">{expandido ? "▲" : "▼"}</span>
        </div>
      </button>
      {expandido && (
        <div className="p-4 space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => perguntar("dica")}
              disabled={loading}
              className="text-left px-3 py-2 text-xs bg-blue-900/20 border border-blue-800/30 rounded-lg text-blue-300 hover:bg-blue-900/40 transition-colors disabled:opacity-50"
            >
              💡 Me dê uma dica
            </button>
            {erro && (
              <button
                onClick={() => perguntar("explicar-erro")}
                disabled={loading}
                className="text-left px-3 py-2 text-xs bg-red-900/20 border border-red-800/30 rounded-lg text-red-300 hover:bg-red-900/40 transition-colors disabled:opacity-50"
              >
                ❌ Explique esse erro
              </button>
            )}
            <button
              onClick={() => perguntar("explicar-codigo")}
              disabled={loading}
              className="text-left px-3 py-2 text-xs bg-green-900/20 border border-green-800/30 rounded-lg text-green-300 hover:bg-green-900/40 transition-colors disabled:opacity-50"
            >
              📖 Explique esse código
            </button>
            <button
              onClick={() => perguntar("mostrar-teoria")}
              disabled={loading}
              className="text-left px-3 py-2 text-xs bg-purple-900/20 border border-purple-800/30 rounded-lg text-purple-300 hover:bg-purple-900/40 transition-colors disabled:opacity-50"
            >
              📚 Mostrar teoria
            </button>
          </div>
          {loading && (
            <div className="mt-3 p-3 bg-blue-900/10 border border-blue-800/20 rounded-lg text-xs text-gray-400 animate-pulse">
              Pensando...
            </div>
          )}
          {resposta && (
            <div className="mt-3 p-3 bg-blue-900/10 border border-blue-800/20 rounded-lg text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
              {resposta}
            </div>
          )}
          {erroApi && (
            <div className="mt-3 p-3 bg-red-900/10 border border-red-800/20 rounded-lg text-xs text-red-400">
              {erroApi}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
