"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getCurso, getModulo } from "@/lib/data-loader"
import { useProfile } from "@/lib/use-profile"
import type { Curso, Modulo } from "@/lib/types"
import { getReferencesForModule } from "@/lib/references-data"

const renderizarTexto = (texto: string) => {
  if (!texto) return ""
  const parts = texto.split(/\*\*([^*]+)\*\*/g)
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-extrabold text-blue-300">{part}</strong>
    }
    const subParts = part.split(/\*([^*]+)\*/g)
    return subParts.map((subPart, j) => {
      if (j % 2 === 1) {
        return <em key={j} className="italic text-gray-200">{subPart}</em>
      }
      return subPart
    })
  })
}

export default function ModuloDetalhe() {
  const params = useParams()
  const cursoId = params.id as string
  const moduloId = params.moduloId as string
  const { perfil } = useProfile()
  const [curso, setCurso] = useState<Curso | null>(null)
  const [modulo, setModulo] = useState<Modulo | null>(null)
  const [abaAtiva, setAbaAtiva] = useState<"objetivos" | "estudo">("estudo")
  const [desbloqueado, setDesbloqueado] = useState(false)

  const key = `${cursoId}/${moduloId}`
  const prog = perfil.progressoCursos[key]
  const questoesFeitas = prog ? Object.keys(prog.questoesRespondidas || {}).length : 0

  useEffect(() => {
    getCurso(cursoId).then(c => setCurso(c ?? null))
    getModulo(cursoId, moduloId).then(m => setModulo(m ?? null))
  }, [cursoId, moduloId])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasStudied = localStorage.getItem(`estudado/${cursoId}/${moduloId}`) === "true"
      const unlocked = questoesFeitas > 0 || hasStudied
      setDesbloqueado(unlocked)
      if (!unlocked) {
        setAbaAtiva("estudo")
      }
    }
  }, [cursoId, moduloId, questoesFeitas])

  if (!modulo) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 mt-4">Carregando missão...</p>
      </div>
    )
  }

  const totalQuestoes = modulo.questoes.length
  const percentModulo = totalQuestoes > 0 ? Math.round((questoesFeitas / totalQuestoes) * 100) : 0
  const acertosNoModulo = prog?.acertos ?? 0
  const errosNoModulo = prog?.erros ?? 0

  const handleLiberarObjetivos = () => {
    localStorage.setItem(`estudado/${cursoId}/${moduloId}`, "true")
    setDesbloqueado(true)
    setAbaAtiva("objetivos")
  }

  const getCourseTheme = (id: string) => {
    const themes: Record<string, {
      border: string;
      text: string;
      bgGlow: string;
      barColor: string;
      tabActive: string;
    }> = {
      mentalidade: {
        border: "border-indigo-500/10",
        text: "text-indigo-400",
        bgGlow: "from-indigo-650/30 via-purple-900/20 to-transparent",
        barColor: "from-indigo-500 to-purple-500",
        tabActive: "bg-indigo-600/20 border-indigo-500/30 text-indigo-300"
      },
      html: {
        border: "border-orange-500/10",
        text: "text-orange-400",
        bgGlow: "from-orange-650/30 via-red-900/20 to-transparent",
        barColor: "from-orange-500 to-red-500",
        tabActive: "bg-orange-600/20 border-orange-500/30 text-orange-300"
      },
      css: {
        border: "border-cyan-500/10",
        text: "text-cyan-400",
        bgGlow: "from-cyan-650/30 via-blue-900/20 to-transparent",
        barColor: "from-cyan-500 to-blue-500",
        tabActive: "bg-cyan-600/20 border-cyan-500/30 text-cyan-300"
      },
      logica: {
        border: "border-emerald-500/10",
        text: "text-emerald-400",
        bgGlow: "from-emerald-650/30 via-teal-900/20 to-transparent",
        barColor: "from-emerald-500 to-teal-500",
        tabActive: "bg-emerald-600/20 border-emerald-500/30 text-emerald-300"
      },
      git: {
        border: "border-rose-500/10",
        text: "text-rose-400",
        bgGlow: "from-rose-650/30 via-orange-900/20 to-transparent",
        barColor: "from-rose-500 to-orange-500",
        tabActive: "bg-rose-600/20 border-rose-500/30 text-rose-300"
      },
      javascript: {
        border: "border-amber-500/10",
        text: "text-amber-400",
        bgGlow: "from-amber-650/30 via-yellow-900/20 to-transparent",
        barColor: "from-amber-500 to-yellow-500",
        tabActive: "bg-amber-600/20 border-amber-500/30 text-amber-300"
      },
    }

    return themes[id] || {
      border: "border-blue-500/10",
      text: "text-blue-400",
      bgGlow: "from-blue-650/30 via-purple-900/20 to-transparent",
      barColor: "from-blue-500 to-purple-500",
      tabActive: "bg-blue-650/20 border-blue-500/30 text-blue-300"
    }
  }

  const t = getCourseTheme(cursoId)

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

  // Filtrar lições teóricas do módulo
  const aulas = modulo.questoes.filter(q => q.tipo === "aula" || q.tipo === "exemplo")
  // Obter referências oficiais
  const referencias = [...(modulo.referencias || []), ...getReferencesForModule(cursoId, moduloId)]

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

      {/* Tabs navigation */}
      <div className="flex border border-white/[0.06] bg-[#0c0c14]/60 backdrop-blur-md rounded-2xl p-1.5 gap-1.5 shadow-xl">
        <button
          onClick={() => {
            if (!desbloqueado) return
            setAbaAtiva("objetivos")
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all duration-200 ${
            !desbloqueado
              ? "border-transparent text-gray-600 cursor-not-allowed"
              : abaAtiva === "objetivos"
              ? `${t.tabActive} shadow-lg shadow-blue-500/5`
              : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
          }`}
          disabled={!desbloqueado}
        >
          🎯 Objetivos {!desbloqueado && "🔒"}
        </button>
        <button
          onClick={() => setAbaAtiva("estudo")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all duration-200 ${
            abaAtiva === "estudo"
              ? `${t.tabActive} shadow-lg shadow-blue-500/5`
              : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
          }`}
        >
          📖 Material de Estudo
        </button>
      </div>

      {abaAtiva === "estudo" && !desbloqueado && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300/90 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-pulse">
          <span className="text-sm">💡</span>
          <p>Você está no Modo de Estudo. Complete a leitura da teoria e clique em <strong>"Concluir Leitura e Liberar Exercícios"</strong> no final da página para desbloquear a lista de exercícios e testes!</p>
        </div>
      )}

      {abaAtiva === "objetivos" ? (
        /* Quests timeline */
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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-black text-gray-400 shrink-0 group-hover:bg-white/[0.08] transition-colors">
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
                      <span className="px-1.5 py-0.5 rounded text-gray-400 bg-white/[0.04]">
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
      ) : (
        /* Study materials tab */
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              📖 Conceitos e Teoria do Módulo
            </h2>

            {aulas.length > 0 ? (
              <div className="space-y-6">
                {aulas.map((aula) => {
                  const b = badgeMap[aula.tipo] || { label: aula.tipo, style: "bg-gray-600/20 text-gray-400" }
                  return (
                    <div
                      key={aula.id}
                      className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                          {aula.titulo}
                        </h3>
                        <span className={`px-2 py-0.5 border rounded-full text-[9px] uppercase font-bold tracking-wider ${b.style}`}>
                          {b.label}
                        </span>
                      </div>
                      
                      {aula.explicacao && (
                        <p className="text-xs text-gray-400 leading-relaxed italic bg-white/[0.02] border border-white/[0.04] p-3.5 rounded-xl">
                          {aula.explicacao}
                        </p>
                      )}

                      {aula.conteudo && (
                        <div className="space-y-4 pt-2">
                          {aula.conteudo.map((bloco, i) => {
                            if (bloco.tipo === "texto") {
                              return (
                                <p key={i} className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                  {renderizarTexto(bloco.valor)}
                                </p>
                              )
                            }
                            if (bloco.tipo === "codigo") {
                              return (
                                <pre key={i} className="bg-[#0a0a0a] rounded-xl p-4 overflow-x-auto border border-white/[0.06] max-h-80">
                                  <code className={`text-xs md:text-sm font-mono ${bloco.linguagem === "bash" || bloco.linguagem === "terminal" ? "text-emerald-400" : "text-amber-300"}`}>
                                    {bloco.valor}
                                  </code>
                                </pre>
                              )
                            }
                            if (bloco.tipo === "resultado") {
                              return (
                                <div key={i} className="bg-[#0a0a0a]/50 border border-white/[0.06] rounded-xl p-4">
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Saída / Console:
                                  </p>
                                  <pre className="text-xs md:text-sm text-gray-300 font-mono whitespace-pre-wrap">{bloco.valor}</pre>
                                </div>
                              )
                            }
                            if (bloco.tipo === "legenda") {
                              return (
                                <div key={i} className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3.5 text-xs text-blue-300 leading-relaxed">
                                  <span className="shrink-0">💡</span>
                                  <p className="italic">{bloco.valor}</p>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-8 text-center space-y-3">
                <p className="text-gray-400">Esta missão foca principalmente em desafios práticos e projetos.</p>
                <p className="text-xs text-gray-500">Confira a lista de objetivos ou as referências oficiais abaixo para se preparar.</p>
              </div>
            )}
          </div>

          {referencias.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-white/[0.05]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                🔗 Referências & Documentação Oficial
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {referencias.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden bg-white/[0.01] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.02] rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between gap-3 hover:translate-y-[-2px] shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                        {ref.title}
                        <span className="text-[10px] text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">↗</span>
                      </h4>
                      {ref.description && (
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                          {ref.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                      Acessar Documentação
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Release CTA button */}
          {!desbloqueado && (
            <div className="pt-6 text-center">
              <button
                onClick={handleLiberarObjetivos}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-650 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-950/45 hover:shadow-emerald-500/20 transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[0px] flex items-center justify-center gap-2"
              >
                ✨ Concluir Leitura e Liberar Exercícios →
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}


