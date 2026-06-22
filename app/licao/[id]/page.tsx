"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { getQuestao, getContextoQuestao, type ContextoQuestao } from "@/lib/data-loader"
import { useProfile } from "@/lib/use-profile"
import { executarCodigo, validarComExpressao, validarPorComparacao } from "@/lib/editor"
import { CodeEditor } from "@/components/CodeEditor"
import { ConsolePanel } from "@/components/ConsolePanel"
import { AiMentor } from "@/components/AiMentor"
import type { Questao } from "@/lib/types"

type Estado = "respondendo" | "correto" | "errado"

export default function LicaoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const questaoId = params.id as string
  const cursoId = searchParams.get("cursoId") ?? ""
  const moduloId = searchParams.get("moduloId") ?? ""

  const { perfil, responder } = useProfile()
  const [ctx, setCtx] = useState<ContextoQuestao | null>(null)
  const [resposta, setResposta] = useState("")
  const [estado, setEstado] = useState<Estado>("respondendo")
  const [feedback, setFeedback] = useState("")
  const [erroCompilacao, setErroCompilacao] = useState("")

  const [linhasConsole, setLinhasConsole] = useState<{ tipo: "log" | "erro" | "aviso" | "info" | "sistema"; texto: string }[]>([])
  const [statusConsole, setStatusConsole] = useState<"idle" | "executando" | "ok" | "erro">("idle")
  const [tempoExecMs, setTempoExecMs] = useState<number | undefined>()
  const [navegando, setNavegando] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)

  useEffect(() => {
    if (ctx && cursoId && moduloId) {
      const isTest = ctx.questao.tipo !== "aula" && ctx.questao.tipo !== "exemplo"
      const hasStudied = localStorage.getItem(`estudado/${cursoId}/${moduloId}`) === "true"
      const key = `${cursoId}/${moduloId}`
      const prog = perfil.progressoCursos[key]
      const questoesFeitas = prog ? Object.keys(prog.questoesRespondidas || {}).length : 0
      
      if (isTest && !hasStudied && questoesFeitas === 0) {
        setBloqueado(true)
      } else {
        setBloqueado(false)
      }
    }
  }, [ctx, cursoId, moduloId, perfil])

  useEffect(() => {
    setEstado("respondendo")
    setFeedback("")
    setErroCompilacao("")
    setLinhasConsole([])
    setStatusConsole("idle")
    setTempoExecMs(undefined)

    setNavegando(false)

    getContextoQuestao(cursoId, moduloId, questaoId).then(c => {
      setCtx(c ?? null)
      setResposta(c?.questao.codigoInicial ?? "")
    })
  }, [cursoId, moduloId, questaoId])

  const irParaQuestao = useCallback((proximoModuloId: string, proximaQuestaoId: string) => {
    setNavegando(true)
    router.push(`/licao/${proximaQuestaoId}?cursoId=${cursoId}&moduloId=${proximoModuloId}`)
  }, [cursoId, router])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "n" && estado === "correto" && ctx?.proxima && !navegando) {
        irParaQuestao(ctx.proxima.moduloId, ctx.proxima.questaoId)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [estado, ctx, navegando, irParaQuestao])

  function handleContinuar() {
    if (!ctx) return
    responder(ctx.questao, "visto", cursoId, moduloId, ctx.totalNoModulo)
    setEstado("correto")
    setFeedback("📖 Conteúdo visto! Continue sua jornada.")
  }

  const handleSubmit = useCallback(() => {
    if (estado !== "respondendo" || !ctx) return

    if (ctx.questao.tipo === "aula" || ctx.questao.tipo === "exemplo") {
      handleContinuar()
      return
    }

    switch (ctx.questao.tipo) {
      case "multipla-escolha":
      case "verdadeiro-falso":
        verificarMultipla()
        break
      case "complete-codigo":
        verificarCodigo()
        break
      default:
        verificarTexto()
    }
  }, [estado, ctx, resposta])

  function verificarMultipla() {
    if (!ctx) return
    const resp = resposta
    const result = responder(ctx.questao, resp, cursoId, moduloId, ctx.totalNoModulo)
    setEstado(result.correta ? "correto" : "errado")
    setFeedback(result.correta ? "Correto! 🎉" : `Resposta: ${ctx.questao.correta}`)
  }

  function verificarTexto() {
    if (!ctx) return
    const isCorrect = resposta.trim().toLowerCase() === ctx.questao.correta.trim().toLowerCase()
    responder(ctx.questao, resposta, cursoId, moduloId, ctx.totalNoModulo)
    setEstado(isCorrect ? "correto" : "errado")
    setFeedback(isCorrect ? "Correto! 🎉" : `Resposta esperada: ${ctx.questao.correta}`)
  }

  function verificarCodigo() {
    if (!ctx) return

    setStatusConsole("executando")

    const comparacaoExata = validarPorComparacao(resposta, ctx.questao.correta)
    if (comparacaoExata) {
      responder(ctx.questao, resposta, cursoId, moduloId, ctx.totalNoModulo)
      setEstado("correto")
      setFeedback("Correto! 🎉")
      setLinhasConsole([{ tipo: "sistema", texto: "Código correto!" }])
      setStatusConsole("ok")
      return
    }

    if (ctx.questao.validacao) {
      const result = validarComExpressao(resposta, ctx.questao.validacao)
      if (result.valido) {
        responder(ctx.questao, resposta, cursoId, moduloId, ctx.totalNoModulo)
        setEstado("correto")
        setFeedback("Correto! 🎉")
        setLinhasConsole([{ tipo: "sistema", texto: "Código correto!" }])
        setTempoExecMs(result.tempoMs)
        setStatusConsole("ok")
      } else {
        setEstado("errado")
        setErroCompilacao(result.erro)
        setFeedback("Quase! Verifique a sintaxe e os valores.")
        setLinhasConsole([{ tipo: "erro", texto: result.erro }])
        setTempoExecMs(result.tempoMs)
        setStatusConsole("erro")
      }
      return
    }

    const exec = executarCodigo(resposta)
    setTempoExecMs(exec.tempoMs)

    if (!exec.valido) {
      const expectedExec = executarCodigo(ctx.questao.correta)
      const isExpectedJS = expectedExec.valido

      if (!isExpectedJS) {
        const similar = resposta.trim().toLowerCase() === ctx.questao.correta.trim().toLowerCase()
        if (similar) {
          responder(ctx.questao, resposta, cursoId, moduloId, ctx.totalNoModulo)
          setEstado("correto")
          setFeedback("Correto! 🎉")
          setLinhasConsole([{ tipo: "sistema", texto: "Código correto!" }])
          setStatusConsole("ok")
        } else {
          setEstado("errado")
          setFeedback("Quase! Dica: " + ctx.questao.explicacao)
          setLinhasConsole([{ tipo: "sistema", texto: "Código não corresponde ao esperado." }])
          setStatusConsole("erro")
        }
        return
      }

      setEstado("errado")
      setErroCompilacao(exec.erro)
      setFeedback("Erro de sintaxe!")
      setLinhasConsole([{ tipo: "erro", texto: exec.erro }])
      setStatusConsole("erro")
      return
    }

    const expectedExec = executarCodigo(ctx.questao.correta)
    const similar = exec.saida.trim() === (expectedExec.valido ? expectedExec.saida.trim() : "")

    if (similar) {
      responder(ctx.questao, resposta, cursoId, moduloId, ctx.totalNoModulo)
      setEstado("correto")
      setFeedback("Correto! 🎉")
      setLinhasConsole(exec.logs.map(l => ({ tipo: "log" as const, texto: l })))
      setStatusConsole("ok")
    } else {
      setEstado("errado")
      setFeedback("Quase! Verifique a lógica. Dica: " + ctx.questao.explicacao)
      setLinhasConsole(exec.logs.length > 0 ? exec.logs.map(l => ({ tipo: "log" as const, texto: l })) : [{ tipo: "sistema", texto: "Saída não corresponde ao esperado." }])
      setStatusConsole("erro")
    }
  }

  const handleAlternativa = useCallback((alt: string) => {
    if (estado !== "respondendo" || !ctx) return
    setResposta(alt)
    const result = responder(ctx.questao, alt, cursoId, moduloId, ctx.totalNoModulo)
    setEstado(result.correta ? "correto" : "errado")
    setFeedback(result.correta ? "Correto! 🎉" : `Resposta: ${ctx.questao.correta}`)
  }, [estado, ctx, cursoId, moduloId, responder])

  if (bloqueado) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#1a1a2e] border border-red-500/20 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
          🔒
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Acesso Bloqueado</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Nesta plataforma de e-learning, priorizamos o aprendizado completo. Você deve estudar o material teórico antes de realizar os testes e desafios práticos.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={`/cursos/${cursoId}/modulo/${moduloId}`}
            className="inline-flex w-full items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-900/40 hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            📖 Ler Material de Estudo
          </Link>
        </div>
        <div>
          <Link
            href={`/cursos/${cursoId}`}
            className="text-xs text-gray-500 hover:text-gray-300 underline font-medium transition-colors"
          >
            Voltar ao painel do curso
          </Link>
        </div>
      </div>
    )
  }

  if (!ctx) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p className="text-gray-400">Carregando questão...</p>
      </div>
    )
  }

  const { questao, modulo, curso, indexNoModulo, totalNoModulo, indiceGlobal, totalGlobal, proxima, anterior } = ctx

  const multipla = questao.tipo === "multipla-escolha" || questao.tipo === "verdadeiro-falso"
  const isCode = questao.tipo === "complete-codigo"
  const isAula = questao.tipo === "aula" || questao.tipo === "exemplo"

  const backUrl = moduloId && cursoId
    ? `/cursos/${cursoId}/modulo/${moduloId}`
    : "/cursos"

  const badgeMap: Record<string, string> = {
    "multipla-escolha": "bg-blue-600/20 text-blue-400",
    "verdadeiro-falso": "bg-purple-600/20 text-purple-400",
    "complete-codigo": "bg-orange-600/20 text-orange-400",
    "texto-livre": "bg-green-600/20 text-green-400",
    "arraste-e-solte": "bg-pink-600/20 text-pink-400",
    "ordenacao": "bg-teal-600/20 text-teal-400",
    "flashcard": "bg-indigo-600/20 text-indigo-400",
    "desafio-pratico": "bg-red-600/20 text-red-400",
    "projeto": "bg-yellow-600/20 text-yellow-400",
    "aula": "bg-cyan-600/20 text-cyan-400",
    "exemplo": "bg-violet-600/20 text-violet-400",
  }
  const tipoBadge = badgeMap[questao.tipo] ?? "bg-gray-600/20 text-gray-400"

  const pctModulo = totalNoModulo > 0 ? Math.round(((indexNoModulo + 1) / totalNoModulo) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <Link href={backUrl} className="text-sm text-blue-400 hover:underline inline-block">
          ← Voltar
        </Link>
        <span className="text-xs text-gray-500">
          {indiceGlobal + 1} de {totalGlobal}
        </span>
      </div>

      {curso && modulo && (
        <p className="text-sm text-gray-500">
          {curso.nome} &rsaquo; {modulo.nome}
        </p>
      )}

      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${pctModulo}%` }} />
      </div>

      <section className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-xs rounded-full ${tipoBadge}`}>
              {questao.tipo}
            </span>
            <span className="text-xs text-gray-500">+{questao.xp} XP</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            questao.nivel === "iniciante" ? "bg-green-600/20 text-green-400" :
            questao.nivel === "intermediario" ? "bg-yellow-600/20 text-yellow-400" :
            "bg-red-600/20 text-red-400"
          }`}>
            {questao.nivel}
          </span>
        </div>

        <h1 className="text-xl font-bold mb-2">{questao.titulo}</h1>
        {questao.pergunta && (
          <p className="text-gray-300 mb-4 whitespace-pre-wrap">{questao.pergunta}</p>
        )}

        {!isAula && (
          <AiMentor
            codigo={resposta}
            erro={erroCompilacao}
            questao={`${questao.titulo}\n\n${questao.pergunta}`}
          />
        )}

        {isAula && questao.conteudo && (
          <div className="space-y-4 my-4">
            {questao.conteudo.map((bloco, i) => {
              if (bloco.tipo === "texto") {
                return <p key={i} className="text-gray-300 whitespace-pre-wrap leading-relaxed">{bloco.valor}</p>
              }
              if (bloco.tipo === "codigo") {
                return (
                  <pre key={i} className="bg-[#0a0a0a] rounded-xl p-4 overflow-x-auto border border-gray-800">
                    <code className={`text-sm ${bloco.linguagem === "bash" || bloco.linguagem === "terminal" ? "text-green-400" : "text-yellow-300"}`}>
                      {bloco.valor}
                    </code>
                  </pre>
                )
              }
              if (bloco.tipo === "resultado") {
                return (
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">▶ Saída:</p>
                    <pre className="text-sm text-gray-200 whitespace-pre-wrap">{bloco.valor}</pre>
                  </div>
                )
              }
              if (bloco.tipo === "legenda") {
                return <p key={i} className="text-xs text-gray-500 italic">{bloco.valor}</p>
              }
              return null
            })}
            {estado === "respondendo" && (
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all"
              >
                Continuar →
              </button>
            )}
          </div>
        )}

        {multipla && questao.alternativas && (
          <div className="space-y-2">
            {questao.alternativas.map((alt, i) => {
              const selecionada = resposta === alt
              return (
                <button
                  key={i}
                  onClick={() => handleAlternativa(alt)}
                  disabled={estado !== "respondendo"}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    estado === "respondendo"
                      ? "bg-[#0a0a0a] border-gray-700 hover:border-blue-500 hover:bg-blue-600/10"
                      : selecionada
                      ? estado === "correto"
                        ? "bg-green-600/20 border-green-500"
                        : "bg-red-600/20 border-red-500"
                      : "bg-[#0a0a0a] border-gray-700 opacity-50"
                  }`}
                >
                  <span className="text-gray-400 mr-3">{String.fromCharCode(65 + i)}.</span>
                  {alt}
                </button>
              )
            })}
          </div>
        )}

        {isCode && (
          <div className="space-y-3">
            <CodeEditor
              value={resposta}
              onChange={setResposta}
              readOnly={estado !== "respondendo"}
              height="200px"
              placeholder="// digite seu código aqui"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={estado !== "respondendo" || !resposta.trim()}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ▶ Executar e Verificar
              </button>
              <button
                onClick={() => setResposta(questao.codigoInicial ?? "")}
                disabled={estado !== "respondendo"}
                className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                ↺ Resetar
              </button>
            </div>

            <ConsolePanel linhas={linhasConsole} tempoMs={tempoExecMs} status={statusConsole} />
          </div>
        )}

        {!multipla && !isCode && !isAula && (
          <div className="space-y-3">
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite sua resposta..."
              disabled={estado !== "respondendo"}
              rows={3}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-4 font-mono text-sm text-gray-200 focus:border-blue-500 focus:outline-none resize-none disabled:opacity-50"
            />
            {estado === "respondendo" && (
              <button
                onClick={handleSubmit}
                disabled={!resposta.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Responder
              </button>
            )}
          </div>
        )}
      </section>

      {estado !== "respondendo" && (
        <>
          <section className={`rounded-2xl p-6 border ${
            estado === "correto"
              ? "bg-green-600/10 border-green-500/30"
              : "bg-red-600/10 border-red-500/30"
          }`}>
            <p className={`text-lg font-bold mb-2 ${
              estado === "correto" ? "text-green-400" : "text-red-400"
            }`}>
              {feedback}
            </p>
            <p className="text-sm text-gray-400 mb-4">{questao.explicacao}</p>

            <div className="flex gap-3">
              {estado === "correto" && proxima ? (
                <button
                  onClick={() => irParaQuestao(proxima.moduloId, proxima.questaoId)}
                  disabled={navegando}
                  className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {navegando ? "Carregando..." : "Próxima →"}
                </button>
              ) : estado === "correto" && !proxima ? (
                <Link
                  href={backUrl}
                  className="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-all"
                >
                  🎉 Concluir Módulo
                </Link>
              ) : null}
              <Link
                href={backUrl}
                className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                Voltar ao módulo
              </Link>
            </div>
          </section>

          {estado === "errado" && anterior && (
            <div className="text-center">
              <button
                onClick={() => irParaQuestao(anterior.moduloId, anterior.questaoId)}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                ← Questão anterior
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
