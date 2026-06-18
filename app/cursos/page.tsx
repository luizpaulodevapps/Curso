"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getCursos } from "@/lib/data-loader"
import { useProfile } from "@/lib/use-profile"
import type { Curso } from "@/lib/types"
import { NIVEIS } from "@/lib/types"

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const { perfil, nivel } = useProfile()

  useEffect(() => {
    getCursos().then(setCursos)
  }, [])

  const nextLevel = NIVEIS[nivel.nivel]
  const xpMinimoNivelAtual = nivel.xpMinimo
  const xpProximoNivel = nextLevel ? nextLevel.xpMinimo : nivel.xpMinimo
  const xpGanhosNivelAtual = perfil.xp - xpMinimoNivelAtual
  const xpNecessarioParaNivel = xpProximoNivel - xpMinimoNivelAtual
  const percentNivel = xpNecessarioParaNivel > 0 ? Math.min(100, Math.round((xpGanhosNivelAtual / xpNecessarioParaNivel) * 100)) : 100

  const taxaAcerto = perfil.totalQuestoes > 0
    ? Math.round((perfil.acertos / perfil.totalQuestoes) * 100)
    : 0

  const getCourseTheme = (id: string) => {
    const themes: Record<string, {
      border: string;
      text: string;
      bgGlow: string;
      barColor: string;
      hoverGlow: string;
    }> = {
      mentalidade: {
        border: "border-indigo-500/10",
        text: "text-indigo-400",
        bgGlow: "from-indigo-500/10 via-purple-500/5 to-transparent",
        barColor: "from-indigo-500 to-purple-500",
        hoverGlow: "hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
      },
      html: {
        border: "border-orange-500/10",
        text: "text-orange-400",
        bgGlow: "from-orange-500/10 via-red-500/5 to-transparent",
        barColor: "from-orange-500 to-red-500",
        hoverGlow: "hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
      },
      css: {
        border: "border-cyan-500/10",
        text: "text-cyan-400",
        bgGlow: "from-cyan-500/10 via-blue-500/5 to-transparent",
        barColor: "from-cyan-500 to-blue-500",
        hoverGlow: "hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
      },
      logica: {
        border: "border-emerald-500/10",
        text: "text-emerald-400",
        bgGlow: "from-emerald-500/10 via-teal-500/5 to-transparent",
        barColor: "from-emerald-500 to-teal-500",
        hoverGlow: "hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
      },
      git: {
        border: "border-rose-500/10",
        text: "text-rose-400",
        bgGlow: "from-rose-500/10 via-orange-500/5 to-transparent",
        barColor: "from-rose-500 to-orange-500",
        hoverGlow: "hover:border-rose-500/30 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]"
      },
      javascript: {
        border: "border-amber-500/10",
        text: "text-amber-400",
        bgGlow: "from-amber-500/10 via-yellow-500/5 to-transparent",
        barColor: "from-amber-500 to-yellow-500",
        hoverGlow: "hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
      },
      "banco-dados": {
        border: "border-teal-500/10",
        text: "text-teal-400",
        bgGlow: "from-teal-500/10 via-emerald-500/5 to-transparent",
        barColor: "from-teal-500 to-emerald-500",
        hoverGlow: "hover:border-teal-500/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]"
      },
      postgresql: {
        border: "border-sky-500/10",
        text: "text-sky-400",
        bgGlow: "from-sky-500/10 via-blue-500/5 to-transparent",
        barColor: "from-sky-500 to-blue-500",
        hoverGlow: "hover:border-sky-500/30 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]"
      },
      "apis-rest": {
        border: "border-violet-500/10",
        text: "text-violet-400",
        bgGlow: "from-violet-500/10 via-purple-500/5 to-transparent",
        barColor: "from-violet-500 to-purple-500",
        hoverGlow: "hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
      },
      supabase: {
        border: "border-green-500/10",
        text: "text-green-400",
        bgGlow: "from-green-500/10 via-emerald-500/5 to-transparent",
        barColor: "from-green-500 to-emerald-500",
        hoverGlow: "hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
      },
      react: {
        border: "border-cyan-500/10",
        text: "text-cyan-400",
        bgGlow: "from-cyan-500/10 via-indigo-500/5 to-transparent",
        barColor: "from-cyan-500 to-indigo-500",
        hoverGlow: "hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
      },
      nextjs: {
        border: "border-slate-500/10",
        text: "text-slate-200",
        bgGlow: "from-slate-500/10 via-zinc-500/5 to-transparent",
        barColor: "from-white to-slate-400",
        hoverGlow: "hover:border-slate-400/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
      },
    };

    return themes[id] || {
      border: "border-blue-500/10",
      text: "text-blue-400",
      bgGlow: "from-blue-500/10 via-purple-500/5 to-transparent",
      barColor: "from-blue-500 to-purple-500",
      hoverGlow: "hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    };
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <style>{`
        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .anim-grad-bg {
          background-size: 200% 200%;
          animation: gradient-bg 8s ease infinite;
        }
        .glow-soft {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.05);
        }
      `}</style>

      {/* Gamified Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-indigo-950/40 border border-white/[0.06] rounded-3xl p-6 md:p-8 glow-soft">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 anim-grad-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/10">
              <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {nivel.nivel}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider -mt-1">Nível</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">{perfil.nome || "Dev"}</span>!
              </h1>
              <p className="text-sm text-gray-400 mt-1 font-medium">Pronto para iniciar sua próxima missão de código?</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 md:px-6">
            <div className="text-center px-4">
              <span className="block text-xl">🔥</span>
              <span className="block text-sm font-bold text-orange-400">{perfil.streak} dias</span>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Ofensiva</span>
            </div>
            <div className="w-px h-10 bg-white/[0.08]" />
            <div className="text-center px-4">
              <span className="block text-xl">🎯</span>
              <span className="block text-sm font-bold text-green-400">{taxaAcerto}%</span>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Acerto</span>
            </div>
            <div className="w-px h-10 bg-white/[0.08]" />
            <div className="text-center px-4">
              <span className="block text-xl">🏆</span>
              <span className="block text-sm font-bold text-yellow-400">{perfil.conquistas.length}</span>
              <span className="text-[10px] text-gray-500 uppercase font-semibold">Conquistas</span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
            <span>Liga {nivel.titulo}</span>
            <span>{perfil.xp} / {xpProximoNivel} XP ({percentNivel}%)</span>
          </div>
          <div className="h-3 bg-white/[0.04] border border-white/[0.05] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 relative"
              style={{ width: `${percentNivel}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[shimmer_1.5s_linear_infinite]" />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span>🚀</span> Seus Cursos
            </h2>
            <p className="text-xs text-gray-500">Desenvolva habilidades do zero ao avançado de forma sequencial</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cursos.map((curso) => {
            const concluidos = Object.values(perfil.progressoCursos).filter(
              (p) => p.cursoId === curso.id && p.concluido
            ).length
            const pct = curso.modulos > 0 ? Math.round((concluidos / curso.modulos) * 100) : 0
            const t = getCourseTheme(curso.id)

            return (
              <Link
                key={curso.id}
                href={`/cursos/${curso.id}`}
                className={`relative group block bg-white/[0.02] backdrop-blur-md border ${t.border} rounded-2xl p-6 transition-all duration-300 ${t.hoverGlow} hover:scale-[1.01] overflow-hidden`}
              >
                {/* Visual Glow background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${t.bgGlow} opacity-30 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-4xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {curso.icone}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-base md:text-lg group-hover:text-white transition-colors">
                        {curso.nome}
                      </h3>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-0.5 bg-white/[0.04] border ${t.border} ${t.text} text-[10px] uppercase font-bold tracking-wider rounded-full`}>
                        {curso.nivel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed mt-2 line-clamp-2">
                      {curso.descricao}
                    </p>

                    <div className="flex items-center gap-3 pt-3 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <span>📚 {curso.modulos} módulos</span>
                      <span>•</span>
                      <span>✨ {concluidos} concluídos</span>
                      {pct > 0 && (
                        <>
                          <span>•</span>
                          <span className={t.text}>{pct}%</span>
                        </>
                      )}
                    </div>

                    <div className="h-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${t.barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
