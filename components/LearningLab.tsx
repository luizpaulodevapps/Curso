"use client"

import { useState, useCallback, useEffect } from "react"
import { CodeEditor } from "./CodeEditor"
import { ConsolePanel } from "./ConsolePanel"
import { LabHeader } from "./LabHeader"
import { MissionCard } from "./MissionCard"
import { AiMentor } from "./AiMentor"
import { ProgressPanel } from "./ProgressPanel"
import { EvolutionPanel } from "./EvolutionPanel"
import { LivePreview } from "./LivePreview"
import { executarCodigo } from "@/lib/editor"

type Modo = "estudo" | "laboratorio" | "projeto"

interface Exemplo {
  nome: string
  codigo: string
  html?: string
  css?: string
}

interface LinhaConsole {
  tipo: "log" | "erro" | "aviso" | "info" | "sistema"
  texto: string
}

interface ModoProjeto {
  nome: string
  missoes: { id: string; titulo: string; descricao: string; concluida: boolean; xp: number }[]
  xpTotal: number
}

interface LearningLabProps {
  titulo?: string
  modulo?: string
  licaoAtual?: number
  totalLicoes?: number
  missao?: {
    titulo: string
    descricao: string
    xp: number
    dica?: string
  }
  exemplos?: Exemplo[]
  projeto?: ModoProjeto
}

const modos: { id: Modo; label: string; desc: string }[] = [
  { id: "estudo", label: "📖 Estudo", desc: "Foco em JavaScript" },
  { id: "laboratorio", label: "🧪 Laboratório", desc: "HTML + CSS + JS + Preview" },
  { id: "projeto", label: "🏗️ Projeto", desc: "Missões guiadas" },
]

