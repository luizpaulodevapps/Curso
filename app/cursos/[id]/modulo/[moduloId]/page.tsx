"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getCurso, getModulo } from "@/lib/data-loader"
import { useProfile } from "@/lib/use-profile"
import type { Curso, Modulo } from "@/lib/types"

export default function ModuloDetalhe() {
  const params = useParams()
  const cursoId = params.id as string
  const moduloId = params.moduloId as string
  const { perfil } = useProfile()
  const [curso, setCurso] = useState<Curso | null>(null)
  const [modulo, setModulo] = useState<Modulo | null>(null)

  useEffect(() => {
    getCurso(cursoId).then(c => setCurso(c ?? null))
    getModulo(cursoId, moduloId).then(m => setModulo(m ?? null))
  }, [cursoId, moduloId])

  if (!modulo) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 mt-4">Carregando missão...</p>
      </div>
    )
  }

  const key = `${cursoId}/${moduloId}`
  const prog = perfil.progressoCursos[key]
  const questoesFeitas = prog ? Object.keys(prog.questoesRespondidas || {}).length : 0
  const totalQuestoes = modulo.questoes.length
  const percentModulo = totalQuestoes > 0 ? Math.round((questoesFeitas / totalQuestoes) * 100) : 0
  const acertosNoModulo = prog?.acertos ?? 0
  const errosNoModulo = prog?.erros ?? 0

  const badgeMap: Record<string, { label: string; style: string }> = {
    "multipla-escolha": { label: "Quiz", style: "bg-blue-600/10 border-blue-500/20 text-blue-400" },
    "verdadeiro-falso": { label: "V ou F", style: "bg-purple-600/10 border-purple-500/20 text-purple-400" },
    "complete-codigo": { label: "Código", style: "bg-orange-600/10 border-orange-500/20 text-orange-400" },
    "texto-livre": { label: "Resposta", style: "bg-green-600/10 border-green-500/20 text-green-400" },
    "arraste-e-solte": { label: "Arraste", style: "bg-pink-600/10 border-pink-500/20 text-pink-400" },
    "ordenacao": { label: "Ordem", style: "bg-teal-600/10 border-teal-500/20 text-teal-400" },
    "flashcard": { label: "Flashcard", style: "bg-indigo-600/10 border-indigo-500/20 text-indigo-400" },
    "desafio-pratico": { label: "Desafio", style: "bg-red-600/10 border-red-500/20 text-red-400" },
    "projeto": { label: "Projeto", style: "bg-yellow-600/10 border-yellow-500/20 text-yellow-400" },
    "aula": { label: "📖 Teoria", style: "bg-cyan-600/15 border-cyan-500/35 text-cyan-300 font-extrabold" },
    "exemplo": { label: "👀 Exemplo", style: "bg-violet-600/15 border-violet-500/35 text-violet-300 font-extrabold" },
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <Link
        href={`/cursos/${cursoId}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
      >
        ← Voltar ao curso {curso?.nome}
      </Link>

      {/* Module Title Banner */}
      <section className="relative overflow-hidden bg-white/[0.01] border border-white/[0.06] rounded-3xl p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xl font-black shrink-0 shadow-lg shadow-blue-600/10">
              {modulo.ordem}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Missão Atual</span>
              <h1 className="text-xl md:text-2xl font-extrabold text-white">{modulo.nome}</h1>
              <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">{modulo.descricao}</p>
            </div>
          </div>
        </div>

        {/* Stats segment */}
        <div className="mt-6 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
            <span>📊 {questoesFeitas}/{totalQuestoes} Concluídas</span>
            {acertosNoModulo > 0 && <span className="text-green-400">✓ {acertosNoModulo} Acertos</span>}
            {errosNoModulo > 0 && <span className="text-red-400">✗ {errosNoModulo} Erros</span>}
          </div>
          <div className="flex-1 max-w-xs w-full space-y-1">
            <div className="h-2 bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${percentModulo}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quests timeline */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          🎯 Lista de Objetivos
        </h2>

        <div className="space-y-3">
          {modulo.questoes.map((questao, idx) => {
            const respondida = prog?.questoesRespondidas?.[questao.id]
            const acertou = respondida === true
            const b = badgeMap[questao.tipo] || { label: questao.tipo, style: "bg-gray-600/20 text-gray-400" }

            const isLecture = questao.tipo === "aula" || questao.tipo === "exemplo"

            let statusCardStyle = "border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15] hover:bg-white/[0.02]"
            let statusIcon = "▶"
            let statusIconStyle = "bg-white/[0.04] text-gray-400 border-white/[0.05]"

            if (respondida !== undefined) {
              if (acertou) {
                statusCardStyle = "border-green-500/20 bg-green-500/[0.01] hover:border-green-500/40 hover:bg-green-500/[0.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.06)]"
                statusIcon = "✓"
                statusIconStyle = "bg-green-500/20 text-green-400 border-green-500/30"
              } else {
                statusCardStyle = "border-red-500/20 bg-red-500/[0.01] hover:border-red-500/40 hover:bg-red-500/[0.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.06)]"
                statusIcon = "✗"
                statusIconStyle = "bg-red-500/20 text-red-400 border-red-500/30"
              }
            } else if (isLecture) {
              statusCardStyle = "border-cyan-500/20 bg-cyan-500/[0.01] hover:border-cyan-500/40 hover:bg-cyan-500/[0.02]"
            }

            return (
              <Link
                key={questao.id}
                href={`/licao/${questao.id}?cursoId=${cursoId}&moduloId=${moduloId}`}
                className={`relative flex items-center gap-4 border rounded-2xl p-4 md:p-5 transition-all duration-300 hover:translate-x-1 group ${statusCardStyle}`}
              >
                {/* Node counter */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-black text-gray-400 shrink-0 group-hover:bg-white/[0.08] transition-colors`}>
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-extrabold text-sm md:text-base text-white group-hover:text-blue-400 transition-colors truncate">
                      {questao.titulo}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                    <span className={`px-2 py-0.5 border rounded-full text-[9px] ${b.style}`}>
                      {b.label}
                    </span>
                    <span>•</span>
                    <span className={`px-1.5 py-0.5 rounded text-gray-400 bg-white/[0.04]`}>
                      {questao.nivel}
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">+{questao.xp} XP</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-black shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md ${statusIconStyle}`}>
                  {statusIcon}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
