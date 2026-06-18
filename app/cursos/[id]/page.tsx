"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getCurso, getModulos } from "@/lib/data-loader"
import { useProfile } from "@/lib/use-profile"
import type { Curso, Modulo } from "@/lib/types"

export default function CursoDetalhe() {
  const params = useParams()
  const cursoId = params.id as string
  const { perfil } = useProfile()
  const [curso, setCurso] = useState<Curso | null>(null)
  const [modulos, setModulos] = useState<(Modulo | null)[]>([])

  useEffect(() => {
    getCurso(cursoId).then(c => setCurso(c ?? null))
    getModulos(cursoId).then(setModulos)
  }, [cursoId])

  if (!curso) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 mt-4">Carregando curso...</p>
      </div>
    )
  }

  const modulosValidos = modulos.filter((m): m is Modulo => m !== null)
  const concluidos = modulosValidos.filter((m) => {
    const prog = perfil.progressoCursos[`${cursoId}/${m.id}`]
    return prog?.concluido
  }).length
  const pct = curso.modulos > 0 ? Math.round((concluidos / curso.modulos) * 100) : 0

  const getCourseTheme = (id: string) => {
    const themes: Record<string, {
      border: string;
      text: string;
      bgGlow: string;
      barColor: string;
      glowHex: string;
    }> = {
      mentalidade: {
        border: "border-indigo-500/10",
        text: "text-indigo-400",
        bgGlow: "from-indigo-650/30 via-purple-900/20 to-transparent",
        barColor: "from-indigo-500 to-purple-500",
        glowHex: "rgba(99,102,241,0.2)"
      },
      html: {
        border: "border-orange-500/10",
        text: "text-orange-400",
        bgGlow: "from-orange-650/30 via-red-900/20 to-transparent",
        barColor: "from-orange-500 to-red-500",
        glowHex: "rgba(249,115,22,0.2)"
      },
      css: {
        border: "border-cyan-500/10",
        text: "text-cyan-400",
        bgGlow: "from-cyan-650/30 via-blue-900/20 to-transparent",
        barColor: "from-cyan-500 to-blue-500",
        glowHex: "rgba(6,182,212,0.2)"
      },
      logica: {
        border: "border-emerald-500/10",
        text: "text-emerald-400",
        bgGlow: "from-emerald-650/30 via-teal-900/20 to-transparent",
        barColor: "from-emerald-500 to-teal-500",
        glowHex: "rgba(16,185,129,0.2)"
      },
      git: {
        border: "border-rose-500/10",
        text: "text-rose-400",
        bgGlow: "from-rose-650/30 via-orange-900/20 to-transparent",
        barColor: "from-rose-500 to-orange-500",
        glowHex: "rgba(244,63,94,0.2)"
      },
      javascript: {
        border: "border-amber-500/10",
        text: "text-amber-400",
        bgGlow: "from-amber-650/30 via-yellow-900/20 to-transparent",
        barColor: "from-amber-500 to-yellow-500",
        glowHex: "rgba(245,158,11,0.2)"
      },
    };

    return themes[id] || {
      border: "border-blue-500/10",
      text: "text-blue-400",
      bgGlow: "from-blue-650/30 via-purple-900/20 to-transparent",
      barColor: "from-blue-500 to-purple-500",
      glowHex: "rgba(59,130,246,0.2)"
    };
  };

  const t = getCourseTheme(curso.id)

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <Link href="/cursos" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors">
        ← Painel de Cursos
      </Link>

      {/* Course Detail Banner */}
      <section className="relative overflow-hidden bg-white/[0.01] border border-white/[0.06] rounded-3xl p-6 md:p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${t.bgGlow} opacity-40 pointer-events-none`} />
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl md:text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {curso.icone}
            </span>
            <div className="space-y-1">
              <span className={`inline-block px-2.5 py-0.5 bg-white/[0.04] border ${t.border} ${t.text} text-[10px] uppercase font-bold tracking-wider rounded-full`}>
                {curso.nivel}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{curso.nome}</h1>
              <p className="text-sm text-gray-400 max-w-2xl leading-relaxed pt-1">{curso.descricao}</p>
            </div>
          </div>
        </div>

        {/* Level bar */}
        <div className="relative mt-6 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-500">
            <span>📚 {curso.modulos} Módulos</span>
            <span>✨ {concluidos} Concluídos</span>
          </div>
          <div className="flex-1 max-w-xs w-full space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>Progresso</span>
              <span className={t.text}>{pct}%</span>
            </div>
            <div className="h-2 bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${t.barColor} rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modules Roadmap Track */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-400">
          📍 Trilha de Missões
        </h2>

        <div className="relative pl-6 md:pl-8 space-y-6">
          {/* Vertical Connecting Line */}
          <div className="absolute top-4 bottom-4 left-[34px] md:left-[42px] w-0.5 bg-white/[0.06] pointer-events-none" />

          {modulosValidos.map((modulo, idx) => {
            const key = `${cursoId}/${modulo.id}`
            const prog = perfil.progressoCursos[key]
            const concluido = prog?.concluido
            const questoesFeitas = prog ? Object.keys(prog.questoesRespondidas || {}).length : 0
            const totalQuestoes = modulo.questoes.length
            const isFirstUncompleted = idx === 0 || (modulosValidos[idx - 1] && perfil.progressoCursos[`${cursoId}/${modulosValidos[idx - 1].id}`]?.concluido)

            let statusColor = "border-white/[0.08] bg-white/[0.02] text-gray-500"
            let indicatorBg = "bg-white/[0.03] border-white/[0.08]"
            let indicatorColor = "text-gray-600"
            let indicatorSymbol = `${idx + 1}`

            if (concluido) {
              statusColor = "border-green-500/20 bg-green-500/[0.01] hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
              indicatorBg = "bg-green-500/20 border-green-500/30"
              indicatorColor = "text-green-400"
              indicatorSymbol = "✓"
            } else if (questoesFeitas > 0 || isFirstUncompleted) {
              statusColor = `border-blue-500/20 bg-blue-500/[0.01] hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]`
              indicatorBg = "bg-blue-500/20 border-blue-500/30"
              indicatorColor = "text-blue-400"
            }

            return (
              <div key={modulo.id} className="relative flex items-start gap-4 md:gap-6 group">
                {/* Node Indicator */}
                <div className={`absolute -left-[28px] md:-left-[36px] top-1.5 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border ${indicatorBg} ${indicatorColor} font-black text-sm md:text-base z-10 transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                  {indicatorSymbol}
                </div>

                <div className={`flex-1 bg-white/[0.01] backdrop-blur-md border rounded-2xl p-5 transition-all duration-300 ${statusColor}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base md:text-lg text-white group-hover:text-blue-400 transition-colors">
                          {modulo.nome}
                        </h3>
                        {concluido ? (
                          <span className="text-[9px] uppercase font-black tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded">
                            Concluído
                          </span>
                        ) : questoesFeitas > 0 ? (
                          <span className="text-[9px] uppercase font-black tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded animate-pulse">
                            Em Progresso
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                        {modulo.descricao}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-wider text-gray-500 pt-2">
                        <span>📝 {questoesFeitas}/{totalQuestoes} Lições</span>
                        {modulo.duracao && (
                          <>
                            <span>•</span>
                            <span>⏳ {modulo.duracao}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <Link
                        href={`/cursos/${cursoId}/modulo/${modulo.id}`}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 text-center ${
                          concluido
                            ? "bg-green-600/15 border border-green-500/30 text-green-400 hover:bg-green-600/30"
                            : questoesFeitas > 0
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:shadow-blue-500/30"
                            : "bg-white/[0.03] border border-white/[0.08] text-gray-300 hover:bg-white/[0.08]"
                        }`}
                      >
                        {concluido ? "Rever Lições" : questoesFeitas > 0 ? "Continuar" : "Iniciar"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
