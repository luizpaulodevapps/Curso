"use client"

import { useState, useEffect } from "react"

const CHAVE = "devestudos-onboarding-visto"

const passos = [
  {
    titulo: "Bem-vindo ao DevEstudos! 🚀",
    descricao: "Sua plataforma gamificada para aprender JavaScript, HTML, CSS e mais. Vamos conhecer os principais recursos.",
  },
  {
    titulo: "📖 Modo Estudo",
    descricao: "Aprenda com questões interativas: múltipla escolha, complete o código, arraste e solte, e muito mais. Cada acerto rende XP!",
  },
  {
    titulo: "🧪 Modo Laboratório",
    descricao: "Editor completo com HTML, CSS e JavaScript. Escreva código, veja o preview ao vivo e teste suas ideias na hora.",
  },
  {
    titulo: "🤖 Mentor IA",
    descricao: "Peça dicas, explicações de erros e teoria diretamente para a IA Gemini. Disponível em qualquer questão.",
  },
  {
    titulo: "📊 Progresso e Conquistas",
    descricao: "Acompanhe seu nível, streak diário, XP acumulado e desbloqueie conquistas ao longo da jornada.",
  },
]

export function Onboarding() {
  const [aberto, setAberto] = useState(false)
  const [passo, setPasso] = useState(0)

  useEffect(() => {
    const visto = localStorage.getItem(CHAVE)
    if (!visto) setAberto(true)
  }, [])

  const fechar = () => {
    localStorage.setItem(CHAVE, "true")
    setAberto(false)
  }

  if (!aberto) return null

  const atual = passos[passo]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-up">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">
              Passo {passo + 1} de {passos.length}
            </span>
            <button
              onClick={fechar}
              className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
              aria-label="Fechar onboarding"
            >
              Pular
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">{atual.titulo}</h2>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">{atual.descricao}</p>
          </div>

          <div className="flex gap-1.5 justify-center">
            {passos.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === passo ? "w-6 bg-blue-500" : "w-1.5 bg-gray-700"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {passo > 0 && (
              <button
                onClick={() => setPasso(p => p - 1)}
                className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                Anterior
              </button>
            )}
            <button
              onClick={() => passo < passos.length - 1 ? setPasso(p => p + 1) : fechar()}
              className="flex-1 py-2.5 rounded-xl text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              {passo < passos.length - 1 ? "Próximo" : "Começar!"}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.3s ease-out both; }
      `}</style>
    </div>
  )
}