export function LearningLab({
  titulo = "DevEstudos",
  modulo,
  licaoAtual,
  totalLicoes,
  missao,
  exemplos = [],
  projeto,
}: LearningLabProps) {
  const [modo, setModo] = useState<Modo>("estudo")
  const [codigo, setCodigo] = useState("")
  const [codigoHtml, setCodigoHtml] = useState("<h1>Olá, Mundo!</h1>\n<p>Edite o HTML aqui</p>")
  const [codigoCss, setCodigoCss] = useState("h1 { color: #3b82f6; }\np { font-size: 18px; }")
  const [codigoLabJs, setCodigoLabJs] = useState(`console.log("Olá do JavaScript!")`)
  const [linhas, setLinhas] = useState<LinhaConsole[]>([])
  const [status, setStatus] = useState<"idle" | "executando" | "ok" | "erro">("idle")
  const [tempoMs, setTempoMs] = useState<number | undefined>()


  useEffect(() => {
    const draft = localStorage.getItem("editor-draft")
    if (exemplos.length > 0 && !draft) {
      setCodigo(exemplos[0].codigo)
    } else if (draft && exemplos.some(e => e.codigo === draft)) {
      setCodigo(draft)
    } else if (exemplos.length > 0) {
      setCodigo(exemplos[0].codigo)
    }
  }, [])

  const handleExecutar = useCallback(() => {
    setStatus("executando")
    setLinhas(l => [...l, { tipo: "sistema", texto: "Executando..." }])

    setTimeout(() => {
      const res = executarCodigo(codigo)
      setTempoMs(res.tempoMs)

      const novasLinhas: LinhaConsole[] = []
      if (res.valido) {
        res.logs.forEach(log => novasLinhas.push({ tipo: "log", texto: log }))
        setStatus("ok")
      } else {
        novasLinhas.push({ tipo: "erro", texto: res.erro })
        setStatus("erro")
      }

      setLinhas(novasLinhas.length > 0 ? novasLinhas : [{ tipo: "sistema", texto: "Código executado sem saída." }])
    }, 100)
  }, [codigo])

  const handleExecutarLabJs = useCallback(() => {
    setStatus("executando")
    setLinhas(l => [...l, { tipo: "sistema", texto: "Executando JS..." }])

    setTimeout(() => {
      const res = executarCodigo(codigoLabJs)
      setTempoMs(res.tempoMs)

      const novasLinhas: LinhaConsole[] = []
      if (res.valido) {
        res.logs.forEach(log => novasLinhas.push({ tipo: "log", texto: log }))
        setStatus("ok")
      } else {
        novasLinhas.push({ tipo: "erro", texto: res.erro })
        setStatus("erro")
      }

      setLinhas(novasLinhas.length > 0 ? novasLinhas : [{ tipo: "sistema", texto: "Código JS executado sem saída." }])
    }, 100)
  }, [codigoLabJs])

  const handleLimpar = useCallback(() => {
    if (modo === "laboratorio") {
      setCodigoHtml("")
      setCodigoCss("")
      setCodigoLabJs("")
    } else {
      setCodigo("")
    }
    setLinhas([])
    setStatus("idle")
    setTempoMs(undefined)
  }, [modo])

  const handleRestaurar = useCallback(() => {
    if (modo === "laboratorio") {
      setCodigoHtml("<h1>Olá, Mundo!</h1>\n<p>Edite o HTML aqui</p>")
      setCodigoCss("h1 { color: #3b82f6; }\np { font-size: 18px; }")
      setCodigoLabJs(`console.log("Olá do JavaScript!")`)
    } else if (exemplos.length > 0) {
      setCodigo(exemplos[0].codigo)
    }
    setLinhas([])
    setStatus("idle")
    setTempoMs(undefined)
  }, [exemplos, modo])

  const codigoAtual = modo === "laboratorio" ? codigoLabJs : codigo

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
      <LabHeader titulo={titulo} modulo={modulo} licaoAtual={licaoAtual} totalLicoes={totalLicoes} />

      <div className="flex items-center gap-2 bg-[#161b22] border border-gray-700 rounded-xl p-1.5">
        {modos.map(m => (
          <button
            key={m.id}
            onClick={() => setModo(m.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
              modo === m.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <span className="block leading-tight">{m.label}</span>
            <span className={`block text-[10px] mt-0.5 ${modo === m.id ? "text-blue-200" : "text-gray-600"}`}>{m.desc}</span>
          </button>
        ))}
      </div>

      {modo === "projeto" && projeto && (
        <div className="bg-[#161b22] border border-gray-700 rounded-xl p-4 space-y-2">
          <h2 className="text-lg font-bold">🏗️ {projeto.nome}</h2>
          <div className="space-y-1.5">
            {projeto.missoes.map(m => (
              <label key={m.id} className="flex items-center gap-3 px-3 py-2 bg-gray-800/40 rounded-lg cursor-pointer hover:bg-gray-800/60 transition-colors">
                <input type="checkbox" checked={m.concluida} readOnly className="w-4 h-4 accent-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{m.titulo}</p>
                  <p className="text-xs text-gray-500">{m.descricao}</p>
                </div>
                <span className="text-xs text-yellow-500">+{m.xp} XP</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 text-sm border-t border-gray-700">
            <span className="text-gray-400">XP Total</span>
            <span className="text-yellow-500 font-bold">{projeto.xpTotal} XP</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <div className="space-y-4">
          {modo === "estudo" && (
            <>
              {missao && (
                <MissionCard
                  titulo={missao.titulo}
                  descricao={missao.descricao}
                  xp={missao.xp}
                  dica={missao.dica}
                />
              )}

              {exemplos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {exemplos.map((ex) => (
                    <button
                      key={ex.nome}
                      onClick={() => {
                        setCodigo(ex.codigo)
                        setLinhas([])
                        setStatus("idle")
                        setTempoMs(undefined)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        codigo === ex.codigo
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {ex.nome}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-500">JavaScript</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLimpar}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={handleRestaurar}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={handleExecutar}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>▶</span> Executar
                  </button>
                </div>
              </div>

              <CodeEditor
                value={codigo}
                onChange={setCodigo}
                height="300px"
                placeholder="// digite seu código aqui"
                onRun={handleExecutar}
              />

              <ConsolePanel linhas={linhas} tempoMs={tempoMs} status={status} />
            </>
          )}

          {modo === "laboratorio" && (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">HTML</label>
                  <CodeEditor
                    value={codigoHtml}
                    onChange={setCodigoHtml}
                    language="html"
                    height="200px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">CSS</label>
                  <CodeEditor
                    value={codigoCss}
                    onChange={setCodigoCss}
                    language="css"
                    height="200px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">JavaScript</label>
                  <CodeEditor
                    value={codigoLabJs}
                    onChange={setCodigoLabJs}
                    height="200px"
                    onRun={handleExecutarLabJs}
                  />
                </div>
              </div>

              <LivePreview html={codigoHtml} css={codigoCss} js={codigoLabJs} height="280px" />

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-500">Console</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLimpar}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={handleRestaurar}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={handleExecutarLabJs}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>▶</span> Executar
                  </button>
                </div>
              </div>

              <ConsolePanel linhas={linhas} tempoMs={tempoMs} status={status} />
            </>
          )}

          {modo === "projeto" && (
            <>
              <MissionCard
                titulo={missao?.titulo ?? "Complete as missões acima"}
                descricao={missao?.descricao ?? "Selecione uma missão do projeto e comece a codificar."}
                xp={0}
              />
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-500">JavaScript</label>
                <button
                  onClick={handleExecutar}
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>▶</span> Executar
                </button>
              </div>
              <CodeEditor
                value={codigo}
                onChange={setCodigo}
                height="300px"
                placeholder="// escreva seu código aqui"
                onRun={handleExecutar}
              />
              <ConsolePanel linhas={linhas} tempoMs={tempoMs} status={status} />
            </>
          )}
        </div>

        <div className="space-y-3">
          <EvolutionPanel />
          <AiMentor
            codigo={codigoAtual}
            erro={linhas.find(l => l.tipo === "erro")?.texto}
          />
          <ProgressPanel />
        </div>
      </div>
    </div>
  )
}
