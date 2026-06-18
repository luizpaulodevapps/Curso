"use client"

import { useEffect, useRef } from "react"

interface ConsoleLine {
  tipo: "log" | "erro" | "aviso" | "info" | "sistema"
  texto: string
}

interface ConsolePanelProps {
  linhas: ConsoleLine[]
  tempoMs?: number
  status?: "idle" | "executando" | "ok" | "erro"
}

export function ConsolePanel({ linhas, tempoMs, status = "idle" }: ConsolePanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [linhas])

  const corStatus = status === "ok" ? "text-green-400" : status === "erro" ? "text-red-400" : status === "executando" ? "text-yellow-400" : "text-gray-500"

  return (
    <div className="bg-[#0d1117] border border-gray-700 rounded-xl overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">Console</span>
        </div>
        {status !== "idle" && (
          <span className={`text-xs ${corStatus}`}>
            {status === "executando" && "Executando..."}
            {status === "ok" && `OK${tempoMs !== undefined ? ` — ${tempoMs}ms` : ""}`}
            {status === "erro" && `Erro${tempoMs !== undefined ? ` — ${tempoMs}ms` : ""}`}
          </span>
        )}
      </div>
      <div ref={ref} className="p-4 min-h-[160px] max-h-[320px] overflow-y-auto space-y-1">
        {linhas.length === 0 ? (
          <span className="text-gray-600">Clique em Executar ou pressione Ctrl+Enter</span>
        ) : (
          linhas.map((l, i) => (
            <div key={i} className={
              l.tipo === "erro" ? "text-red-400" :
              l.tipo === "aviso" ? "text-yellow-400" :
              l.tipo === "info" ? "text-blue-400" :
              l.tipo === "sistema" ? "text-gray-500 italic" :
              "text-gray-100"
            }>
              <span className="text-gray-600 mr-2">{`>`}</span>
              {l.texto}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
